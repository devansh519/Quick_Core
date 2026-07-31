const Brand = require("../models/brand.model");
const ApiError = require("../utils/ApiError");

// Lowercase, strict, trimmed slug derived from the brand name
function generateSlug(name) {
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Fall back to a generic slug for symbol-only names
    return slug || "brand";
}

async function createBrand(brandData) {
    const existingBrand = await Brand.findOne({
        name: brandData.name,
    });

    if (existingBrand) {
        throw new ApiError(409, "Brand already exists");
    }

    const slug = generateSlug(brandData.name);

    return await Brand.create({ ...brandData, slug });
}

async function getAllBrands(query) {
    const {
        page = 1,
        limit = 10,
        search = "",
    } = query;

    const filter = {
        isActive: true,
    };

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
        Brand.find(filter)
            .sort({ displayOrder: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),

        Brand.countDocuments(filter),
    ]);

    return {
        brands,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function getBrandById(id) {
    const brand = await Brand.findById(id);

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return brand;
}

async function updateBrand(id, updateData) {
    const data = { ...updateData };

    if (data.name) {
        data.slug = generateSlug(data.name);
    }

    const brand = await Brand.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return brand;
}

async function deleteBrand(id) {
    const brand = await Brand.findById(id);

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    brand.isActive = false;

    await brand.save();

    return true;
}

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};

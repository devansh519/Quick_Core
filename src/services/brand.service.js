const Brand = require("../models/brand.model");
const ApiError = require("../utils/ApiError");

async function createBrand(brandData) {
    const existingBrand = await Brand.findOne({
        name: brandData.name,
    });

    if (existingBrand) {
        throw new ApiError(409, "Brand already exists");
    }

    return await Brand.create(brandData);
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
    const brand = await Brand.findByIdAndUpdate(
        id,
        updateData,
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
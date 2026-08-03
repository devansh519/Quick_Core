const Brand = require("../models/brand.model");
const ApiError = require("../utils/ApiError");
const cacheService = require("./cache.service");
const CACHE_KEYS = require("../utils/cacheKeys");

const BRAND_CACHE_TTL = 1800; // seconds (30 minutes)

async function createBrand(brandData) {
    const existingBrand = await Brand.findOne({
        name: brandData.name,
    });

    if (existingBrand) {
        throw new ApiError(409, "Brand already exists");
    }

    const brand = await Brand.create(brandData);

    // Invalidate the brands listing cache
    await cacheService.del(CACHE_KEYS.brands.all());

    return brand;
}

async function getAllBrands(query) {
    const {
        page = 1,
        limit = 10,
        search = "",
    } = query;

    // Only the default listing (no filters, first page) is cached.
    // Filtered/paginated reads bypass the cache to avoid serving
    // wrong results from the single brands:all key.
    const isDefaultListing =
        !search &&
        Number(page) === 1 &&
        Number(limit) === 10;

    const cacheKey = CACHE_KEYS.brands.all();

    if (isDefaultListing) {

        const cached = await cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }
    }

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

    const result = {
        brands,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

    if (isDefaultListing) {
        await cacheService.set(cacheKey, result, BRAND_CACHE_TTL);
    }

    return result;
}

async function getBrandById(id) {

    const cacheKey = CACHE_KEYS.brands.byId(id);

    const cached = await cacheService.get(cacheKey);

    if (cached) {
        return cached;
    }

    const brand = await Brand.findById(id);

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    await cacheService.set(cacheKey, brand, BRAND_CACHE_TTL);

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

    // Invalidate listing + single brand caches
    await cacheService.delMany([
        CACHE_KEYS.brands.all(),
        CACHE_KEYS.brands.byId(id),
    ]);

    return brand;
}

async function deleteBrand(id) {
    const brand = await Brand.findById(id);

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    brand.isActive = false;

    await brand.save();

    // Invalidate listing + single brand caches
    await cacheService.delMany([
        CACHE_KEYS.brands.all(),
        CACHE_KEYS.brands.byId(id),
    ]);

    return true;
}

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};

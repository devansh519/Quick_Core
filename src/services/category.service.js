const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");
const cacheService = require("./cache.service");
const CACHE_KEYS = require("../utils/cacheKeys");

const CATEGORY_CACHE_TTL = 1800; // seconds (30 minutes)

async function createCategory(categoryData) {
    const existingCategory = await Category.findOne({
        name: categoryData.name,
    });

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    const category = await Category.create(categoryData);

    // Invalidate the categories listing cache
    await cacheService.del(CACHE_KEYS.categories.all());

    return category;
}

async function getAllCategories(query) {
    const {
        page = 1,
        limit = 10,
        search = "",
    } = query;

    // Only the default listing (no filters, first page) is cached.
    // Filtered/paginated reads bypass the cache to avoid serving
    // wrong results from the single categories:all key.
    const isDefaultListing =
        !search &&
        Number(page) === 1 &&
        Number(limit) === 10;

    const cacheKey = CACHE_KEYS.categories.all();

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

    const [categories, total] = await Promise.all([
        Category.find(filter)
            .sort({ displayOrder: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),

        Category.countDocuments(filter),
    ]);

    const result = {
        categories,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

    if (isDefaultListing) {
        await cacheService.set(cacheKey, result, CATEGORY_CACHE_TTL);
    }

    return result;
}

async function getCategoryById(id) {

    const cacheKey = CACHE_KEYS.categories.byId(id);

    const cached = await cacheService.get(cacheKey);

    if (cached) {
        return cached;
    }

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    await cacheService.set(cacheKey, category, CATEGORY_CACHE_TTL);

    return category;
}

async function updateCategory(id, updateData) {
    const category = await Category.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Invalidate listing + single category caches
    await cacheService.delMany([
        CACHE_KEYS.categories.all(),
        CACHE_KEYS.categories.byId(id),
    ]);

    return category;
}

async function deleteCategory(id) {
    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    category.isActive = false;

    await category.save();

    // Invalidate listing + single category caches
    await cacheService.delMany([
        CACHE_KEYS.categories.all(),
        CACHE_KEYS.categories.byId(id),
    ]);

    return true;
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};

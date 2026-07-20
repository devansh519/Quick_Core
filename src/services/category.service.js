const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

async function createCategory(categoryData) {
    const existingCategory = await Category.findOne({
        name: categoryData.name,
    });

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    return await Category.create(categoryData);
}

async function getAllCategories(query) {
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

    const [categories, total] = await Promise.all([
        Category.find(filter)
            .sort({ displayOrder: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),

        Category.countDocuments(filter),
    ]);

    return {
        categories,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function getCategoryById(id) {
    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

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

    return category;
}

async function deleteCategory(id) {
    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    category.isActive = false;

    await category.save();

    return true;
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
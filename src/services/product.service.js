const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const ApiError = require("../utils/ApiError");

async function createProduct(productData) {

    const existingProduct = await Product.findOne({
        $or: [
            { slug: productData.slug },
            { sku: productData.sku },
        ],
    });

    if (existingProduct) {
        throw new ApiError(
            409,
            "Product with same slug or SKU already exists"
        );
    }

    const category = await Category.findById(productData.category);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const brand = await Brand.findById(productData.brand);

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return await Product.create(productData);
}

async function getAllProducts(query) {

    const {
        page = 1,
        limit = 10,
        search = "",
        category,
        brand,
        minPrice,
        maxPrice,
    } = query;

    const filter = {
        isActive: true,
    };

    if (search) {
        filter.$text = {
            $search: search,
        };
    }

    if (category) {
        filter.category = category;
    }

    if (brand) {
        filter.brand = brand;
    }

    if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice)
            filter.price.$gte = Number(minPrice);

        if (maxPrice)
            filter.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([

        Product.find(filter)
            .populate("category", "name")
            .populate("brand", "name")
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(Number(limit)),

        Product.countDocuments(filter),

    ]);

    return {
        products,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function getProductById(id) {

    const product = await Product.findById(id)
        .populate("category", "name slug")
        .populate("brand", "name slug");

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return product;
}

async function updateProduct(id, updateData) {

    if (updateData.category) {

        const category = await Category.findById(
            updateData.category
        );

        if (!category) {
            throw new ApiError(
                404,
                "Category not found"
            );
        }
    }

    if (updateData.brand) {

        const brand = await Brand.findById(
            updateData.brand
        );

        if (!brand) {
            throw new ApiError(
                404,
                "Brand not found"
            );
        }
    }

    const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("category", "name")
        .populate("brand", "name");

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return product;
}

async function deleteProduct(id) {

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    product.isActive = false;

    await product.save();

    return true;
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
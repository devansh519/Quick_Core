const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const ApiError = require("../utils/ApiError");
const cacheService = require("./cache.service");
const CACHE_KEYS = require("../utils/cacheKeys");

const PRODUCT_CACHE_TTL = 600; // seconds (10 minutes)

async function createProduct(productData) {

    const existingProduct = await Product.findOne({
        sku: productData.sku,
    });

    if (existingProduct) {
        throw new ApiError(
            409,
            "Product with same SKU already exists"
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

    const product = await Product.create(productData);

    // Invalidate the products listing cache
    await cacheService.del(CACHE_KEYS.products.all());

    return product;
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

    // Only the default listing (no filters, first page) is cached.
    // Filtered/paginated reads bypass the cache to avoid serving
    // wrong results from the single products:all key.
    const isDefaultListing =
        !search &&
        !category &&
        !brand &&
        !minPrice &&
        !maxPrice &&
        Number(page) === 1 &&
        Number(limit) === 10;

    const cacheKey = CACHE_KEYS.products.all();

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

    const result = {
        products,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

    if (isDefaultListing) {
        await cacheService.set(cacheKey, result, PRODUCT_CACHE_TTL);
    }

    return result;
}

async function getProductById(id) {

    const cacheKey = CACHE_KEYS.products.byId(id);

    const cached = await cacheService.get(cacheKey);

    if (cached) {
        return cached;
    }

    const product = await Product.findById(id)
        .populate("category", "name")
        .populate("brand", "name");

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    await cacheService.set(cacheKey, product, PRODUCT_CACHE_TTL);

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

    // Invalidate listing + single product caches
    await cacheService.delMany([
        CACHE_KEYS.products.all(),
        CACHE_KEYS.products.byId(id),
    ]);

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

    // Invalidate listing + single product caches
    await cacheService.delMany([
        CACHE_KEYS.products.all(),
        CACHE_KEYS.products.byId(id),
    ]);

    return true;
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};

const Inventory = require("../models/inventory.model");
const Warehouse = require("../models/warehouse.model");
const Product = require("../models/product.model");

const ApiError = require("../utils/ApiError");
const cacheService = require("./cache.service");
const CACHE_KEYS = require("../utils/cacheKeys");

const INVENTORY_CACHE_TTL = 30; // seconds

async function createInventory(inventoryData) {

    const warehouse = await Warehouse.findById(
        inventoryData.warehouse
    );

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    const product = await Product.findById(
        inventoryData.product
    );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    const existingInventory =
        await Inventory.findOne({
            warehouse: inventoryData.warehouse,
            product: inventoryData.product,
        });

    if (existingInventory) {
        throw new ApiError(
            409,
            "Inventory already exists for this warehouse and product"
        );
    }

    const inventory = await Inventory.create(inventoryData);

    // Invalidate cached inventory reads for this warehouse/product
    await cacheService.delMany([
        CACHE_KEYS.inventory.byWarehouse(inventoryData.warehouse),
        CACHE_KEYS.inventory.byProduct(inventoryData.product),
        CACHE_KEYS.inventory.byWarehouseProduct(
            inventoryData.warehouse,
            inventoryData.product
        ),
    ]);

    return inventory;
}

async function getAllInventories(query) {

    const {
        page = 1,
        limit = 10,
        warehouse,
        product,
    } = query;

    // Only filtered reads (warehouse and/or product, first page) are
    // cached. Unfiltered listings have no cache key and hit MongoDB.
    const isCacheable =
        (warehouse || product) &&
        Number(page) === 1 &&
        Number(limit) === 10;

    let cacheKey = null;

    if (isCacheable) {

        if (warehouse && product) {
            cacheKey = CACHE_KEYS.inventory.byWarehouseProduct(
                warehouse,
                product
            );
        } else if (warehouse) {
            cacheKey = CACHE_KEYS.inventory.byWarehouse(warehouse);
        } else {
            cacheKey = CACHE_KEYS.inventory.byProduct(product);
        }

        const cached = await cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }
    }

    const filter = {
        isActive: true,
    };

    if (warehouse) {
        filter.warehouse = warehouse;
    }

    if (product) {
        filter.product = product;
    }

    const skip = (page - 1) * limit;

    const [inventories, total] =
        await Promise.all([

            Inventory.find(filter)
                .populate(
                    "warehouse",
                    "name code"
                )
                .populate(
                    "product",
                    "name sku"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(Number(limit)),

            Inventory.countDocuments(filter),

        ]);

    const result = {
        inventories,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(
                total / limit
            ),
        },
    };

    if (cacheKey) {
        await cacheService.set(cacheKey, result, INVENTORY_CACHE_TTL);
    }

    return result;
}

async function getInventoryById(id) {

    const inventory =
        await Inventory.findById(id)
            .populate(
                "warehouse",
                "name code"
            )
            .populate(
                "product",
                "name sku"
            );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    return inventory;
}

async function updateInventory(
    id,
    updateData
) {

    if (updateData.warehouse) {

        const warehouse =
            await Warehouse.findById(
                updateData.warehouse
            );

        if (!warehouse) {
            throw new ApiError(
                404,
                "Warehouse not found"
            );
        }
    }

    if (updateData.product) {

        const product =
            await Product.findById(
                updateData.product
            );

        if (!product) {
            throw new ApiError(
                404,
                "Product not found"
            );
        }
    }

    const inventory =
        await Inventory.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                "warehouse",
                "name code"
            )
            .populate(
                "product",
                "name sku"
            );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    // Invalidate cached reads for the (possibly changed) warehouse/product
    const warehouseId =
        inventory.warehouse?._id || inventory.warehouse;
    const productId =
        inventory.product?._id || inventory.product;

    await cacheService.delMany([
        CACHE_KEYS.inventory.byWarehouse(warehouseId),
        CACHE_KEYS.inventory.byProduct(productId),
        CACHE_KEYS.inventory.byWarehouseProduct(
            warehouseId,
            productId
        ),
    ]);

    return inventory;
}

async function deleteInventory(id) {

    const inventory =
        await Inventory.findById(id);

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    inventory.isActive = false;

    await inventory.save();

    // Invalidate cached reads for this warehouse/product
    await cacheService.delMany([
        CACHE_KEYS.inventory.byWarehouse(inventory.warehouse),
        CACHE_KEYS.inventory.byProduct(inventory.product),
        CACHE_KEYS.inventory.byWarehouseProduct(
            inventory.warehouse,
            inventory.product
        ),
    ]);

    return true;
}

module.exports = {
    createInventory,
    getAllInventories,
    getInventoryById,
    updateInventory,
    deleteInventory,
};

const Inventory = require("../models/inventory.model");
const Warehouse = require("../models/warehouse.model");
const Product = require("../models/product.model");

const ApiError = require("../utils/ApiError");

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

    return await Inventory.create(inventoryData);
}

async function getAllInventories(query) {

    const {
        page = 1,
        limit = 10,
        warehouse,
        product,
    } = query;

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

    return {
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

    return true;
}

module.exports = {
    createInventory,
    getAllInventories,
    getInventoryById,
    updateInventory,
    deleteInventory,
};
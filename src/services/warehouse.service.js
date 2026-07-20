const Warehouse = require("../models/warehouse.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

async function createWarehouse(warehouseData) {

    const existingWarehouse = await Warehouse.findOne({
        code: warehouseData.code,
    });

    if (existingWarehouse) {
        throw new ApiError(
            409,
            "Warehouse code already exists"
        );
    }

    if (warehouseData.manager) {

        const manager = await User.findById(
            warehouseData.manager
        );

        if (!manager) {
            throw new ApiError(
                404,
                "Manager not found"
            );
        }
    }

    return await Warehouse.create(warehouseData);
}

async function getAllWarehouses(query) {

    const {
        page = 1,
        limit = 10,
        search = "",
        status,
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

    if (status) {
        filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [warehouses, total] =
        await Promise.all([

            Warehouse.find(filter)
                .populate(
                    "manager",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(Number(limit)),

            Warehouse.countDocuments(filter),

        ]);

    return {
        warehouses,
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

async function getWarehouseById(id) {

    const warehouse =
        await Warehouse.findById(id)
            .populate(
                "manager",
                "name email phone"
            );

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    return warehouse;
}

async function updateWarehouse(
    id,
    updateData
) {

    if (updateData.manager) {

        const manager =
            await User.findById(
                updateData.manager
            );

        if (!manager) {
            throw new ApiError(
                404,
                "Manager not found"
            );
        }
    }

    const warehouse =
        await Warehouse.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate(
            "manager",
            "name email"
        );

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    return warehouse;
}

async function deleteWarehouse(id) {

    const warehouse =
        await Warehouse.findById(id);

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    warehouse.isActive = false;

    await warehouse.save();

    return true;
}

module.exports = {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse,
};
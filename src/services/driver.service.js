const Driver = require("../models/driver.model");
const User = require("../models/user.model");
const Warehouse = require("../models/warehouse.model");

const ApiError = require("../utils/ApiError");

async function createDriver(driverData) {

    const user = await User.findById(driverData.user);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const warehouse = await Warehouse.findById(
        driverData.warehouse
    );

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    const existingDriver = await Driver.findOne({
        user: driverData.user,
    });

    if (existingDriver) {
        throw new ApiError(
            409,
            "Driver already exists"
        );
    }

    return await Driver.create(driverData);
}

async function getAllDrivers(query) {

    const {
        page = 1,
        limit = 10,
        warehouse,
        status,
    } = query;

    const filter = {};

    if (warehouse) {
        filter.warehouse = warehouse;
    }

    if (status) {
        filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [drivers, total] = await Promise.all([

        Driver.find(filter)
            .populate(
                "user",
                "name email phone"
            )
            .populate(
                "warehouse",
                "name code"
            )
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(Number(limit)),

        Driver.countDocuments(filter),

    ]);

    return {
        drivers,
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

async function getDriverById(id) {

    const driver = await Driver.findById(id)
        .populate(
            "user",
            "name email phone"
        )
        .populate(
            "warehouse",
            "name code"
        );

    if (!driver) {
        throw new ApiError(
            404,
            "Driver not found"
        );
    }

    return driver;

}

async function updateDriver(
    id,
    updateData
) {

    if (updateData.user) {

        const user = await User.findById(
            updateData.user
        );

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

    }

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

    const driver =
        await Driver.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                "user",
                "name email phone"
            )
            .populate(
                "warehouse",
                "name code"
            );

    if (!driver) {
        throw new ApiError(
            404,
            "Driver not found"
        );
    }

    return driver;

}

async function deleteDriver(id) {

    const driver =
        await Driver.findById(id);

    if (!driver) {
        throw new ApiError(
            404,
            "Driver not found"
        );
    }

    await driver.deleteOne();

    return true;

}

module.exports = {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
};
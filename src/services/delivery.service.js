const Delivery = require("../models/delivery.model");
const Order = require("../models/order.model");
const Driver = require("../models/driver.model");
const Warehouse = require("../models/warehouse.model");

const ApiError = require("../utils/ApiError");

async function createDelivery(deliveryData) {

    const order = await Order.findById(deliveryData.order);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    const warehouse = await Warehouse.findById(
        deliveryData.warehouse
    );

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    if (deliveryData.driver) {

        const driver = await Driver.findById(
            deliveryData.driver
        );

        if (!driver) {
            throw new ApiError(
                404,
                "Driver not found"
            );
        }

    }

    const existingDelivery =
        await Delivery.findOne({
            order: deliveryData.order,
        });

    if (existingDelivery) {
        throw new ApiError(
            409,
            "Delivery already exists for this order"
        );
    }

    return await Delivery.create(deliveryData);

}

async function getAllDeliveries(query) {

    const {
        page = 1,
        limit = 10,
        status,
        driver,
        warehouse,
    } = query;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (driver) {
        filter.driver = driver;
    }

    if (warehouse) {
        filter.warehouse = warehouse;
    }

    const skip = (page - 1) * limit;

    const [deliveries, total] =
        await Promise.all([

            Delivery.find(filter)
                .populate(
                    "order",
                    "orderNumber status"
                )
                .populate(
                    "driver"
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

            Delivery.countDocuments(filter),

        ]);

    return {
        deliveries,
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

async function getDeliveryById(id) {

    const delivery =
        await Delivery.findById(id)
            .populate(
                "order"
            )
            .populate(
                "driver"
            )
            .populate(
                "warehouse"
            );

    if (!delivery) {
        throw new ApiError(
            404,
            "Delivery not found"
        );
    }

    return delivery;

}

async function updateDelivery(
    id,
    updateData
) {

    if (updateData.driver) {

        const driver =
            await Driver.findById(
                updateData.driver
            );

        if (!driver) {
            throw new ApiError(
                404,
                "Driver not found"
            );
        }

    }

    const delivery =
        await Delivery.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("order")
            .populate("driver")
            .populate("warehouse");

    if (!delivery) {
        throw new ApiError(
            404,
            "Delivery not found"
        );
    }

    return delivery;

}

async function deleteDelivery(id) {

    const delivery =
        await Delivery.findById(id);

    if (!delivery) {
        throw new ApiError(
            404,
            "Delivery not found"
        );
    }

    await delivery.deleteOne();

    return true;

}

module.exports = {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
};
const Joi = require("joi");

const createOrderSchema = Joi.object({
    warehouse: Joi.string()
        .hex()
        .length(24)
        .required(),

    deliveryAddress: Joi.string()
        .hex()
        .length(24)
        .required(),

    coupon: Joi.string()
        .hex()
        .length(24)
        .allow(null)
        .optional(),

    notes: Joi.string()
        .max(300)
        .allow("")
        .optional(),
});

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            "placed",
            "confirmed",
            "packing",
            "ready",
            "picked_up",
            "delivered",
            "cancelled"
        )
        .required(),
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema,
};
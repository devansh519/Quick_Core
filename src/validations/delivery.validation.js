const Joi = require("joi");

const createDeliverySchema = Joi.object({
    order: Joi.string()
        .hex()
        .length(24)
        .required(),

    warehouse: Joi.string()
        .hex()
        .length(24)
        .required(),

    driver: Joi.string()
        .hex()
        .length(24)
        .allow(null)
        .optional(),

    estimatedDeliveryTime: Joi.date()
        .optional(),

    deliveryNotes: Joi.string()
        .allow("")
        .optional(),
});

const updateDeliverySchema = Joi.object({
    driver: Joi.string()
        .hex()
        .length(24),

    status: Joi.string()
        .valid(
            "pending",
            "assigned",
            "picked_up",
            "out_for_delivery",
            "delivered",
            "failed",
            "cancelled"
        ),

    pickupTime: Joi.date(),

    dispatchTime: Joi.date(),

    deliveredTime: Joi.date(),

    estimatedDeliveryTime: Joi.date(),

    actualDistance: Joi.number()
        .min(0),

    deliveryNotes: Joi.string()
        .allow(""),
}).min(1);

module.exports = {
    createDeliverySchema,
    updateDeliverySchema,
};
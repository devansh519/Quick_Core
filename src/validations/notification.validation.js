const Joi = require("joi");

const createNotificationSchema = Joi.object({
    recipient: Joi.string()
        .hex()
        .length(24)
        .required(),

    title: Joi.string()
        .trim()
        .max(100)
        .required(),

    message: Joi.string()
        .trim()
        .max(500)
        .required(),

    type: Joi.string()
        .valid(
            "order",
            "payment",
            "delivery",
            "coupon",
            "system"
        )
        .default("system"),

    metadata: Joi.object()
        .optional(),
});

const updateNotificationSchema = Joi.object({
    isRead: Joi.boolean()
        .required(),
});

module.exports = {
    createNotificationSchema,
    updateNotificationSchema,
};
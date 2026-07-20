const Joi = require("joi");

const createWarehouseSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    code: Joi.string()
        .trim()
        .uppercase()
        .required(),

    manager: Joi.string()
        .hex()
        .length(24)
        .optional()
        .allow(null),

    address: Joi.string()
        .trim()
        .required(),

    location: Joi.object({
        type: Joi.string()
            .valid("Point")
            .default("Point"),

        coordinates: Joi.array()
            .items(Joi.number())
            .length(2)
            .required(),
    }).required(),

    serviceRadius: Joi.number()
        .min(1)
        .required(),

    capacity: Joi.number()
        .min(0)
        .optional(),

    currentLoad: Joi.number()
        .min(0)
        .optional(),

    status: Joi.string()
        .valid(
            "active",
            "inactive",
            "maintenance"
        )
        .optional(),

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .optional(),

    isActive: Joi.boolean()
        .optional(),
});

const updateWarehouseSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    code: Joi.string()
        .trim()
        .uppercase(),

    manager: Joi.string()
        .hex()
        .length(24)
        .allow(null),

    address: Joi.string()
        .trim(),

    location: Joi.object({
        type: Joi.string()
            .valid("Point"),

        coordinates: Joi.array()
            .items(Joi.number())
            .length(2),
    }),

    serviceRadius: Joi.number()
        .min(1),

    capacity: Joi.number()
        .min(0),

    currentLoad: Joi.number()
        .min(0),

    status: Joi.string()
        .valid(
            "active",
            "inactive",
            "maintenance"
        ),

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/),

    isActive: Joi.boolean(),
}).min(1);

module.exports = {
    createWarehouseSchema,
    updateWarehouseSchema,
};
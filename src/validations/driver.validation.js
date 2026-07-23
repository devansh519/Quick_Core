const Joi = require("joi");

const createDriverSchema = Joi.object({
    user: Joi.string()
        .hex()
        .length(24)
        .required(),

    warehouse: Joi.string()
        .hex()
        .length(24)
        .required(),

    vehicleType: Joi.string()
        .valid(
            "bike",
            "scooter",
            "bicycle",
            "car"
        )
        .required(),

    vehicleNumber: Joi.string()
        .trim()
        .required(),

    licenseNumber: Joi.string()
        .trim()
        .required(),
});

const updateDriverSchema = Joi.object({
    warehouse: Joi.string()
        .hex()
        .length(24),

    vehicleType: Joi.string()
        .valid(
            "bike",
            "scooter",
            "bicycle",
            "car"
        ),

    vehicleNumber: Joi.string()
        .trim(),

    licenseNumber: Joi.string()
        .trim(),

    status: Joi.string()
        .valid(
            "offline",
            "online",
            "busy",
            "on_break"
        ),

    currentLocation: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    }),

    rating: Joi.number()
        .min(0)
        .max(5),

    totalDeliveries: Joi.number()
        .min(0),

    isAvailable: Joi.boolean(),
}).min(1);

module.exports = {
    createDriverSchema,
    updateDriverSchema,
};
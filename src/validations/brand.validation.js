const Joi = require("joi");

const createBrandSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    description: Joi.string()
        .trim()
        .max(300)
        .allow("")
        .optional(),

    image: Joi.string()
        .trim()
        .uri()
        .optional(),

    displayOrder: Joi.number()
        .integer()
        .min(0)
        .optional(),

    isActive: Joi.boolean()
        .optional(),
});

const updateBrandSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50),

    description: Joi.string()
        .trim()
        .max(300)
        .allow(""),

    image: Joi.string()
        .trim()
        .uri(),

    displayOrder: Joi.number()
        .integer()
        .min(0),

    isActive: Joi.boolean(),
}).min(1);

module.exports = {
    createBrandSchema,
    updateBrandSchema,
};
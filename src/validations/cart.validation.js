const Joi = require("joi");

const addItemSchema = Joi.object({
    product: Joi.string()
        .hex()
        .length(24)
        .required(),

    warehouse: Joi.string()
        .hex()
        .length(24)
        .required(),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required(),
});

const updateItemSchema = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(1)
        .required(),
});

module.exports = {
    addItemSchema,
    updateItemSchema,
};
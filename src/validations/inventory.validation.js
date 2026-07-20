const Joi = require("joi");

const createInventorySchema = Joi.object({
    warehouse: Joi.string()
        .hex()
        .length(24)
        .required(),

    product: Joi.string()
        .hex()
        .length(24)
        .required(),

    quantity: Joi.number()
        .min(0)
        .required(),

    reservedQuantity: Joi.number()
        .min(0)
        .optional(),

    reorderLevel: Joi.number()
        .min(0)
        .optional(),

    maxStockLevel: Joi.number()
        .min(1)
        .optional(),

    lastRestockedAt: Joi.date()
        .optional(),

    isActive: Joi.boolean()
        .optional(),
});

const updateInventorySchema = Joi.object({
    warehouse: Joi.string()
        .hex()
        .length(24),

    product: Joi.string()
        .hex()
        .length(24),

    quantity: Joi.number()
        .min(0),

    reservedQuantity: Joi.number()
        .min(0),

    reorderLevel: Joi.number()
        .min(0),

    maxStockLevel: Joi.number()
        .min(1),

    lastRestockedAt: Joi.date(),

    isActive: Joi.boolean(),
}).min(1);

module.exports = {
    createInventorySchema,
    updateInventorySchema,
};
const Joi = require("joi");

const createProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    slug: Joi.string()
        .trim()
        .lowercase()
        .required(),

    description: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .optional(),

    category: Joi.string()
        .hex()
        .length(24)
        .required(),

    brand: Joi.string()
        .hex()
        .length(24)
        .required(),

    images: Joi.array()
        .items(Joi.string().uri())
        .optional(),

    price: Joi.number()
        .min(0)
        .required(),

    discountPrice: Joi.number()
        .min(0)
        .max(Joi.ref("price"))
        .optional(),

    unit: Joi.string()
        .valid(
            "g",
            "kg",
            "ml",
            "l",
            "piece",
            "packet",
            "dozen"
        )
        .required(),

    quantityPerUnit: Joi.number()
        .min(0)
        .required(),

    sku: Joi.string()
        .trim()
        .uppercase()
        .required(),

    barcode: Joi.string()
        .trim()
        .optional(),

    isActive: Joi.boolean().optional(),
});

const updateProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(150),

    slug: Joi.string()
        .trim()
        .lowercase(),

    description: Joi.string()
        .trim()
        .max(1000)
        .allow(""),

    category: Joi.string()
        .hex()
        .length(24),

    brand: Joi.string()
        .hex()
        .length(24),

    images: Joi.array()
        .items(Joi.string().uri()),

    price: Joi.number().min(0),

    discountPrice: Joi.number().min(0),

    unit: Joi.string().valid(
        "g",
        "kg",
        "ml",
        "l",
        "piece",
        "packet",
        "dozen"
    ),

    quantityPerUnit: Joi.number().min(0),

    sku: Joi.string()
        .trim()
        .uppercase(),

    barcode: Joi.string()
        .trim(),

    isActive: Joi.boolean(),
}).min(1);

module.exports = {
    createProductSchema,
    updateProductSchema,
};
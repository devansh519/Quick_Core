const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(30)
        .required(),

    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required(),

    role: Joi.string()
        .valid("customer", "admin")
        .optional(),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required(),

    password: Joi.string()
        .required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};
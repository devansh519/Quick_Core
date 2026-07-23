const Joi = require("joi");

const createPaymentSchema = Joi.object({
    order: Joi.string()
        .hex()
        .length(24)
        .required(),

    paymentMethod: Joi.string()
        .valid(
            "upi",
            "card",
            "net_banking",
            "wallet",
            "cod"
        )
        .required(),

    paymentProvider: Joi.string()
        .valid(
            "razorpay",
            "stripe",
            "cashfree",
            "phonepe",
            "paytm",
            "cod"
        )
        .required(),
});

const updatePaymentStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            "pending",
            "processing",
            "successful",
            "failed",
            "cancelled",
            "refunded"
        )
        .required(),

    transactionId: Joi.string()
        .trim()
        .optional(),

    refundAmount: Joi.number()
        .min(0)
        .optional(),

    refundReason: Joi.string()
        .allow("")
        .optional(),
});

module.exports = {
    createPaymentSchema,
    updatePaymentStatusSchema,
};
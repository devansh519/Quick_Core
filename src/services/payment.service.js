const Payment = require("../models/payment.model");
const Order = require("../models/order.model");

const ApiError = require("../utils/ApiError");

function generateTransactionId() {
    return (
        "TXN-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 10000)
    );
}

async function createPayment(userId, paymentData) {

    const order = await Order.findById(paymentData.order);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (order.customer.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to pay for this order"
        );
    }

    const existingPayment = await Payment.findOne({
        order: paymentData.order,
    });

    if (existingPayment) {
        throw new ApiError(
            409,
            "Payment already exists for this order"
        );
    }

    const payment = await Payment.create({

        order: order._id,

        customer: userId,

        amount: order.total,

        paymentMethod: paymentData.paymentMethod,

        paymentProvider: paymentData.paymentProvider,

    });

    return payment;
}

async function getMyPayments(userId) {

    return await Payment.find({
        customer: userId,
    })
        .populate(
            "order",
            "orderNumber total status"
        )
        .sort({
            createdAt: -1,
        });

}

async function getPaymentById(paymentId, userId) {

    const payment = await Payment.findOne({
        _id: paymentId,
        customer: userId,
    }).populate(
        "order",
        "orderNumber total status"
    );

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    return payment;
}

async function updatePaymentStatus(paymentId, statusData) {

    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    payment.status = statusData.status;

    if (
        statusData.transactionId
    ) {
        payment.transactionId =
            statusData.transactionId;
    }

    if (
        statusData.status === "successful"
    ) {

        payment.paidAt = new Date();

        const order = await Order.findById(
            payment.order
        );

        order.paymentStatus = "paid";

        await order.save();

    }

    if (
        statusData.status === "failed"
    ) {

        const order = await Order.findById(
            payment.order
        );

        order.paymentStatus = "failed";

        await order.save();

    }

    if (
        statusData.status === "refunded"
    ) {

        payment.refundAmount =
            statusData.refundAmount || 0;

        payment.refundReason =
            statusData.refundReason || "";

        const order = await Order.findById(
            payment.order
        );

        order.paymentStatus = "refunded";

        await order.save();

    }

    await payment.save();

    return payment;
}

module.exports = {
    createPayment,
    getMyPayments,
    getPaymentById,
    updatePaymentStatus,
};
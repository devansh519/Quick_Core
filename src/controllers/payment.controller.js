const paymentService = require("../services/payment.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createPayment = asyncHandler(async (req, res) => {

    const payment = await paymentService.createPayment(
        req.user.id,
        req.body
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            payment,
            "Payment created successfully"
        )
    );

});

const getMyPayments = asyncHandler(async (req, res) => {

    const payments = await paymentService.getMyPayments(
        req.user.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            payments,
            "Payments fetched successfully"
        )
    );

});

const getPaymentById = asyncHandler(async (req, res) => {

    const payment = await paymentService.getPaymentById(
        req.params.id,
        req.user.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            payment,
            "Payment fetched successfully"
        )
    );

});

const updatePaymentStatus = asyncHandler(async (req, res) => {

    const payment =
        await paymentService.updatePaymentStatus(
            req.params.id,
            req.body
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            payment,
            "Payment updated successfully"
        )
    );

});

module.exports = {
    createPayment,
    getMyPayments,
    getPaymentById,
    updatePaymentStatus,
};
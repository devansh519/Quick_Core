const orderService = require("../services/order.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createOrder = asyncHandler(async (req, res) => {

    const order = await orderService.createOrder(
        req.user.id,
        req.body
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order created successfully"
        )
    );

});

const getMyOrders = asyncHandler(async (req, res) => {

    const orders = await orderService.getMyOrders(
        req.user.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );

});

const getOrderById = asyncHandler(async (req, res) => {

    const order = await orderService.getOrderById(
        req.params.id,
        req.user.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully"
        )
    );

});

const updateOrderStatus = asyncHandler(async (req, res) => {

    const order =
        await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order status updated successfully"
        )
    );

});

const cancelOrder = asyncHandler(async (req, res) => {

    const order =
        await orderService.cancelOrder(
            req.params.id,
            req.user.id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order cancelled successfully"
        )
    );

});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
};
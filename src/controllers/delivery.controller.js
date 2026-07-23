const deliveryService = require("../services/delivery.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createDelivery = asyncHandler(async (req, res) => {

    const delivery = await deliveryService.createDelivery(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            delivery,
            "Delivery created successfully"
        )
    );

});

const getAllDeliveries = asyncHandler(async (req, res) => {

    const deliveries = await deliveryService.getAllDeliveries(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            deliveries,
            "Deliveries fetched successfully"
        )
    );

});

const getDeliveryById = asyncHandler(async (req, res) => {

    const delivery = await deliveryService.getDeliveryById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            delivery,
            "Delivery fetched successfully"
        )
    );

});

const updateDelivery = asyncHandler(async (req, res) => {

    const delivery = await deliveryService.updateDelivery(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            delivery,
            "Delivery updated successfully"
        )
    );

});

const deleteDelivery = asyncHandler(async (req, res) => {

    await deliveryService.deleteDelivery(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Delivery deleted successfully"
        )
    );

});

module.exports = {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
};
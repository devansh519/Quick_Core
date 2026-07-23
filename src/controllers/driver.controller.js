const driverService = require("../services/driver.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createDriver = asyncHandler(async (req, res) => {

    const driver = await driverService.createDriver(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            driver,
            "Driver created successfully"
        )
    );

});

const getAllDrivers = asyncHandler(async (req, res) => {

    const drivers = await driverService.getAllDrivers(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            drivers,
            "Drivers fetched successfully"
        )
    );

});

const getDriverById = asyncHandler(async (req, res) => {

    const driver = await driverService.getDriverById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            driver,
            "Driver fetched successfully"
        )
    );

});

const updateDriver = asyncHandler(async (req, res) => {

    const driver = await driverService.updateDriver(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            driver,
            "Driver updated successfully"
        )
    );

});

const deleteDriver = asyncHandler(async (req, res) => {

    await driverService.deleteDriver(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Driver deleted successfully"
        )
    );

});

module.exports = {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
};
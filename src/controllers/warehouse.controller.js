const warehouseService = require("../services/warehouse.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createWarehouse = asyncHandler(async (req, res) => {

    const warehouse = await warehouseService.createWarehouse(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            warehouse,
            "Warehouse created successfully"
        )
    );

});

const getAllWarehouses = asyncHandler(async (req, res) => {

    const warehouses = await warehouseService.getAllWarehouses(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            warehouses,
            "Warehouses fetched successfully"
        )
    );

});

const getWarehouseById = asyncHandler(async (req, res) => {

    const warehouse = await warehouseService.getWarehouseById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            warehouse,
            "Warehouse fetched successfully"
        )
    );

});

const updateWarehouse = asyncHandler(async (req, res) => {

    const warehouse = await warehouseService.updateWarehouse(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            warehouse,
            "Warehouse updated successfully"
        )
    );

});

const deleteWarehouse = asyncHandler(async (req, res) => {

    await warehouseService.deleteWarehouse(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Warehouse deleted successfully"
        )
    );

});

module.exports = {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse,
};
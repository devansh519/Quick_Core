const inventoryService = require("../services/inventory.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createInventory = asyncHandler(async (req, res) => {

    const inventory = await inventoryService.createInventory(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            inventory,
            "Inventory created successfully"
        )
    );

});

const getAllInventories = asyncHandler(async (req, res) => {

    const inventories = await inventoryService.getAllInventories(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            inventories,
            "Inventories fetched successfully"
        )
    );

});

const getInventoryById = asyncHandler(async (req, res) => {

    const inventory = await inventoryService.getInventoryById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            inventory,
            "Inventory fetched successfully"
        )
    );

});

const updateInventory = asyncHandler(async (req, res) => {

    const inventory = await inventoryService.updateInventory(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            inventory,
            "Inventory updated successfully"
        )
    );

});

const deleteInventory = asyncHandler(async (req, res) => {

    await inventoryService.deleteInventory(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Inventory deleted successfully"
        )
    );

});

module.exports = {
    createInventory,
    getAllInventories,
    getInventoryById,
    updateInventory,
    deleteInventory,
};
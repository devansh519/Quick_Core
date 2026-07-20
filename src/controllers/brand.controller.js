const brandService = require("../services/brand.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createBrand = asyncHandler(async (req, res) => {

    const brand = await brandService.createBrand(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            brand,
            "Brand created successfully"
        )
    );

});

const getAllBrands = asyncHandler(async (req, res) => {

    const brands = await brandService.getAllBrands(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            brands,
            "Brands fetched successfully"
        )
    );

});

const getBrandById = asyncHandler(async (req, res) => {

    const brand = await brandService.getBrandById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            brand,
            "Brand fetched successfully"
        )
    );

});

const updateBrand = asyncHandler(async (req, res) => {

    const brand = await brandService.updateBrand(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            brand,
            "Brand updated successfully"
        )
    );

});

const deleteBrand = asyncHandler(async (req, res) => {

    await brandService.deleteBrand(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Brand deleted successfully"
        )
    );

});

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};
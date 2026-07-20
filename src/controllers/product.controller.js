const productService = require("../services/product.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createProduct = asyncHandler(async (req, res) => {

    const product = await productService.createProduct(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            product,
            "Product created successfully"
        )
    );

});

const getAllProducts = asyncHandler(async (req, res) => {

    const products = await productService.getAllProducts(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            products,
            "Products fetched successfully"
        )
    );

});

const getProductById = asyncHandler(async (req, res) => {

    const product = await productService.getProductById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product fetched successfully"
        )
    );

});

const updateProduct = asyncHandler(async (req, res) => {

    const product = await productService.updateProduct(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product updated successfully"
        )
    );

});

const deleteProduct = asyncHandler(async (req, res) => {

    await productService.deleteProduct(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Product deleted successfully"
        )
    );

});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
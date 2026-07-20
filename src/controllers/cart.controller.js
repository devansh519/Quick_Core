const cartService = require("../services/cart.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getCart = asyncHandler(async (req, res) => {

    const cart = await cartService.getCart(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart fetched successfully"
        )
    );

});

const addItem = asyncHandler(async (req, res) => {

    const cart = await cartService.addItem(
        req.user.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Item added to cart successfully"
        )
    );

});

const updateItem = asyncHandler(async (req, res) => {

    const cart = await cartService.updateItem(
        req.user.id,
        req.params.productId,
        req.body.quantity
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart item updated successfully"
        )
    );

});

const removeItem = asyncHandler(async (req, res) => {

    const cart = await cartService.removeItem(
        req.user.id,
        req.params.productId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Item removed from cart successfully"
        )
    );

});

const clearCart = asyncHandler(async (req, res) => {

    await cartService.clearCart(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Cart cleared successfully"
        )
    );

});

module.exports = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
};
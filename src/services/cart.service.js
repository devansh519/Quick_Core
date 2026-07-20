const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Warehouse = require("../models/warehouse.model");
const ApiError = require("../utils/ApiError");

async function getCart(userId) {

    let cart = await Cart.findOne({
        user: userId,
    })
        .populate("items.product")
        .populate("items.warehouse");

    if (!cart) {
        cart = await Cart.create({
            user: userId,
        });
    }

    return cart;
}

async function addItem(userId, itemData) {

    const product = await Product.findById(itemData.product);

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    const warehouse = await Warehouse.findById(
        itemData.warehouse
    );

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    let cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
        });
    }

    const existingItem = cart.items.find(
        item =>
            item.product.toString() === itemData.product
    );

    if (existingItem) {

        existingItem.quantity += itemData.quantity;

    } else {

        cart.items.push({
            product: itemData.product,
            warehouse: itemData.warehouse,
            quantity: itemData.quantity,
            price: product.price,
        });

    }

    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cart.total = cart.subtotal - cart.discount;

    await cart.save();

    return await getCart(userId);
}

async function updateItem(
    userId,
    productId,
    quantity
) {

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        throw new ApiError(
            404,
            "Cart not found"
        );
    }

    const item = cart.items.find(
        item =>
            item.product.toString() === productId
    );

    if (!item) {
        throw new ApiError(
            404,
            "Item not found in cart"
        );
    }

    item.quantity = quantity;

    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cart.total = cart.subtotal - cart.discount;

    await cart.save();

    return await getCart(userId);
}

async function removeItem(
    userId,
    productId
) {

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        throw new ApiError(
            404,
            "Cart not found"
        );
    }

    cart.items = cart.items.filter(
        item =>
            item.product.toString() !== productId
    );

    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cart.total = cart.subtotal - cart.discount;

    await cart.save();

    return await getCart(userId);
}

async function clearCart(userId) {

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        throw new ApiError(
            404,
            "Cart not found"
        );
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.total = 0;

    await cart.save();

    return true;
}

module.exports = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
};
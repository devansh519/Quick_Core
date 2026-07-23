const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Address = require("../models/address.model");
const Warehouse = require("../models/warehouse.model");

const ApiError = require("../utils/ApiError");

function generateOrderNumber() {
    return (
        "ORD-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 10000)
    );
}

async function createOrder(userId, orderData) {

    const cart = await Cart.findOne({
        user: userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(
            400,
            "Cart is empty"
        );
    }

    const warehouse = await Warehouse.findById(
        orderData.warehouse
    );

    if (!warehouse) {
        throw new ApiError(
            404,
            "Warehouse not found"
        );
    }

    const address = await Address.findById(
        orderData.deliveryAddress
    );

    if (!address) {
        throw new ApiError(
            404,
            "Delivery address not found"
        );
    }

    const subtotal = cart.subtotal;
    const discount = cart.discount;
    const deliveryFee = 40;
    const tax = 0;

    const total =
        subtotal -
        discount +
        deliveryFee +
        tax;

    const order = await Order.create({

        orderNumber: generateOrderNumber(),

        customer: userId,

        warehouse: orderData.warehouse,

        coupon: orderData.coupon || null,

        subtotal,

        discount,

        deliveryFee,

        tax,

        total,

        deliveryAddress:
            orderData.deliveryAddress,

        notes:
            orderData.notes || "",

    });

    for (const item of cart.items) {

        await OrderItem.create({

            order: order._id,

            product: item.product._id,

            quantity: item.quantity,

            unitPrice: item.price,

            discount: 0,

            totalPrice:
                item.price * item.quantity,

            productName:
                item.product.name,

            productImage:
                item.product.images?.[0] || "",

            productWeight:
                item.product.quantityPerUnit || "",

        });

    }

    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.total = 0;

    await cart.save();

    return getOrderById(
        order._id,
        userId
    );

}

async function getMyOrders(userId) {

    const orders = await Order.find({
        customer: userId,
    })
        .populate(
            "warehouse",
            "name"
        )
        .sort({
            createdAt: -1,
        });

    return orders;

}

async function getOrderById(
    orderId,
    userId
) {

    const order = await Order.findOne({
        _id: orderId,
        customer: userId,
    })
        .populate(
            "warehouse",
            "name"
        )
        .populate(
            "deliveryAddress"
        )
        .populate(
            "payment"
        )
        .populate(
            "delivery"
        );

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    const items =
        await OrderItem.find({
            order: order._id,
        });

    return {
        order,
        items,
    };

}

async function updateOrderStatus(
    orderId,
    status
) {

    const order =
        await Order.findById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    order.status = status;

    if (status === "delivered") {
        order.deliveredAt =
            new Date();
    }

    await order.save();

    return order;

}

async function cancelOrder(
    orderId,
    userId
) {

    const order =
        await Order.findOne({
            _id: orderId,
            customer: userId,
        });

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (order.status !== "placed") {
        throw new ApiError(
            400,
            "Order cannot be cancelled"
        );
    }

    order.status = "cancelled";

    await order.save();

    return order;

}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
};
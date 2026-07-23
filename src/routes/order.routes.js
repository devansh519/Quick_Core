const express = require("express");

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
} = require("../controllers/order.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createOrderSchema,
    updateOrderStatusSchema,
} = require("../validations/order.validation");

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    validate(createOrderSchema),
    createOrder
);

router.get(
    "/",
    authenticate,
    getMyOrders
);

router.get(
    "/:id",
    authenticate,
    getOrderById
);

router.patch(
    "/:id/cancel",
    authenticate,
    cancelOrder
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/status",
    authenticate,
    authorize("admin"),
    validate(updateOrderStatusSchema),
    updateOrderStatus
);

module.exports = router;
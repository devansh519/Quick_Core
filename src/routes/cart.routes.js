const express = require("express");

const router = express.Router();

const {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
} = require("../controllers/cart.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    addItemSchema,
    updateItemSchema,
} = require("../validations/cart.validation");

// Every cart route requires login
router.use(authenticate);

router.get(
    "/",
    getCart
);

router.post(
    "/add-item",
    validate(addItemSchema),
    addItem
);

router.patch(
    "/update-item/:productId",
    validate(updateItemSchema),
    updateItem
);

router.delete(
    "/remove-item/:productId",
    removeItem
);

router.delete(
    "/clear",
    clearCart
);

module.exports = router;
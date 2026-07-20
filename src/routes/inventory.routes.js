const express = require("express");

const router = express.Router();

const {
    createInventory,
    getAllInventories,
    getInventoryById,
    updateInventory,
    deleteInventory,
} = require("../controllers/inventory.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createInventorySchema,
    updateInventorySchema,
} = require("../validations/inventory.validation");

// Public Routes
router.get("/", getAllInventories);
router.get("/:id", getInventoryById);

// Admin Routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createInventorySchema),
    createInventory
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateInventorySchema),
    updateInventory
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteInventory
);

module.exports = router;
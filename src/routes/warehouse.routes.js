const express = require("express");

const router = express.Router();

const {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse,
} = require("../controllers/warehouse.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createWarehouseSchema,
    updateWarehouseSchema,
} = require("../validations/warehouse.validation");

// Public Routes
router.get("/", getAllWarehouses);
router.get("/:id", getWarehouseById);

// Admin Routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createWarehouseSchema),
    createWarehouse
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateWarehouseSchema),
    updateWarehouse
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteWarehouse
);

module.exports = router;
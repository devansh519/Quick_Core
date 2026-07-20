const express = require("express");

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/product.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createProductSchema,
    updateProductSchema,
} = require("../validations/product.validation");

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin Routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createProductSchema),
    createProduct
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateProductSchema),
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteProduct
);

module.exports = router;
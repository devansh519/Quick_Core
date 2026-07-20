const express = require("express");

const router = express.Router();

const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} = require("../controllers/brand.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createBrandSchema,
    updateBrandSchema,
} = require("../validations/brand.validation");

// Public Routes
router.get("/", getAllBrands);
router.get("/:id", getBrandById);

// Admin Routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createBrandSchema),
    createBrand
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateBrandSchema),
    updateBrand
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteBrand
);

module.exports = router;
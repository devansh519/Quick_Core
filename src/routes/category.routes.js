const express = require("express");

const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validations/category.validation");

// Public Routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin Routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createCategorySchema),
    createCategory
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateCategorySchema),
    updateCategory
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteCategory
);

module.exports = router;
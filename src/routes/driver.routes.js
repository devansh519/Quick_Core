const express = require("express");

const router = express.Router();

const {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
} = require("../controllers/driver.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createDriverSchema,
    updateDriverSchema,
} = require("../validations/driver.validation");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    authorize("admin"),
    getAllDrivers
);

router.get(
    "/:id",
    authenticate,
    authorize("admin"),
    getDriverById
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createDriverSchema),
    createDriver
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateDriverSchema),
    updateDriver
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteDriver
);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
} = require("../controllers/delivery.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createDeliverySchema,
    updateDeliverySchema,
} = require("../validations/delivery.validation");

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    authorize("admin"),
    getAllDeliveries
);

router.get(
    "/:id",
    authenticate,
    authorize("admin"),
    getDeliveryById
);

router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createDeliverySchema),
    createDelivery
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateDeliverySchema),
    updateDelivery
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteDelivery
);

module.exports = router;
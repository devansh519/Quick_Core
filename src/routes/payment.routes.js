const express = require("express");

const router = express.Router();

const {
    createPayment,
    getMyPayments,
    getPaymentById,
    updatePaymentStatus,
} = require("../controllers/payment.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createPaymentSchema,
    updatePaymentStatusSchema,
} = require("../validations/payment.validation");

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    validate(createPaymentSchema),
    createPayment
);

router.get(
    "/",
    authenticate,
    getMyPayments
);

router.get(
    "/:id",
    authenticate,
    getPaymentById
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
    validate(updatePaymentStatusSchema),
    updatePaymentStatus
);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
    createNotification,
    getMyNotifications,
    getNotificationById,
    markAsRead,
    deleteNotification,
} = require("../controllers/notification.controller");

const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createNotificationSchema,
} = require("../validations/notification.validation");

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    getMyNotifications
);

router.get(
    "/:id",
    authenticate,
    getNotificationById
);

router.patch(
    "/:id/read",
    authenticate,
    markAsRead
);

router.delete(
    "/:id",
    authenticate,
    deleteNotification
);

/*
|--------------------------------------------------------------------------
| Admin/System Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createNotificationSchema),
    createNotification
);

module.exports = router;
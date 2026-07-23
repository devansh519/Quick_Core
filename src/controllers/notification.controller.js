const notificationService = require("../services/notification.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createNotification = asyncHandler(async (req, res) => {

    const notification =
        await notificationService.createNotification(
            req.body
        );

    return res.status(201).json(
        new ApiResponse(
            201,
            notification,
            "Notification created successfully"
        )
    );

});

const getMyNotifications = asyncHandler(async (req, res) => {

    const notifications =
        await notificationService.getMyNotifications(
            req.user.id,
            req.query
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "Notifications fetched successfully"
        )
    );

});

const getNotificationById = asyncHandler(async (req, res) => {

    const notification =
        await notificationService.getNotificationById(
            req.params.id,
            req.user.id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification fetched successfully"
        )
    );

});

const markAsRead = asyncHandler(async (req, res) => {

    const notification =
        await notificationService.markAsRead(
            req.params.id,
            req.user.id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification marked as read"
        )
    );

});

const deleteNotification = asyncHandler(async (req, res) => {

    await notificationService.deleteNotification(
        req.params.id,
        req.user.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Notification deleted successfully"
        )
    );

});

module.exports = {
    createNotification,
    getMyNotifications,
    getNotificationById,
    markAsRead,
    deleteNotification,
};
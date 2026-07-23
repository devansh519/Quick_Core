const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const ApiError = require("../utils/ApiError");

async function createNotification(notificationData) {

    const user = await User.findById(
        notificationData.recipient
    );

    if (!user) {
        throw new ApiError(
            404,
            "Recipient not found"
        );
    }

    return await Notification.create(notificationData);

}

async function getMyNotifications(userId, query) {

    const {
        page = 1,
        limit = 10,
        isRead,
        type,
    } = query;

    const filter = {
        recipient: userId,
    };

    if (isRead !== undefined) {
        filter.isRead = isRead === "true";
    }

    if (type) {
        filter.type = type;
    }

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([

        Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),

        Notification.countDocuments(filter),

    ]);

    return {
        notifications,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

}

async function getNotificationById(id, userId) {

    const notification = await Notification.findOne({
        _id: id,
        recipient: userId,
    });

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    return notification;

}

async function markAsRead(id, userId) {

    const notification =
        await Notification.findOneAndUpdate(
            {
                _id: id,
                recipient: userId,
            },
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    return notification;

}

async function deleteNotification(id, userId) {

    const notification =
        await Notification.findOne({
            _id: id,
            recipient: userId,
        });

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    await notification.deleteOne();

    return true;

}

module.exports = {
    createNotification,
    getMyNotifications,
    getNotificationById,
    markAsRead,
    deleteNotification,
};
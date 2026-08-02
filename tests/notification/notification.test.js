const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Notification = require("../../src/models/notification.model");

// Helper: register a user (defaults to customer) and return auth cookies + user id
const registerAndLogin = async (role = "customer") => {
    const email = `user${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    const signupRes = await request(app)
        .post("/api/v1/auth/signup")
        .send({
            name: "Test User",
            email,
            phone,
            password: "Password@123",
            role,
        });

    expect(signupRes.statusCode).toBe(201);

    const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
            email,
            password: "Password@123",
        });

    expect(loginRes.statusCode).toBe(200);

    return {
        cookies: loginRes.headers["set-cookie"],
        userId: loginRes.body.data.user.id,
    };
};

describe("Notification API", () => {
    let adminCookies;
    let customerA;
    let customerB;

    beforeEach(async () => {
        adminCookies = (await registerAndLogin("admin")).cookies;
        customerA = await registerAndLogin("customer");
        customerB = await registerAndLogin("customer");
    });

    describe("POST /api/v1/notifications", () => {
        it("should create a notification successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/notifications")
                .set("Cookie", adminCookies)
                .send({
                    recipient: customerA.userId,
                    title: "Order Shipped",
                    message: "Your order has been shipped",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Notification created successfully");
            expect(res.body.data.recipient).toBe(customerA.userId);
            expect(res.body.data.title).toBe("Order Shipped");
            expect(res.body.data.type).toBe("system");
            expect(res.body.data.isRead).toBe(false);
        });

        it("should fail with 404 when recipient does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/notifications")
                .set("Cookie", adminCookies)
                .send({
                    recipient: new mongoose.Types.ObjectId().toString(),
                    title: "Order Shipped",
                    message: "Your order has been shipped",
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Recipient not found");
        });

        it("should fail validation when title is missing", async () => {
            const res = await request(app)
                .post("/api/v1/notifications")
                .set("Cookie", adminCookies)
                .send({
                    recipient: customerA.userId,
                    message: "Your order has been shipped",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation with an invalid type", async () => {
            const res = await request(app)
                .post("/api/v1/notifications")
                .set("Cookie", adminCookies)
                .send({
                    recipient: customerA.userId,
                    title: "Order Shipped",
                    message: "Your order has been shipped",
                    type: "spam",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/notifications")
                .send({
                    recipient: customerA.userId,
                    title: "Order Shipped",
                    message: "Your order has been shipped",
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/notifications")
                .set("Cookie", customerA.cookies)
                .send({
                    recipient: customerA.userId,
                    title: "Order Shipped",
                    message: "Your order has been shipped",
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/notifications", () => {
        it("should return the current user's notifications with pagination", async () => {
            await Notification.create([
                { recipient: customerA.userId, title: "N1", message: "Message 1" },
                { recipient: customerA.userId, title: "N2", message: "Message 2" },
                { recipient: customerA.userId, title: "N3", message: "Message 3" },
            ]);

            const res = await request(app)
                .get("/api/v1/notifications")
                .set("Cookie", customerA.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Notifications fetched successfully");
            expect(res.body.data.notifications).toHaveLength(3);
            expect(res.body.data.pagination).toEqual({
                page: 1,
                limit: 10,
                total: 3,
                totalPages: 1,
            });
        });

        it("should filter notifications by isRead", async () => {
            await Notification.create([
                { recipient: customerA.userId, title: "N1", message: "Message 1", isRead: true },
                { recipient: customerA.userId, title: "N2", message: "Message 2", isRead: false },
            ]);

            const res = await request(app)
                .get("/api/v1/notifications")
                .set("Cookie", customerA.cookies)
                .query({ isRead: "true" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.notifications).toHaveLength(1);
            expect(res.body.data.notifications[0].isRead).toBe(true);
        });

        it("should filter notifications by type", async () => {
            await Notification.create([
                { recipient: customerA.userId, title: "N1", message: "Message 1", type: "order" },
                { recipient: customerA.userId, title: "N2", message: "Message 2", type: "system" },
            ]);

            const res = await request(app)
                .get("/api/v1/notifications")
                .set("Cookie", customerA.cookies)
                .query({ type: "order" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.notifications).toHaveLength(1);
            expect(res.body.data.notifications[0].type).toBe("order");
        });

        it("should paginate results", async () => {
            for (let i = 1; i <= 12; i++) {
                await Notification.create({ recipient: customerA.userId, title: `N${i}`, message: `Message ${i}` });
            }

            const res = await request(app)
                .get("/api/v1/notifications")
                .set("Cookie", customerA.cookies)
                .query({ page: 2, limit: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.notifications).toHaveLength(5);
            expect(res.body.data.pagination).toEqual({
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3,
            });
        });

        it("should return an empty list when the user has no notifications", async () => {
            const res = await request(app)
                .get("/api/v1/notifications")
                .set("Cookie", customerB.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.notifications).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/notifications");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/notifications/:id", () => {
        const createNotificationFor = async (recipientId) => {
            return await Notification.create({
                recipient: recipientId,
                title: "Order Shipped",
                message: "Your order has been shipped",
            });
        };

        it("should return a notification by id", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .get(`/api/v1/notifications/${notification._id}`)
                .set("Cookie", customerA.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Notification fetched successfully");
            expect(res.body.data.title).toBe("Order Shipped");
        });

        it("should fail with 404 for another user's notification", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .get(`/api/v1/notifications/${notification._id}`)
                .set("Cookie", customerB.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Notification not found");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/notifications/not-a-valid-id")
                .set("Cookie", customerA.cookies);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .get(`/api/v1/notifications/${notification._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/notifications/:id/read", () => {
        const createNotificationFor = async (recipientId) => {
            return await Notification.create({
                recipient: recipientId,
                title: "Order Shipped",
                message: "Your order has been shipped",
            });
        };

        it("should mark a notification as read", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .patch(`/api/v1/notifications/${notification._id}/read`)
                .set("Cookie", customerA.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Notification marked as read");
            expect(res.body.data.isRead).toBe(true);
        });

        it("should fail with 404 for another user's notification", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .patch(`/api/v1/notifications/${notification._id}/read`)
                .set("Cookie", customerB.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .patch(`/api/v1/notifications/${notification._id}/read`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/notifications/:id", () => {
        const createNotificationFor = async (recipientId) => {
            return await Notification.create({
                recipient: recipientId,
                title: "Order Shipped",
                message: "Your order has been shipped",
            });
        };

        it("should delete a notification successfully", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .delete(`/api/v1/notifications/${notification._id}`)
                .set("Cookie", customerA.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Notification deleted successfully");

            const deletedNotification = await Notification.findById(notification._id);
            expect(deletedNotification).toBeNull();
        });

        it("should fail with 404 for another user's notification", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .delete(`/api/v1/notifications/${notification._id}`)
                .set("Cookie", customerB.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const notification = await createNotificationFor(customerA.userId);

            const res = await request(app)
                .delete(`/api/v1/notifications/${notification._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});

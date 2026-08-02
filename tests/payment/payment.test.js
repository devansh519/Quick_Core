const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Order = require("../../src/models/order.model");
const Payment = require("../../src/models/payment.model");
const Warehouse = require("../../src/models/warehouse.model");

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

describe("Payment API", () => {
    let adminCookies;
    let customer;
    let warehouseId;

    const createOrderDoc = async (userId, overrides = {}) => {
        return await Order.create({
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            customer: userId,
            warehouse: warehouseId,
            subtotal: 200,
            discount: 0,
            deliveryFee: 40,
            tax: 0,
            total: 240,
            deliveryAddress: new mongoose.Types.ObjectId(),
            ...overrides,
        });
    };

    beforeEach(async () => {
        adminCookies = (await registerAndLogin("admin")).cookies;
        customer = await registerAndLogin("customer");

        const warehouse = await Warehouse.create({
            name: "Main Warehouse",
            code: "WH001",
            address: "123 Main Street",
            location: { type: "Point", coordinates: [77.2, 28.6] },
            serviceRadius: 5,
        });

        warehouseId = warehouse._id.toString();
    });

    describe("POST /api/v1/payments", () => {
        it("should create a payment successfully", async () => {
            const order = await createOrderDoc(customer.userId);

            const res = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({
                    order: order._id.toString(),
                    paymentMethod: "upi",
                    paymentProvider: "razorpay",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Payment created successfully");
            expect(res.body.data.amount).toBe(240);
            expect(res.body.data.status).toBe("pending");
            expect(res.body.data.paymentMethod).toBe("upi");
        });

        it("should fail with 404 when order does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({
                    order: new mongoose.Types.ObjectId().toString(),
                    paymentMethod: "upi",
                    paymentProvider: "razorpay",
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Order not found");
        });

        it("should fail with 403 when paying for another user's order", async () => {
            const otherUser = await registerAndLogin("customer");
            const order = await createOrderDoc(otherUser.userId);

            const res = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({
                    order: order._id.toString(),
                    paymentMethod: "upi",
                    paymentProvider: "razorpay",
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("You are not authorized to pay for this order");
        });

        it("should fail with 409 when payment already exists for the order", async () => {
            const order = await createOrderDoc(customer.userId);
            const paymentPayload = {
                order: order._id.toString(),
                paymentMethod: "upi",
                paymentProvider: "razorpay",
            };

            await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send(paymentPayload);

            const res = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send(paymentPayload);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Payment already exists for this order");
        });

        it("should fail validation when paymentMethod is missing", async () => {
            const order = await createOrderDoc(customer.userId);

            const res = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({ order: order._id.toString(), paymentProvider: "razorpay" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation with an invalid payment provider", async () => {
            const order = await createOrderDoc(customer.userId);

            const res = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({
                    order: order._id.toString(),
                    paymentMethod: "upi",
                    paymentProvider: "unknown-provider",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const order = await createOrderDoc(customer.userId);

            const res = await request(app)
                .post("/api/v1/payments")
                .send({
                    order: order._id.toString(),
                    paymentMethod: "upi",
                    paymentProvider: "razorpay",
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/payments", () => {
        it("should return the current user's payments", async () => {
            const order = await createOrderDoc(customer.userId);

            await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({ order: order._id.toString(), paymentMethod: "upi", paymentProvider: "razorpay" });

            const res = await request(app)
                .get("/api/v1/payments")
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Payments fetched successfully");
            expect(res.body.data).toHaveLength(1);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/payments");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/payments/:id", () => {
        const createPaymentViaApi = async () => {
            const order = await createOrderDoc(customer.userId);

            const paymentRes = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({ order: order._id.toString(), paymentMethod: "upi", paymentProvider: "razorpay" });

            return paymentRes.body.data;
        };

        it("should return a payment by id", async () => {
            const payment = await createPaymentViaApi();

            const res = await request(app)
                .get(`/api/v1/payments/${payment._id}`)
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Payment fetched successfully");
            expect(res.body.data._id).toBe(payment._id);
        });

        it("should fail with 404 for another user's payment", async () => {
            const payment = await createPaymentViaApi();
            const otherUser = await registerAndLogin("customer");

            const res = await request(app)
                .get(`/api/v1/payments/${payment._id}`)
                .set("Cookie", otherUser.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Payment not found");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/payments/not-a-valid-id")
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when payment does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/payments/507f1f77bcf86cd799439011")
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/payments/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/payments/:id/status", () => {
        const createPaymentViaApi = async () => {
            const order = await createOrderDoc(customer.userId);

            const paymentRes = await request(app)
                .post("/api/v1/payments")
                .set("Cookie", customer.cookies)
                .send({ order: order._id.toString(), paymentMethod: "upi", paymentProvider: "razorpay" });

            return { payment: paymentRes.body.data, order };
        };

        it("should mark a payment as successful and update the order", async () => {
            const { payment, order } = await createPaymentViaApi();

            const res = await request(app)
                .patch(`/api/v1/payments/${payment._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "successful", transactionId: "TXN-12345" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Payment updated successfully");
            expect(res.body.data.status).toBe("successful");
            expect(res.body.data.transactionId).toBe("TXN-12345");
            expect(res.body.data.paidAt).not.toBeNull();

            const updatedOrder = await Order.findById(order._id);
            expect(updatedOrder.paymentStatus).toBe("paid");
        });

        it("should mark a payment as failed and update the order", async () => {
            const { payment, order } = await createPaymentViaApi();

            const res = await request(app)
                .patch(`/api/v1/payments/${payment._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "failed" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.status).toBe("failed");

            const updatedOrder = await Order.findById(order._id);
            expect(updatedOrder.paymentStatus).toBe("failed");
        });

        it("should mark a payment as refunded with refund details", async () => {
            const { payment, order } = await createPaymentViaApi();

            const res = await request(app)
                .patch(`/api/v1/payments/${payment._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "refunded", refundAmount: 240, refundReason: "Customer request" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.status).toBe("refunded");
            expect(res.body.data.refundAmount).toBe(240);
            expect(res.body.data.refundReason).toBe("Customer request");

            const updatedOrder = await Order.findById(order._id);
            expect(updatedOrder.paymentStatus).toBe("refunded");
        });

        it("should fail validation with an invalid status", async () => {
            const { payment } = await createPaymentViaApi();

            const res = await request(app)
                .patch(`/api/v1/payments/${payment._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "invalid-status" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when payment does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/payments/507f1f77bcf86cd799439011/status")
                .set("Cookie", adminCookies)
                .send({ status: "successful" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const { payment } = await createPaymentViaApi();

            const res = await request(app)
                .patch(`/api/v1/payments/${payment._id}/status`)
                .set("Cookie", customer.cookies)
                .send({ status: "successful" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const { payment } = await createPaymentViaApi();

            const res = await request(app)
                .patch(`/api/v1/payments/${payment._id}/status`)
                .send({ status: "successful" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});

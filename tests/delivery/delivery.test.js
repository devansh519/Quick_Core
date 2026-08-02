const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Delivery = require("../../src/models/delivery.model");
const Order = require("../../src/models/order.model");
const Driver = require("../../src/models/driver.model");
const User = require("../../src/models/user.model");
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

describe("Delivery API", () => {
    let adminCookies;
    let customerCookies;
    let warehouseId;
    let orderId;
    let driverId;

    const createOrderDoc = async () => {
        return await Order.create({
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            customer: new mongoose.Types.ObjectId(),
            warehouse: warehouseId,
            subtotal: 200,
            discount: 0,
            deliveryFee: 40,
            tax: 0,
            total: 240,
            deliveryAddress: new mongoose.Types.ObjectId(),
        });
    };

    const createDriverDoc = async () => {
        const driverUser = await User.create({
            name: "Driver User",
            email: `driver${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`,
            phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
            password: "Password@123",
            role: "driver",
        });

        return await Driver.create({
            user: driverUser._id,
            warehouse: warehouseId,
            vehicleType: "bike",
            vehicleNumber: `MH12AB${Math.floor(Math.random() * 10000)}`,
            licenseNumber: `DL${Math.floor(Math.random() * 100000)}`,
        });
    };

    beforeEach(async () => {
        adminCookies = (await registerAndLogin("admin")).cookies;
        customerCookies = (await registerAndLogin("customer")).cookies;

        const warehouse = await Warehouse.create({
            name: "Main Warehouse",
            code: "WH001",
            address: "123 Main Street",
            location: { type: "Point", coordinates: [77.2, 28.6] },
            serviceRadius: 5,
        });

        warehouseId = warehouse._id.toString();

        const order = await createOrderDoc();
        orderId = order._id.toString();

        const driver = await createDriverDoc();
        driverId = driver._id.toString();
    });

    describe("POST /api/v1/deliveries", () => {
        it("should create a delivery successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send({
                    order: orderId,
                    warehouse: warehouseId,
                    driver: driverId,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Delivery created successfully");
            expect(res.body.data.status).toBe("pending");
        });

        it("should create a delivery without a driver", async () => {
            const freshOrder = await createOrderDoc();

            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send({
                    order: freshOrder._id.toString(),
                    warehouse: warehouseId,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.driver).toBeNull();
        });

        it("should fail with 404 when order does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send({
                    order: new mongoose.Types.ObjectId().toString(),
                    warehouse: warehouseId,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Order not found");
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send({
                    order: orderId,
                    warehouse: new mongoose.Types.ObjectId().toString(),
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });

        it("should fail with 404 when driver does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send({
                    order: orderId,
                    warehouse: warehouseId,
                    driver: new mongoose.Types.ObjectId().toString(),
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Driver not found");
        });

        it("should fail with 409 when delivery already exists for the order", async () => {
            const deliveryPayload = { order: orderId, warehouse: warehouseId, driver: driverId };

            await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send(deliveryPayload);

            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send(deliveryPayload);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Delivery already exists for this order");
        });

        it("should fail validation when warehouse is missing", async () => {
            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .send({ order: orderId });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/deliveries")
                .send({ order: orderId, warehouse: warehouseId });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/deliveries")
                .set("Cookie", customerCookies)
                .send({ order: orderId, warehouse: warehouseId });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/deliveries", () => {
        it("should return all deliveries with pagination", async () => {
            await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .get("/api/v1/deliveries")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Deliveries fetched successfully");
            expect(res.body.data.deliveries).toHaveLength(1);
            expect(res.body.data.deliveries[0].order.orderNumber).toBeDefined();
            expect(res.body.data.pagination.total).toBe(1);
        });

        it("should filter deliveries by status", async () => {
            await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });
            const secondOrder = await createOrderDoc();
            await Delivery.create({ order: secondOrder._id, warehouse: warehouseId, driver: driverId, status: "delivered" });

            const res = await request(app)
                .get("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .query({ status: "delivered" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.deliveries).toHaveLength(1);
        });

        it("should filter deliveries by warehouse", async () => {
            await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const otherWarehouse = await Warehouse.create({
                name: "Secondary Warehouse",
                code: "WH002",
                address: "456 Other Street",
                location: { type: "Point", coordinates: [77.3, 28.7] },
                serviceRadius: 5,
            });

            const secondOrder = await createOrderDoc();
            await Delivery.create({ order: secondOrder._id, warehouse: otherWarehouse._id, driver: driverId });

            const res = await request(app)
                .get("/api/v1/deliveries")
                .set("Cookie", adminCookies)
                .query({ warehouse: warehouseId });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.deliveries).toHaveLength(1);
        });

        it("should return an empty list when no deliveries exist", async () => {
            const res = await request(app)
                .get("/api/v1/deliveries")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.deliveries).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/deliveries");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .get("/api/v1/deliveries")
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/deliveries/:id", () => {
        it("should return a delivery by id", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .get(`/api/v1/deliveries/${delivery._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Delivery fetched successfully");
            expect(res.body.data.status).toBe("pending");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/deliveries/not-a-valid-id")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when delivery does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/deliveries/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Delivery not found");
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/deliveries/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .get("/api/v1/deliveries/507f1f77bcf86cd799439011")
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/deliveries/:id", () => {
        it("should update a delivery successfully as admin", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .patch(`/api/v1/deliveries/${delivery._id}`)
                .set("Cookie", adminCookies)
                .send({ status: "out_for_delivery" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Delivery updated successfully");
            expect(res.body.data.status).toBe("out_for_delivery");
        });

        it("should fail with 404 when updating to a non-existent driver", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .patch(`/api/v1/deliveries/${delivery._id}`)
                .set("Cookie", adminCookies)
                .send({ driver: new mongoose.Types.ObjectId().toString() });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Driver not found");
        });

        it("should fail validation with an empty body", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .patch(`/api/v1/deliveries/${delivery._id}`)
                .set("Cookie", adminCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when delivery does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/deliveries/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies)
                .send({ status: "delivered" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .patch(`/api/v1/deliveries/${delivery._id}`)
                .send({ status: "delivered" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .patch(`/api/v1/deliveries/${delivery._id}`)
                .set("Cookie", customerCookies)
                .send({ status: "delivered" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/deliveries/:id", () => {
        it("should hard-delete a delivery successfully as admin", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .delete(`/api/v1/deliveries/${delivery._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Delivery deleted successfully");

            const deletedDelivery = await Delivery.findById(delivery._id);
            expect(deletedDelivery).toBeNull();
        });

        it("should fail with 404 when delivery does not exist", async () => {
            const res = await request(app)
                .delete("/api/v1/deliveries/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .delete(`/api/v1/deliveries/${delivery._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const delivery = await Delivery.create({ order: orderId, warehouse: warehouseId, driver: driverId });

            const res = await request(app)
                .delete(`/api/v1/deliveries/${delivery._id}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});

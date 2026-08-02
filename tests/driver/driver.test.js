const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
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

describe("Driver API", () => {
    let adminCookies;
    let customerCookies;
    let driverUserId;
    let warehouseId;

    const createDriverUser = async () => {
        return await User.create({
            name: "Driver User",
            email: `driver${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`,
            phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
            password: "Password@123",
            role: "driver",
        });
    };

    beforeEach(async () => {
        adminCookies = (await registerAndLogin("admin")).cookies;
        customerCookies = (await registerAndLogin("customer")).cookies;

        const driverUser = await createDriverUser();
        driverUserId = driverUser._id.toString();

        const warehouse = await Warehouse.create({
            name: "Main Warehouse",
            code: "WH001",
            address: "123 Main Street",
            location: { type: "Point", coordinates: [77.2, 28.6] },
            serviceRadius: 5,
        });

        warehouseId = warehouse._id.toString();
    });

    describe("POST /api/v1/drivers", () => {
        it("should create a driver successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .send({
                    user: driverUserId,
                    warehouse: warehouseId,
                    vehicleType: "bike",
                    vehicleNumber: "MH12AB1234",
                    licenseNumber: "DL1234567890",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Driver created successfully");
            expect(res.body.data.vehicleType).toBe("bike");
            expect(res.body.data.status).toBe("offline");
            expect(res.body.data.isAvailable).toBe(true);
        });

        it("should fail with 404 when user does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .send({
                    user: new mongoose.Types.ObjectId().toString(),
                    warehouse: warehouseId,
                    vehicleType: "bike",
                    vehicleNumber: "MH12AB1234",
                    licenseNumber: "DL1234567890",
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("User not found");
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .send({
                    user: driverUserId,
                    warehouse: new mongoose.Types.ObjectId().toString(),
                    vehicleType: "bike",
                    vehicleNumber: "MH12AB1234",
                    licenseNumber: "DL1234567890",
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });

        it("should fail with 409 when driver already exists for the user", async () => {
            const driverPayload = {
                user: driverUserId,
                warehouse: warehouseId,
                vehicleType: "bike",
                vehicleNumber: "MH12AB1234",
                licenseNumber: "DL1234567890",
            };

            await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .send(driverPayload);

            const res = await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .send(driverPayload);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Driver already exists");
        });

        it("should fail validation when vehicleType is missing", async () => {
            const res = await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .send({
                    user: driverUserId,
                    warehouse: warehouseId,
                    vehicleNumber: "MH12AB1234",
                    licenseNumber: "DL1234567890",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation with an invalid vehicle type", async () => {
            const res = await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .send({
                    user: driverUserId,
                    warehouse: warehouseId,
                    vehicleType: "helicopter",
                    vehicleNumber: "MH12AB1234",
                    licenseNumber: "DL1234567890",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/drivers")
                .send({
                    user: driverUserId,
                    warehouse: warehouseId,
                    vehicleType: "bike",
                    vehicleNumber: "MH12AB1234",
                    licenseNumber: "DL1234567890",
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/drivers")
                .set("Cookie", customerCookies)
                .send({
                    user: driverUserId,
                    warehouse: warehouseId,
                    vehicleType: "bike",
                    vehicleNumber: "MH12AB1234",
                    licenseNumber: "DL1234567890",
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/drivers", () => {
        it("should return all drivers with pagination", async () => {
            await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .get("/api/v1/drivers")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Drivers fetched successfully");
            expect(res.body.data.drivers).toHaveLength(1);
            expect(res.body.data.drivers[0].user.name).toBe("Driver User");
            expect(res.body.data.pagination.total).toBe(1);
        });

        it("should filter drivers by warehouse", async () => {
            const otherWarehouse = await Warehouse.create({
                name: "Secondary Warehouse",
                code: "WH002",
                address: "456 Other Street",
                location: { type: "Point", coordinates: [77.3, 28.7] },
                serviceRadius: 5,
            });

            await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });
            const otherUser = await createDriverUser();
            await Driver.create({ user: otherUser._id, warehouse: otherWarehouse._id, vehicleType: "car", vehicleNumber: "MH12CD5678", licenseNumber: "DL0987654321" });

            const res = await request(app)
                .get("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .query({ warehouse: warehouseId });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.drivers).toHaveLength(1);
            expect(res.body.data.drivers[0].vehicleNumber).toBe("MH12AB1234");
        });

        it("should filter drivers by status", async () => {
            await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890", status: "online" });
            const otherUser = await createDriverUser();
            await Driver.create({ user: otherUser._id, warehouse: warehouseId, vehicleType: "car", vehicleNumber: "MH12CD5678", licenseNumber: "DL0987654321", status: "offline" });

            const res = await request(app)
                .get("/api/v1/drivers")
                .set("Cookie", adminCookies)
                .query({ status: "online" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.drivers).toHaveLength(1);
        });

        it("should return an empty list when no drivers exist", async () => {
            const res = await request(app)
                .get("/api/v1/drivers")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.drivers).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/drivers");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .get("/api/v1/drivers")
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/drivers/:id", () => {
        it("should return a driver by id", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .get(`/api/v1/drivers/${driver._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Driver fetched successfully");
            expect(res.body.data.vehicleType).toBe("bike");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/drivers/not-a-valid-id")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when driver does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/drivers/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Driver not found");
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/drivers/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .get("/api/v1/drivers/507f1f77bcf86cd799439011")
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/drivers/:id", () => {
        it("should update a driver successfully as admin", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .patch(`/api/v1/drivers/${driver._id}`)
                .set("Cookie", adminCookies)
                .send({ status: "online", isAvailable: true });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Driver updated successfully");
            expect(res.body.data.status).toBe("online");
        });

        it("should fail with 404 when updating to a non-existent warehouse", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .patch(`/api/v1/drivers/${driver._id}`)
                .set("Cookie", adminCookies)
                .send({ warehouse: new mongoose.Types.ObjectId().toString() });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });

        it("should fail validation with an empty body", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .patch(`/api/v1/drivers/${driver._id}`)
                .set("Cookie", adminCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when driver does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/drivers/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies)
                .send({ status: "online" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .patch(`/api/v1/drivers/${driver._id}`)
                .send({ status: "online" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .patch(`/api/v1/drivers/${driver._id}`)
                .set("Cookie", customerCookies)
                .send({ status: "online" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/drivers/:id", () => {
        it("should hard-delete a driver successfully as admin", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .delete(`/api/v1/drivers/${driver._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Driver deleted successfully");

            const deletedDriver = await Driver.findById(driver._id);
            expect(deletedDriver).toBeNull();
        });

        it("should fail with 404 when driver does not exist", async () => {
            const res = await request(app)
                .delete("/api/v1/drivers/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .delete(`/api/v1/drivers/${driver._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const driver = await Driver.create({ user: driverUserId, warehouse: warehouseId, vehicleType: "bike", vehicleNumber: "MH12AB1234", licenseNumber: "DL1234567890" });

            const res = await request(app)
                .delete(`/api/v1/drivers/${driver._id}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});

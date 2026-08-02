const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Warehouse = require("../../src/models/warehouse.model");
const User = require("../../src/models/user.model");

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

const validWarehousePayload = {
    name: "Main Warehouse",
    code: "WH001",
    address: "123 Main Street",
    location: { type: "Point", coordinates: [77.2, 28.6] },
    serviceRadius: 5,
};

const createManagerUser = async () => {
    return await User.create({
        name: "Manager User",
        email: `manager${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`,
        phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        password: "Password@123",
        role: "admin",
    });
};

describe("Warehouse API", () => {
    describe("POST /api/v1/warehouses", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = (await registerAndLogin("admin")).cookies;
            customerCookies = (await registerAndLogin("customer")).cookies;
        });

        it("should create a warehouse successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send(validWarehousePayload);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Warehouse created successfully");
            expect(res.body.data.name).toBe("Main Warehouse");
            expect(res.body.data.code).toBe("WH001");
            expect(res.body.data.isActive).toBe(true);
        });

        it("should create a warehouse with a valid manager", async () => {
            const manager = await createManagerUser();

            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send({ ...validWarehousePayload, code: "WH002", manager: manager._id.toString() });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.manager).toBe(manager._id.toString());
        });

        it("should fail with duplicate warehouse code", async () => {
            await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send(validWarehousePayload);

            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send(validWarehousePayload);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse code already exists");
        });

        it("should fail validation when address is missing", async () => {
            const payload = { ...validWarehousePayload, address: undefined };

            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send(payload);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation when location is missing", async () => {
            const payload = { ...validWarehousePayload, location: undefined };

            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send(payload);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation with an invalid phone", async () => {
            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send({ ...validWarehousePayload, code: "WH003", phone: "1234567890" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when manager does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", adminCookies)
                .send({
                    ...validWarehousePayload,
                    code: "WH004",
                    manager: new mongoose.Types.ObjectId().toString(),
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Manager not found");
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/warehouses")
                .send(validWarehousePayload);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/warehouses")
                .set("Cookie", customerCookies)
                .send(validWarehousePayload);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/warehouses", () => {
        it("should return all active warehouses with pagination", async () => {
            await Warehouse.create([
                { ...validWarehousePayload, code: "WH001" },
                { ...validWarehousePayload, code: "WH002", name: "Secondary Warehouse" },
                { ...validWarehousePayload, code: "WH003", name: "Tertiary Warehouse" },
            ]);

            const res = await request(app)
                .get("/api/v1/warehouses");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Warehouses fetched successfully");
            expect(res.body.data.warehouses).toHaveLength(3);
            expect(res.body.data.pagination).toEqual({
                page: 1,
                limit: 10,
                total: 3,
                totalPages: 1,
            });
        });

        it("should search warehouses by name", async () => {
            await Warehouse.create([
                { ...validWarehousePayload, code: "WH001" },
                { ...validWarehousePayload, code: "WH002", name: "Secondary Warehouse" },
            ]);

            const res = await request(app)
                .get("/api/v1/warehouses")
                .query({ search: "main" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.warehouses).toHaveLength(1);
            expect(res.body.data.warehouses[0].name).toBe("Main Warehouse");
        });

        it("should filter warehouses by status", async () => {
            await Warehouse.create([
                { ...validWarehousePayload, code: "WH001" },
                { ...validWarehousePayload, code: "WH002", name: "Maintenance WH", status: "maintenance" },
            ]);

            const res = await request(app)
                .get("/api/v1/warehouses")
                .query({ status: "maintenance" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.warehouses).toHaveLength(1);
            expect(res.body.data.warehouses[0].name).toBe("Maintenance WH");
        });

        it("should paginate results", async () => {
            for (let i = 1; i <= 12; i++) {
                await Warehouse.create({ ...validWarehousePayload, code: `WH${String(i).padStart(3, "0")}`, name: `Warehouse ${i}` });
            }

            const res = await request(app)
                .get("/api/v1/warehouses")
                .query({ page: 2, limit: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.warehouses).toHaveLength(5);
            expect(res.body.data.pagination).toEqual({
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3,
            });
        });

        it("should return an empty list when no warehouses exist", async () => {
            const res = await request(app)
                .get("/api/v1/warehouses");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.warehouses).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });

        it("should not return soft-deleted warehouses", async () => {
            await Warehouse.create([
                { ...validWarehousePayload, code: "WH001" },
                { ...validWarehousePayload, code: "WH002", name: "Deleted WH", isActive: false },
            ]);

            const res = await request(app)
                .get("/api/v1/warehouses");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.warehouses).toHaveLength(1);
            expect(res.body.data.warehouses[0].name).toBe("Main Warehouse");
        });
    });

    describe("GET /api/v1/warehouses/:id", () => {
        it("should return a warehouse by id", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .get(`/api/v1/warehouses/${warehouse._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Warehouse fetched successfully");
            expect(res.body.data.name).toBe("Main Warehouse");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/warehouses/not-a-valid-id");

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/warehouses/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });
    });

    describe("PATCH /api/v1/warehouses/:id", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = (await registerAndLogin("admin")).cookies;
            customerCookies = (await registerAndLogin("customer")).cookies;
        });

        it("should update a warehouse successfully as admin", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .patch(`/api/v1/warehouses/${warehouse._id}`)
                .set("Cookie", adminCookies)
                .send({
                    name: "Updated Warehouse",
                    status: "maintenance",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Warehouse updated successfully");
            expect(res.body.data.name).toBe("Updated Warehouse");
            expect(res.body.data.status).toBe("maintenance");
        });

        it("should fail with 404 when updating to a non-existent manager", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .patch(`/api/v1/warehouses/${warehouse._id}`)
                .set("Cookie", adminCookies)
                .send({ manager: new mongoose.Types.ObjectId().toString() });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Manager not found");
        });

        it("should fail validation with an empty body", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .patch(`/api/v1/warehouses/${warehouse._id}`)
                .set("Cookie", adminCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/warehouses/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies)
                .send({ name: "New Name" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .patch(`/api/v1/warehouses/${warehouse._id}`)
                .send({ name: "New Name" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .patch(`/api/v1/warehouses/${warehouse._id}`)
                .set("Cookie", customerCookies)
                .send({ name: "New Name" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/warehouses/:id", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = (await registerAndLogin("admin")).cookies;
            customerCookies = (await registerAndLogin("customer")).cookies;
        });

        it("should soft-delete a warehouse successfully as admin", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .delete(`/api/v1/warehouses/${warehouse._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Warehouse deleted successfully");

            const deletedWarehouse = await Warehouse.findById(warehouse._id);
            expect(deletedWarehouse.isActive).toBe(false);
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            const res = await request(app)
                .delete("/api/v1/warehouses/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .delete(`/api/v1/warehouses/${warehouse._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const warehouse = await Warehouse.create({ ...validWarehousePayload, code: "WH001" });

            const res = await request(app)
                .delete(`/api/v1/warehouses/${warehouse._id}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});

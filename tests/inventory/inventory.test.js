const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Inventory = require("../../src/models/inventory.model");
const Warehouse = require("../../src/models/warehouse.model");
const Product = require("../../src/models/product.model");
const Category = require("../../src/models/category.model");
const Brand = require("../../src/models/brand.model");

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

describe("Inventory API", () => {
    let adminCookies;
    let customerCookies;
    let warehouseId;
    let productId;

    beforeEach(async () => {
        adminCookies = (await registerAndLogin("admin")).cookies;
        customerCookies = (await registerAndLogin("customer")).cookies;

        const category = await Category.create({ name: "Groceries" });
        const brand = await Brand.create({ name: "Nike" });

        const warehouse = await Warehouse.create({
            name: "Main Warehouse",
            code: "WH001",
            address: "123 Main Street",
            location: { type: "Point", coordinates: [77.2, 28.6] },
            serviceRadius: 5,
        });

        const product = await Product.create({
            name: "Nike Shoes",
            category: category._id,
            brand: brand._id,
            price: 100,
            unit: "piece",
            quantityPerUnit: 1,
            sku: "SKU-1",
        });

        warehouseId = warehouse._id.toString();
        productId = product._id.toString();
    });

    describe("POST /api/v1/inventories", () => {
        it("should create an inventory successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", adminCookies)
                .send({
                    warehouse: warehouseId,
                    product: productId,
                    quantity: 100,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Inventory created successfully");
            expect(res.body.data.quantity).toBe(100);
            expect(res.body.data.isActive).toBe(true);
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", adminCookies)
                .send({
                    warehouse: new mongoose.Types.ObjectId().toString(),
                    product: productId,
                    quantity: 100,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });

        it("should fail with 404 when product does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", adminCookies)
                .send({
                    warehouse: warehouseId,
                    product: new mongoose.Types.ObjectId().toString(),
                    quantity: 100,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Product not found");
        });

        it("should fail with duplicate warehouse and product combination", async () => {
            const inventoryPayload = { warehouse: warehouseId, product: productId, quantity: 100 };

            await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", adminCookies)
                .send(inventoryPayload);

            const res = await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", adminCookies)
                .send(inventoryPayload);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Inventory already exists for this warehouse and product");
        });

        it("should fail validation when quantity is missing", async () => {
            const res = await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", adminCookies)
                .send({ warehouse: warehouseId, product: productId });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation with a negative quantity", async () => {
            const res = await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", adminCookies)
                .send({ warehouse: warehouseId, product: productId, quantity: -5 });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/inventories")
                .send({ warehouse: warehouseId, product: productId, quantity: 100 });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/inventories")
                .set("Cookie", customerCookies)
                .send({ warehouse: warehouseId, product: productId, quantity: 100 });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/inventories", () => {
        it("should return all active inventories with pagination", async () => {
            await Inventory.create([
                { warehouse: warehouseId, product: productId, quantity: 100 },
            ]);

            const res = await request(app)
                .get("/api/v1/inventories");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Inventories fetched successfully");
            expect(res.body.data.inventories).toHaveLength(1);
            expect(res.body.data.inventories[0].warehouse.name).toBe("Main Warehouse");
            expect(res.body.data.inventories[0].product.name).toBe("Nike Shoes");
            expect(res.body.data.pagination.total).toBe(1);
        });

        it("should filter inventories by warehouse", async () => {
            const otherWarehouse = await Warehouse.create({
                name: "Secondary Warehouse",
                code: "WH002",
                address: "456 Other Street",
                location: { type: "Point", coordinates: [77.3, 28.7] },
                serviceRadius: 5,
            });

            await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });
            await Inventory.create({ warehouse: otherWarehouse._id, product: productId, quantity: 50 });

            const res = await request(app)
                .get("/api/v1/inventories")
                .query({ warehouse: warehouseId });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.inventories).toHaveLength(1);
        });

        it("should filter inventories by product", async () => {
            const category = await Category.create({ name: "Fashion" });
            const brand = await Brand.create({ name: "Adidas" });

            const otherProduct = await Product.create({
                name: "Adidas Shoes",
                category: category._id,
                brand: brand._id,
                price: 200,
                unit: "piece",
                quantityPerUnit: 1,
                sku: "SKU-2",
            });

            await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });
            await Inventory.create({ warehouse: warehouseId, product: otherProduct._id, quantity: 50 });

            const res = await request(app)
                .get("/api/v1/inventories")
                .query({ product: productId });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.inventories).toHaveLength(1);
        });

        it("should paginate results", async () => {
            for (let i = 1; i <= 12; i++) {
                const p = await Product.create({
                    name: `Inventory Product ${i}`,
                    category: new mongoose.Types.ObjectId(),
                    brand: new mongoose.Types.ObjectId(),
                    price: 100,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: `INV-SKU-${i}`,
                });

                await Inventory.create({ warehouse: warehouseId, product: p._id, quantity: i });
            }

            const res = await request(app)
                .get("/api/v1/inventories")
                .query({ page: 2, limit: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.inventories).toHaveLength(5);
            expect(res.body.data.pagination).toEqual({
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3,
            });
        });

        it("should return an empty list when no inventories exist", async () => {
            const res = await request(app)
                .get("/api/v1/inventories");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.inventories).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });

        it("should not return soft-deleted inventories", async () => {
            await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100, isActive: false });

            const res = await request(app)
                .get("/api/v1/inventories");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.inventories).toHaveLength(0);
        });
    });

    describe("GET /api/v1/inventories/:id", () => {
        it("should return an inventory by id", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .get(`/api/v1/inventories/${inventory._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Inventory fetched successfully");
            expect(res.body.data.quantity).toBe(100);
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/inventories/not-a-valid-id");

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when inventory does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/inventories/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Inventory not found");
        });
    });

    describe("PATCH /api/v1/inventories/:id", () => {
        it("should update an inventory successfully as admin", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .patch(`/api/v1/inventories/${inventory._id}`)
                .set("Cookie", adminCookies)
                .send({ quantity: 250 });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Inventory updated successfully");
            expect(res.body.data.quantity).toBe(250);
        });

        it("should fail with 404 when updating to a non-existent warehouse", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .patch(`/api/v1/inventories/${inventory._id}`)
                .set("Cookie", adminCookies)
                .send({ warehouse: new mongoose.Types.ObjectId().toString() });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });

        it("should fail validation with an empty body", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .patch(`/api/v1/inventories/${inventory._id}`)
                .set("Cookie", adminCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when inventory does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/inventories/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies)
                .send({ quantity: 10 });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .patch(`/api/v1/inventories/${inventory._id}`)
                .send({ quantity: 10 });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .patch(`/api/v1/inventories/${inventory._id}`)
                .set("Cookie", customerCookies)
                .send({ quantity: 10 });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/inventories/:id", () => {
        it("should soft-delete an inventory successfully as admin", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .delete(`/api/v1/inventories/${inventory._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Inventory deleted successfully");

            const deletedInventory = await Inventory.findById(inventory._id);
            expect(deletedInventory.isActive).toBe(false);
        });

        it("should fail with 404 when inventory does not exist", async () => {
            const res = await request(app)
                .delete("/api/v1/inventories/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .delete(`/api/v1/inventories/${inventory._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const inventory = await Inventory.create({ warehouse: warehouseId, product: productId, quantity: 100 });

            const res = await request(app)
                .delete(`/api/v1/inventories/${inventory._id}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});

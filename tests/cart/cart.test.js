const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Cart = require("../../src/models/cart.model");
const Product = require("../../src/models/product.model");
const Warehouse = require("../../src/models/warehouse.model");
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

describe("Cart API", () => {
    let customer;
    let customerCookies;
    let productId;
    let warehouseId;

    beforeEach(async () => {
        customer = await registerAndLogin("customer");
        customerCookies = customer.cookies;

        const category = await Category.create({ name: "Groceries" });
        const brand = await Brand.create({ name: "Nike" });

        const product = await Product.create({
            name: "Nike Shoes",
            category: category._id,
            brand: brand._id,
            price: 100,
            unit: "piece",
            quantityPerUnit: 1,
            sku: "SKU-1",
        });

        const warehouse = await Warehouse.create({
            name: "Main Warehouse",
            code: "WH001",
            address: "123 Main Street",
            location: { type: "Point", coordinates: [77.2, 28.6] },
            serviceRadius: 5,
        });

        productId = product._id.toString();
        warehouseId = warehouse._id.toString();
    });

    describe("GET /api/v1/cart", () => {
        it("should create and return an empty cart", async () => {
            const res = await request(app)
                .get("/api/v1/cart")
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Cart fetched successfully");
            expect(res.body.data.items).toHaveLength(0);
            expect(res.body.data.subtotal).toBe(0);
            expect(res.body.data.total).toBe(0);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/cart");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/cart/add-item", () => {
        it("should add an item to the cart successfully", async () => {
            const res = await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({
                    product: productId,
                    warehouse: warehouseId,
                    quantity: 3,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Item added to cart successfully");
            expect(res.body.data.items).toHaveLength(1);
            expect(res.body.data.items[0].product.name).toBe("Nike Shoes");
            expect(res.body.data.items[0].quantity).toBe(3);
            expect(res.body.data.subtotal).toBe(300);
            expect(res.body.data.total).toBe(300);
        });

        it("should accumulate quantity when the same product is added twice", async () => {
            const itemPayload = { product: productId, warehouse: warehouseId, quantity: 2 };

            await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send(itemPayload);

            const res = await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send(itemPayload);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.items).toHaveLength(1);
            expect(res.body.data.items[0].quantity).toBe(4);
            expect(res.body.data.subtotal).toBe(400);
        });

        it("should fail with 404 when product does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({
                    product: new mongoose.Types.ObjectId().toString(),
                    warehouse: warehouseId,
                    quantity: 1,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Product not found");
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({
                    product: productId,
                    warehouse: new mongoose.Types.ObjectId().toString(),
                    quantity: 1,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });

        it("should fail validation when quantity is missing", async () => {
            const res = await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({ product: productId, warehouse: warehouseId });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation when quantity is zero", async () => {
            const res = await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({ product: productId, warehouse: warehouseId, quantity: 0 });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/cart/add-item")
                .send({ product: productId, warehouse: warehouseId, quantity: 1 });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/cart/update-item/:productId", () => {
        it("should update item quantity successfully", async () => {
            await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({ product: productId, warehouse: warehouseId, quantity: 2 });

            const res = await request(app)
                .patch(`/api/v1/cart/update-item/${productId}`)
                .set("Cookie", customerCookies)
                .send({ quantity: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Cart item updated successfully");
            expect(res.body.data.items[0].quantity).toBe(5);
            expect(res.body.data.subtotal).toBe(500);
        });

        it("should fail with 404 when item is not in the cart", async () => {
            await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({ product: productId, warehouse: warehouseId, quantity: 1 });

            const res = await request(app)
                .patch(`/api/v1/cart/update-item/${new mongoose.Types.ObjectId().toString()}`)
                .set("Cookie", customerCookies)
                .send({ quantity: 2 });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Item not found in cart");
        });

        it("should fail with 404 when the user has no cart", async () => {
            const freshUser = await registerAndLogin("customer");

            const res = await request(app)
                .patch(`/api/v1/cart/update-item/${productId}`)
                .set("Cookie", freshUser.cookies)
                .send({ quantity: 2 });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Cart not found");
        });

        it("should fail validation when quantity is missing", async () => {
            await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({ product: productId, warehouse: warehouseId, quantity: 1 });

            const res = await request(app)
                .patch(`/api/v1/cart/update-item/${productId}`)
                .set("Cookie", customerCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .patch(`/api/v1/cart/update-item/${productId}`)
                .send({ quantity: 2 });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/cart/remove-item/:productId", () => {
        it("should remove an item from the cart successfully", async () => {
            await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({ product: productId, warehouse: warehouseId, quantity: 2 });

            const res = await request(app)
                .delete(`/api/v1/cart/remove-item/${productId}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Item removed from cart successfully");
            expect(res.body.data.items).toHaveLength(0);
            expect(res.body.data.subtotal).toBe(0);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .delete(`/api/v1/cart/remove-item/${productId}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/cart/clear", () => {
        it("should clear the cart successfully", async () => {
            await request(app)
                .post("/api/v1/cart/add-item")
                .set("Cookie", customerCookies)
                .send({ product: productId, warehouse: warehouseId, quantity: 2 });

            const res = await request(app)
                .delete("/api/v1/cart/clear")
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Cart cleared successfully");

            const cart = await Cart.findOne({ user: customer.userId });
            expect(cart.items).toHaveLength(0);
            expect(cart.subtotal).toBe(0);
            expect(cart.discount).toBe(0);
            expect(cart.total).toBe(0);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .delete("/api/v1/cart/clear");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});

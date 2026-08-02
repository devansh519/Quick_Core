const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Order = require("../../src/models/order.model");
const Product = require("../../src/models/product.model");
const Warehouse = require("../../src/models/warehouse.model");
const Address = require("../../src/models/address.model");
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

describe("Order API", () => {
    let adminCookies;
    let customer;
    let warehouseId;
    let productId;

    const seedCart = async (cookies, quantity = 2) => {
        await request(app)
            .post("/api/v1/cart/add-item")
            .set("Cookie", cookies)
            .send({ product: productId, warehouse: warehouseId, quantity });
    };

    const createAddress = async (userId) => {
        return await Address.create({
            user: userId,
            label: "home",
            houseNumber: "42",
            street: "Main Street",
            city: "Delhi",
            state: "Delhi",
            country: "India",
            postalCode: "110001",
        });
    };

    beforeEach(async () => {
        adminCookies = (await registerAndLogin("admin")).cookies;
        customer = await registerAndLogin("customer");

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

        warehouseId = warehouse._id.toString();
        productId = product._id.toString();
    });

    describe("POST /api/v1/orders", () => {
        it("should create an order successfully from the cart", async () => {
            await seedCart(customer.cookies, 2);
            const address = await createAddress(customer.userId);

            const res = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({
                    warehouse: warehouseId,
                    deliveryAddress: address._id.toString(),
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Order created successfully");
            expect(res.body.data.order.orderNumber).toMatch(/^ORD-/);
            expect(res.body.data.order.status).toBe("placed");
            expect(res.body.data.order.subtotal).toBe(200);
            expect(res.body.data.order.deliveryFee).toBe(40);
            expect(res.body.data.order.total).toBe(240);
            expect(res.body.data.items).toHaveLength(1);
            expect(res.body.data.items[0].productName).toBe("Nike Shoes");
            expect(res.body.data.items[0].quantity).toBe(2);

            // Cart should be cleared after placing the order
            const cartRes = await request(app)
                .get("/api/v1/cart")
                .set("Cookie", customer.cookies);
            expect(cartRes.body.data.items).toHaveLength(0);
        });

        it("should fail with 400 when the cart is empty", async () => {
            const address = await createAddress(customer.userId);

            const res = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({
                    warehouse: warehouseId,
                    deliveryAddress: address._id.toString(),
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Cart is empty");
        });

        it("should fail with 404 when warehouse does not exist", async () => {
            await seedCart(customer.cookies);
            const address = await createAddress(customer.userId);

            const res = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({
                    warehouse: new mongoose.Types.ObjectId().toString(),
                    deliveryAddress: address._id.toString(),
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Warehouse not found");
        });

        it("should fail with 404 when delivery address does not exist", async () => {
            await seedCart(customer.cookies);

            const res = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({
                    warehouse: warehouseId,
                    deliveryAddress: new mongoose.Types.ObjectId().toString(),
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Delivery address not found");
        });

        it("should fail validation when warehouse is missing", async () => {
            await seedCart(customer.cookies);
            const address = await createAddress(customer.userId);

            const res = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({ deliveryAddress: address._id.toString() });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation with an invalid delivery address", async () => {
            await seedCart(customer.cookies);

            const res = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({
                    warehouse: warehouseId,
                    deliveryAddress: "not-a-valid-id",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const address = await createAddress(customer.userId);

            const res = await request(app)
                .post("/api/v1/orders")
                .send({
                    warehouse: warehouseId,
                    deliveryAddress: address._id.toString(),
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/orders", () => {
        it("should return the current user's orders", async () => {
            await seedCart(customer.cookies);
            const address = await createAddress(customer.userId);

            await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({ warehouse: warehouseId, deliveryAddress: address._id.toString() });

            const res = await request(app)
                .get("/api/v1/orders")
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Orders fetched successfully");
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].customer).toBe(customer.userId);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/orders");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/orders/:id", () => {
        const createOrderViaApi = async () => {
            await seedCart(customer.cookies);
            const address = await createAddress(customer.userId);

            const orderRes = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({ warehouse: warehouseId, deliveryAddress: address._id.toString() });

            return orderRes;
        };

        it("should return an order by id with its items", async () => {
            const created = await createOrderViaApi();

            const res = await request(app)
                .get(`/api/v1/orders/${created.body.data.order._id}`)
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Order fetched successfully");
            expect(res.body.data.order._id).toBe(created.body.data.order._id);
            expect(res.body.data.items).toHaveLength(1);
        });

        it("should fail with 404 for another user's order", async () => {
            const created = await createOrderViaApi();
            const otherUser = await registerAndLogin("customer");

            const res = await request(app)
                .get(`/api/v1/orders/${created.body.data.order._id}`)
                .set("Cookie", otherUser.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Order not found");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/orders/not-a-valid-id")
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when order does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/orders/507f1f77bcf86cd799439011")
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/v1/orders/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/orders/:id/cancel", () => {
        const createOrderViaApi = async () => {
            await seedCart(customer.cookies);
            const address = await createAddress(customer.userId);

            const orderRes = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({ warehouse: warehouseId, deliveryAddress: address._id.toString() });

            return orderRes.body.data.order;
        };

        it("should cancel a placed order successfully", async () => {
            const order = await createOrderViaApi();

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/cancel`)
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Order cancelled successfully");
            expect(res.body.data.status).toBe("cancelled");
        });

        it("should fail with 400 when the order cannot be cancelled", async () => {
            const order = await createOrderViaApi();

            await request(app)
                .patch(`/api/v1/orders/${order._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "confirmed" });

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/cancel`)
                .set("Cookie", customer.cookies);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Order cannot be cancelled");
        });

        it("should fail with 404 for another user's order", async () => {
            const order = await createOrderViaApi();
            const otherUser = await registerAndLogin("customer");

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/cancel`)
                .set("Cookie", otherUser.cookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const order = await createOrderViaApi();

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/cancel`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/orders/:id/status", () => {
        const createOrderViaApi = async () => {
            await seedCart(customer.cookies);
            const address = await createAddress(customer.userId);

            const orderRes = await request(app)
                .post("/api/v1/orders")
                .set("Cookie", customer.cookies)
                .send({ warehouse: warehouseId, deliveryAddress: address._id.toString() });

            return orderRes.body.data.order;
        };

        it("should update the order status successfully as admin", async () => {
            const order = await createOrderViaApi();

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "confirmed" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Order status updated successfully");
            expect(res.body.data.status).toBe("confirmed");
        });

        it("should set deliveredAt when status is delivered", async () => {
            const order = await createOrderViaApi();

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "delivered" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.status).toBe("delivered");
            expect(res.body.data.deliveredAt).not.toBeNull();
        });

        it("should fail validation with an invalid status", async () => {
            const order = await createOrderViaApi();

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/status`)
                .set("Cookie", adminCookies)
                .send({ status: "invalid-status" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when order does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/orders/507f1f77bcf86cd799439011/status")
                .set("Cookie", adminCookies)
                .send({ status: "confirmed" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const order = await createOrderViaApi();

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/status`)
                .set("Cookie", customer.cookies)
                .send({ status: "confirmed" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const order = await createOrderViaApi();

            const res = await request(app)
                .patch(`/api/v1/orders/${order._id}/status`)
                .send({ status: "confirmed" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});

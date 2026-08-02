const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
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

describe("Product API", () => {
    let adminCookies;
    let customerCookies;
    let categoryId;
    let brandId;

    beforeEach(async () => {
        adminCookies = (await registerAndLogin("admin")).cookies;
        customerCookies = (await registerAndLogin("customer")).cookies;

        const category = await Category.create({ name: "Groceries" });
        const brand = await Brand.create({ name: "Nike" });

        categoryId = category._id.toString();
        brandId = brand._id.toString();
    });

    describe("POST /api/v1/products", () => {
        it("should create a product successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Running Shoes",
                    category: categoryId,
                    brand: brandId,
                    price: 1999,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "nike-shoes-1",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product created successfully");
            expect(res.body.data.name).toBe("Nike Running Shoes");
            expect(res.body.data.sku).toBe("NIKE-SHOES-1");
            expect(res.body.data.price).toBe(1999);
            expect(res.body.data.isActive).toBe(true);
        });

        it("should fail with duplicate SKU", async () => {
            const productPayload = {
                name: "Nike Running Shoes",
                category: categoryId,
                brand: brandId,
                price: 1999,
                unit: "piece",
                quantityPerUnit: 1,
                sku: "NIKE-SHOES-1",
            };

            await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send(productPayload);

            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send(productPayload);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Product with same SKU already exists");
        });

        it("should fail validation when name is missing", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send({
                    category: categoryId,
                    brand: brandId,
                    price: 100,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "SKU-1",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation with an invalid category", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Shoes",
                    category: "not-a-valid-id",
                    brand: brandId,
                    price: 100,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "SKU-2",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation with an invalid unit", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Shoes",
                    category: categoryId,
                    brand: brandId,
                    price: 100,
                    unit: "litres",
                    quantityPerUnit: 1,
                    sku: "SKU-3",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation with a negative price", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Shoes",
                    category: categoryId,
                    brand: brandId,
                    price: -10,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "SKU-4",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when category does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Shoes",
                    category: new mongoose.Types.ObjectId().toString(),
                    brand: brandId,
                    price: 100,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "SKU-5",
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Category not found");
        });

        it("should fail with 404 when brand does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Shoes",
                    category: categoryId,
                    brand: new mongoose.Types.ObjectId().toString(),
                    price: 100,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "SKU-6",
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Brand not found");
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .send({
                    name: "Nike Shoes",
                    category: categoryId,
                    brand: brandId,
                    price: 100,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "SKU-7",
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/products")
                .set("Cookie", customerCookies)
                .send({
                    name: "Nike Shoes",
                    category: categoryId,
                    brand: brandId,
                    price: 100,
                    unit: "piece",
                    quantityPerUnit: 1,
                    sku: "SKU-8",
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/products", () => {
        it("should return all active products with pagination", async () => {
            await Product.create([
                { name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" },
                { name: "Adidas Shoes", category: categoryId, brand: brandId, price: 200, unit: "piece", quantityPerUnit: 1, sku: "SKU-2" },
                { name: "Puma Shoes", category: categoryId, brand: brandId, price: 300, unit: "piece", quantityPerUnit: 1, sku: "SKU-3" },
            ]);

            const res = await request(app)
                .get("/api/v1/products");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Products fetched successfully");
            expect(res.body.data.products).toHaveLength(3);
            expect(res.body.data.products[0].category.name).toBe("Groceries");
            expect(res.body.data.products[0].brand.name).toBe("Nike");
            expect(res.body.data.pagination.total).toBe(3);
        });

        it("should search products by name", async () => {
            await Product.create([
                { name: "Nike Running Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" },
                { name: "Adidas Running Shoes", category: categoryId, brand: brandId, price: 200, unit: "piece", quantityPerUnit: 1, sku: "SKU-2" },
            ]);

            const res = await request(app)
                .get("/api/v1/products")
                .query({ search: "nike" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(1);
            expect(res.body.data.products[0].name).toBe("Nike Running Shoes");
        });

        it("should filter products by category", async () => {
            const otherCategory = await Category.create({ name: "Electronics" });

            await Product.create([
                { name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" },
                { name: "Sony TV", category: otherCategory._id, brand: brandId, price: 50000, unit: "piece", quantityPerUnit: 1, sku: "SKU-2" },
            ]);

            const res = await request(app)
                .get("/api/v1/products")
                .query({ category: categoryId });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(1);
            expect(res.body.data.products[0].name).toBe("Nike Shoes");
        });

        it("should filter products by brand", async () => {
            const otherBrand = await Brand.create({ name: "Sony" });

            await Product.create([
                { name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" },
                { name: "Sony Headphones", category: categoryId, brand: otherBrand._id, price: 2000, unit: "piece", quantityPerUnit: 1, sku: "SKU-2" },
            ]);

            const res = await request(app)
                .get("/api/v1/products")
                .query({ brand: brandId });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(1);
            expect(res.body.data.products[0].name).toBe("Nike Shoes");
        });

        it("should filter products by price range", async () => {
            await Product.create([
                { name: "Item A", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" },
                { name: "Item B", category: categoryId, brand: brandId, price: 200, unit: "piece", quantityPerUnit: 1, sku: "SKU-2" },
                { name: "Item C", category: categoryId, brand: brandId, price: 300, unit: "piece", quantityPerUnit: 1, sku: "SKU-3" },
            ]);

            const res = await request(app)
                .get("/api/v1/products")
                .query({ minPrice: 150, maxPrice: 250 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(1);
            expect(res.body.data.products[0].name).toBe("Item B");
        });

        it("should paginate results", async () => {
            for (let i = 1; i <= 12; i++) {
                await Product.create({ name: `Product ${i}`, category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: `SKU-P${i}` });
            }

            const res = await request(app)
                .get("/api/v1/products")
                .query({ page: 2, limit: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(5);
            expect(res.body.data.pagination).toEqual({
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3,
            });
        });

        it("should return an empty list when no products exist", async () => {
            const res = await request(app)
                .get("/api/v1/products");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });

        it("should not return soft-deleted products", async () => {
            await Product.create([
                { name: "Active Product", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" },
                { name: "Deleted Product", category: categoryId, brand: brandId, price: 200, unit: "piece", quantityPerUnit: 1, sku: "SKU-2", isActive: false },
            ]);

            const res = await request(app)
                .get("/api/v1/products");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(1);
            expect(res.body.data.products[0].name).toBe("Active Product");
        });
    });

    describe("GET /api/v1/products/:id", () => {
        it("should return a product by id", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .get(`/api/v1/products/${product._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product fetched successfully");
            expect(res.body.data.name).toBe("Nike Shoes");
            expect(res.body.data.category.name).toBe("Groceries");
            expect(res.body.data.brand.name).toBe("Nike");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/products/not-a-valid-id");

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when product does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/products/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Product not found");
        });
    });

    describe("PATCH /api/v1/products/:id", () => {
        it("should update a product successfully as admin", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .patch(`/api/v1/products/${product._id}`)
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Air Shoes",
                    price: 2500,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product updated successfully");
            expect(res.body.data.name).toBe("Nike Air Shoes");
            expect(res.body.data.price).toBe(2500);
        });

        it("should fail with 404 when updating to a non-existent category", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .patch(`/api/v1/products/${product._id}`)
                .set("Cookie", adminCookies)
                .send({ category: new mongoose.Types.ObjectId().toString() });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Category not found");
        });

        it("should fail validation with an empty body", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .patch(`/api/v1/products/${product._id}`)
                .set("Cookie", adminCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when product does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/products/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies)
                .send({ name: "New Name" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .patch(`/api/v1/products/${product._id}`)
                .send({ name: "New Name" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .patch(`/api/v1/products/${product._id}`)
                .set("Cookie", customerCookies)
                .send({ name: "New Name" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/products/:id", () => {
        it("should soft-delete a product successfully as admin", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .delete(`/api/v1/products/${product._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product deleted successfully");

            const deletedProduct = await Product.findById(product._id);
            expect(deletedProduct.isActive).toBe(false);
        });

        it("should fail with 404 when product does not exist", async () => {
            const res = await request(app)
                .delete("/api/v1/products/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .delete(`/api/v1/products/${product._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const product = await Product.create({ name: "Nike Shoes", category: categoryId, brand: brandId, price: 100, unit: "piece", quantityPerUnit: 1, sku: "SKU-1" });

            const res = await request(app)
                .delete(`/api/v1/products/${product._id}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});

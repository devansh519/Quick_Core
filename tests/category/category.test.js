const request = require("supertest");
const app = require("../../src/app");
const Category = require("../../src/models/category.model");

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

describe("Category API", () => {
    describe("POST /api/v1/categories", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = (await registerAndLogin("admin")).cookies;
            customerCookies = (await registerAndLogin("customer")).cookies;
        });

        it("should create a category successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/categories")
                .set("Cookie", adminCookies)
                .send({
                    name: "Groceries",
                    description: "Daily essentials",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category created successfully");
            expect(res.body.data.name).toBe("Groceries");
            expect(res.body.data.isActive).toBe(true);

            const category = await Category.findOne({ name: "Groceries" });
            expect(category).not.toBeNull();
        });

        it("should fail with duplicate category name", async () => {
            await request(app)
                .post("/api/v1/categories")
                .set("Cookie", adminCookies)
                .send({ name: "Groceries" });

            const res = await request(app)
                .post("/api/v1/categories")
                .set("Cookie", adminCookies)
                .send({ name: "Groceries" });

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Category already exists");
        });

        it("should fail validation when name is missing", async () => {
            const res = await request(app)
                .post("/api/v1/categories")
                .set("Cookie", adminCookies)
                .send({ description: "No name here" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
        });

        it("should fail validation when name is too short", async () => {
            const res = await request(app)
                .post("/api/v1/categories")
                .set("Cookie", adminCookies)
                .send({ name: "A" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation with invalid image uri", async () => {
            const res = await request(app)
                .post("/api/v1/categories")
                .set("Cookie", adminCookies)
                .send({
                    name: "Sony",
                    image: "not-a-valid-url",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const res = await request(app)
                .post("/api/v1/categories")
                .send({ name: "Groceries" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/categories")
                .set("Cookie", customerCookies)
                .send({ name: "Groceries" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/categories", () => {
        it("should return all active categories with pagination", async () => {
            await Category.create([
                { name: "Groceries" },
                { name: "Electronics" },
                { name: "Fashion" },
            ]);

            const res = await request(app)
                .get("/api/v1/categories");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Categories fetched successfully");
            expect(res.body.data.categories).toHaveLength(3);
            expect(res.body.data.pagination).toEqual({
                page: 1,
                limit: 10,
                total: 3,
                totalPages: 1,
            });
        });

        it("should search categories by name", async () => {
            await Category.create([
                { name: "Groceries" },
                { name: "Electronics" },
            ]);

            const res = await request(app)
                .get("/api/v1/categories")
                .query({ search: "groc" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.categories).toHaveLength(1);
            expect(res.body.data.categories[0].name).toBe("Groceries");
        });

        it("should paginate results", async () => {
            for (let i = 1; i <= 12; i++) {
                await Category.create({ name: `Category ${i}` });
            }

            const res = await request(app)
                .get("/api/v1/categories")
                .query({ page: 2, limit: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.categories).toHaveLength(5);
            expect(res.body.data.pagination).toEqual({
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3,
            });
        });

        it("should not return soft-deleted categories", async () => {
            await Category.create([
                { name: "Groceries" },
                { name: "Electronics", isActive: false },
            ]);

            const res = await request(app)
                .get("/api/v1/categories");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.categories).toHaveLength(1);
            expect(res.body.data.categories[0].name).toBe("Groceries");
        });

        it("should return an empty list when no categories exist", async () => {
            const res = await request(app)
                .get("/api/v1/categories");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.categories).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });
    });

    describe("GET /api/v1/categories/:id", () => {
        it("should return a category by id", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .get(`/api/v1/categories/${category._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category fetched successfully");
            expect(res.body.data.name).toBe("Groceries");
        });

        it("should return an error for a malformed id", async () => {
            const res = await request(app)
                .get("/api/v1/categories/not-a-valid-id");

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it("should fail with 404 when category does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/categories/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Category not found");
        });
    });

    describe("PATCH /api/v1/categories/:id", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = (await registerAndLogin("admin")).cookies;
            customerCookies = (await registerAndLogin("customer")).cookies;
        });

        it("should update a category successfully as admin", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .patch(`/api/v1/categories/${category._id}`)
                .set("Cookie", adminCookies)
                .send({
                    name: "Groceries & Staples",
                    description: "Updated description",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category updated successfully");
            expect(res.body.data.name).toBe("Groceries & Staples");
            expect(res.body.data.description).toBe("Updated description");
        });

        it("should fail with 404 when category does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/categories/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies)
                .send({ name: "Groceries" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation with an empty body", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .patch(`/api/v1/categories/${category._id}`)
                .set("Cookie", adminCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .patch(`/api/v1/categories/${category._id}`)
                .send({ name: "Groceries" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .patch(`/api/v1/categories/${category._id}`)
                .set("Cookie", customerCookies)
                .send({ name: "Groceries" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/categories/:id", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = (await registerAndLogin("admin")).cookies;
            customerCookies = (await registerAndLogin("customer")).cookies;
        });

        it("should soft-delete a category successfully as admin", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .delete(`/api/v1/categories/${category._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category deleted successfully");

            const deletedCategory = await Category.findById(category._id);
            expect(deletedCategory.isActive).toBe(false);
        });

        it("should fail with 404 when category does not exist", async () => {
            const res = await request(app)
                .delete("/api/v1/categories/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .delete(`/api/v1/categories/${category._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const category = await Category.create({ name: "Groceries" });

            const res = await request(app)
                .delete(`/api/v1/categories/${category._id}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});

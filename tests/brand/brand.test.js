const request = require("supertest");
const app = require("../../src/app");
const Brand = require("../../src/models/brand.model");

// Helper: register a user (defaults to customer) and return auth cookies
const registerAndLogin = async (role = "customer") => {
    const email = `user${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    await request(app)
        .post("/api/v1/auth/signup")
        .send({
            name: "Test User",
            email,
            phone,
            password: "Password@123",
            role,
        });

    const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
            email,
            password: "Password@123",
        });

    expect(loginRes.statusCode).toBe(200);

    return loginRes.headers["set-cookie"];
};

describe("Brand API", () => {
    describe("POST /api/v1/brands", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = await registerAndLogin("admin");
            customerCookies = await registerAndLogin("customer");
        });

        it("should create a brand successfully as admin", async () => {
            const res = await request(app)
                .post("/api/v1/brands")
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike",
                    description: "Sportswear brand",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Brand created successfully");
            expect(res.body.data.name).toBe("Nike");
            expect(res.body.data.slug).toBe("nike");
            expect(res.body.data.isActive).toBe(true);
        });

        it("should fail with duplicate brand name", async () => {
            await request(app)
                .post("/api/v1/brands")
                .set("Cookie", adminCookies)
                .send({ name: "Nike" });

            const res = await request(app)
                .post("/api/v1/brands")
                .set("Cookie", adminCookies)
                .send({ name: "Nike" });

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Brand already exists");
        });

        it("should fail validation when name is missing", async () => {
            const res = await request(app)
                .post("/api/v1/brands")
                .set("Cookie", adminCookies)
                .send({ description: "No name here" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation when name is too short", async () => {
            const res = await request(app)
                .post("/api/v1/brands")
                .set("Cookie", adminCookies)
                .send({ name: "A" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation with invalid image uri", async () => {
            const res = await request(app)
                .post("/api/v1/brands")
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
                .post("/api/v1/brands")
                .send({ name: "Nike" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const res = await request(app)
                .post("/api/v1/brands")
                .set("Cookie", customerCookies)
                .send({ name: "Nike" });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/brands", () => {
        it("should return all active brands with pagination", async () => {
            await Brand.create([
                { name: "Nike", slug: "nike" },
                { name: "Adidas", slug: "adidas" },
                { name: "Puma", slug: "puma" },
            ]);

            const res = await request(app)
                .get("/api/v1/brands");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Brands fetched successfully");
            expect(res.body.data.brands).toHaveLength(3);
            expect(res.body.data.pagination).toEqual({
                page: 1,
                limit: 10,
                total: 3,
                totalPages: 1,
            });
        });

        it("should search brands by name", async () => {
            await Brand.create([
                { name: "Nike", slug: "nike" },
                { name: "Adidas", slug: "adidas" },
            ]);

            const res = await request(app)
                .get("/api/v1/brands")
                .query({ search: "nike" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.brands).toHaveLength(1);
            expect(res.body.data.brands[0].name).toBe("Nike");
        });

        it("should paginate results", async () => {
            for (let i = 1; i <= 12; i++) {
                await Brand.create({
                    name: `Brand ${i}`,
                    slug: `brand-${i}`,
                });
            }

            const res = await request(app)
                .get("/api/v1/brands")
                .query({ page: 2, limit: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.brands).toHaveLength(5);
            expect(res.body.data.pagination).toEqual({
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3,
            });
        });

        it("should not return soft-deleted brands", async () => {
            await Brand.create([
                { name: "Nike", slug: "nike" },
                { name: "Adidas", slug: "adidas", isActive: false },
            ]);

            const res = await request(app)
                .get("/api/v1/brands");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.brands).toHaveLength(1);
            expect(res.body.data.brands[0].name).toBe("Nike");
        });

        it("should return an empty list when no brands exist", async () => {
            const res = await request(app)
                .get("/api/v1/brands");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.brands).toHaveLength(0);
            expect(res.body.data.pagination.total).toBe(0);
        });
    });

    describe("GET /api/v1/brands/:id", () => {
        it("should return a brand by id", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .get(`/api/v1/brands/${brand._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Nike");
            expect(res.body.data.slug).toBe("nike");
        });

        it("should fail with 404 when brand does not exist", async () => {
            const res = await request(app)
                .get("/api/v1/brands/507f1f77bcf86cd799439011");

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Brand not found");
        });
    });

    describe("PATCH /api/v1/brands/:id", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = await registerAndLogin("admin");
            customerCookies = await registerAndLogin("customer");
        });

        it("should update a brand successfully as admin", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .patch(`/api/v1/brands/${brand._id}`)
                .set("Cookie", adminCookies)
                .send({
                    name: "Nike Inc.",
                    description: "Updated description",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Brand updated successfully");
            expect(res.body.data.name).toBe("Nike Inc.");
            expect(res.body.data.description).toBe("Updated description");
        });

        it("should fail with 404 when brand does not exist", async () => {
            const res = await request(app)
                .patch("/api/v1/brands/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies)
                .send({ name: "Nike Inc." });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail validation with an empty body", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .patch(`/api/v1/brands/${brand._id}`)
                .set("Cookie", adminCookies)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .patch(`/api/v1/brands/${brand._id}`)
                .send({ name: "Nike Inc." });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .patch(`/api/v1/brands/${brand._id}`)
                .set("Cookie", customerCookies)
                .send({ name: "Nike Inc." });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/v1/brands/:id", () => {
        let adminCookies;
        let customerCookies;

        beforeEach(async () => {
            adminCookies = await registerAndLogin("admin");
            customerCookies = await registerAndLogin("customer");
        });

        it("should soft-delete a brand successfully as admin", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .delete(`/api/v1/brands/${brand._id}`)
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Brand deleted successfully");

            const deletedBrand = await Brand.findById(brand._id);
            expect(deletedBrand.isActive).toBe(false);
        });

        it("should fail with 404 when brand does not exist", async () => {
            const res = await request(app)
                .delete("/api/v1/brands/507f1f77bcf86cd799439011")
                .set("Cookie", adminCookies);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it("should fail without authentication", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .delete(`/api/v1/brands/${brand._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail for non-admin users", async () => {
            const brand = await Brand.create({
                name: "Nike",
                slug: "nike",
            });

            const res = await request(app)
                .delete(`/api/v1/brands/${brand._id}`)
                .set("Cookie", customerCookies);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
});

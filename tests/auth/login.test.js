const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/v1/auth/login", () => {
    let email;
    let phone;

    beforeEach(async () => {
        email = `user${Date.now()}@example.com`;
        phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                name: "John Doe",
                email,
                phone,
                password: "Password@123",
            });
    });

    it("should login successfully with valid credentials", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email,
                password: "Password@123",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(email);
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should fail with incorrect password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email,
                password: "WrongPassword",
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should fail if user does not exist", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "nouser@example.com",
                password: "Password@123",
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should fail with invalid email format", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "invalid-email",
                password: "Password@123",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should fail when password is missing", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});
const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/v1/auth/login", () => {

    beforeEach(async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                name: "John Doe",
                email: "john@example.com",
                phone: "9876543210",
                password: "Password@123",
            });
    });

    it("should login successfully with valid credentials", async () => {

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "john@example.com",
                password: "Password@123",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe("john@example.com");

        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should fail with incorrect password", async () => {

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "john@example.com",
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
                email: "john@example.com",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

});
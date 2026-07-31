const request = require("supertest");
const app = require("../../src/app");

describe("GET /api/v1/auth/me", () => {
    let cookies;
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

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email,
                password: "Password@123",
            });

        expect(loginRes.statusCode).toBe(200);

        cookies = loginRes.headers["set-cookie"];

        expect(cookies).toBeDefined();
    });

    it("should return current authenticated user", async () => {
        const res = await request(app)
            .get("/api/v1/auth/me")
            .set("Cookie", cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        expect(res.body.data).toEqual(
            expect.objectContaining({
                email,
                name: "John Doe",
                phone,
                role: "customer",
            })
        );
    });

    it("should fail without authentication", async () => {
        const res = await request(app)
            .get("/api/v1/auth/me");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should fail with an invalid access token", async () => {
        const res = await request(app)
            .get("/api/v1/auth/me")
            .set("Cookie", [
                "accessToken=invalid-token",
            ]);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should fail with a malformed access token", async () => {
        const res = await request(app)
            .get("/api/v1/auth/me")
            .set("Cookie", [
                "accessToken=abc.xyz",
            ]);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
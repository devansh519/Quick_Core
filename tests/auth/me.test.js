const request = require("supertest");
const app = require("../../src/app");

describe("GET /api/v1/auth/me", () => {
    let cookies;

    beforeEach(async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                name: "John Doe",
                email: "john@example.com",
                phone: "9876543210",
                password: "Password@123",
            });

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "john@example.com",
                password: "Password@123",
            });

        cookies = loginRes.headers["set-cookie"];
    });

    it("should return current authenticated user", async () => {
        const res = await request(app)
            .get("/api/v1/auth/me")
            .set("Cookie", cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        expect(res.body.data).toEqual(
            expect.objectContaining({
                email: "john@example.com",
                name: "John Doe",
                phone: "9876543210",
                role: "customer",
            })
        );
    });

    it("should fail without access token", async () => {
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

    it("should fail when access token is malformed", async () => {
        const res = await request(app)
            .get("/api/v1/auth/me")
            .set("Cookie", [
                "accessToken=abc.xyz",
            ]);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
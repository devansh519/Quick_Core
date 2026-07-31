const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/v1/auth/refresh-token", () => {
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

    it("should refresh access token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(
            "Access token refreshed successfully"
        );

        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should fail when refresh token is missing", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh-token");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should fail with invalid refresh token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", [
                "refreshToken=invalid-token",
            ]);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
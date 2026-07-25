const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/v1/auth/refresh-token", () => {
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

    it("should refresh access token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(
            "Access token refreshed successfully"
        );

        expect(res.headers["set-cookie"]).toEqual(
            expect.arrayContaining([
                expect.stringContaining("accessToken="),
            ])
        );
    });

    it("should fail when refresh token is missing", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh-token");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should fail with an invalid refresh token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", [
                "refreshToken=invalid-token",
            ]);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
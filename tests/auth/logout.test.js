const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/v1/auth/logout", () => {
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

    it("should logout successfully", async () => {
        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Cookie", cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Logout successful");

        const setCookies = res.headers["set-cookie"];

        expect(setCookies).toEqual(
            expect.arrayContaining([
                expect.stringContaining("accessToken="),
                expect.stringContaining("refreshToken="),
            ])
        );
    });

    it("should fail without authentication", async () => {
        const res = await request(app)
            .post("/api/v1/auth/logout");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/v1/auth/signup", () => {
    it("should create a new user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "Password@123",
                phone: "9876543210",
            });

        console.log("Status:", res.statusCode);
        console.log("Body:", JSON.stringify(res.body, null, 2));

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe("john@example.com");
    });
});
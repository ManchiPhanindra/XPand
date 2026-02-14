import request from "supertest";
import app from "../app";

describe("User Endpoints", () => {
    let token: string;

    beforeEach(async () => {
        const uniqueEmail = `test${Date.now()}@example.com`;
        // Register
        await request(app).post("/api/v1/auth/register").send({
            name: "Test User",
            email: uniqueEmail,
            password: "password123"
        });
        // Login
        const res = await request(app).post("/api/v1/auth/login").send({
            email: uniqueEmail,
            password: "password123"
        });
        token = res.body.token;
    });

    it("should fetch user profile", async () => {
        const res = await request(app)
            .get("/api/v1/users/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("email");
    });

    it("should update user profile", async () => {
        const res = await request(app)
            .put("/api/v1/users/me")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Name",
                bio: "New Bio"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("name", "Updated Name");
        expect(res.body).toHaveProperty("bio", "New Bio");
    });
});

import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; // We need to export app from server.ts or app.ts
import User from "../models/User";

describe("Auth Endpoints", () => {
    it("should register a new user", async () => {
        const uniqueEmail = `test_reg_${Date.now()}@example.com`;
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Test User",
                email: uniqueEmail,
                password: "password123"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).not.toHaveProperty("token");
    });

    it("should login a user", async () => {
        // Register first to ensure user exists
        const uniqueEmail = `test_login_${Date.now()}@example.com`;
        await request(app).post("/api/v1/auth/register").send({
            name: "Test User",
            email: uniqueEmail,
            password: "password123"
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: uniqueEmail,
                password: "password123"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
    });
});

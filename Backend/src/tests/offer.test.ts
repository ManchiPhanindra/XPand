import request from "supertest";
import app from "../app";

describe("Offer Endpoints", () => {
    let token: string;
    let offerId: string;

    beforeEach(async () => {
        const uniqueEmail = `offer_test_${Date.now()}@example.com`;
        await request(app).post("/api/v1/auth/register").send({
            name: "Test User",
            email: uniqueEmail,
            password: "password123"
        });
        const res = await request(app).post("/api/v1/auth/login").send({
            email: uniqueEmail,
            password: "password123"
        });
        token = res.body.token;
    });

    it("should create an offer", async () => {
        const res = await request(app)
            .post("/api/v1/offers")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "React Mentorship",
                description: "Learn React",
                tag: "React",
                duration: 60,
                credits: 20
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("_id");
        offerId = res.body._id; // Save for other tests if we didn't clear DB
    });

    it("should update an offer", async () => {
        // arithmetic: Create first
        const createRes = await request(app)
            .post("/api/v1/offers")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: `To Edit Unique ${Date.now()}` });

        const id = createRes.body._id;

        const res = await request(app)
            .put(`/api/v1/offers/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Edited Title" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("title", "Edited Title");
    });

    it("should delete an offer", async () => {
        // Create first
        const createRes = await request(app)
            .post("/api/v1/offers")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: `To Delete Unique ${Date.now()}` });

        const id = createRes.body._id;

        const res = await request(app)
            .delete(`/api/v1/offers/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Offer deleted successfully");
    });
});

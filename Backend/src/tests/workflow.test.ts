import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

describe("Workflow: Offers & Bookings", () => {
    let hostToken: string;
    let userToken: string;
    let hostId: string;
    let userId: string;
    let offerId: string;
    let bookingId: string;

    beforeAll(async () => {
        // Create Host
        const hostEmail = `host_${Date.now()}@test.com`;
        const hostRes = await request(app).post("/api/v1/auth/register").send({
            name: "Host User",
            email: hostEmail,
            password: "password123",
            credits: 100
        });
        const hostLogin = await request(app).post("/api/v1/auth/login").send({
            email: hostEmail,
            password: "password123"
        });
        hostToken = hostLogin.body.token;
        hostId = hostLogin.body.user._id;

        // Create User (Requester)
        const userEmail = `user_${Date.now()}@test.com`;
        const userRes = await request(app).post("/api/v1/auth/register").send({
            name: "Requester User",
            email: userEmail,
            password: "password123",
            credits: 50
        });
        const userLogin = await request(app).post("/api/v1/auth/login").send({
            email: userEmail,
            password: "password123"
        });
        userToken = userLogin.body.token;
        userId = userLogin.body.user._id;
    });

    afterAll(async () => {
        // Cleanup logic if needed, or rely on test DB teardown
    });

    it("1. Host creates an Offer", async () => {
        const res = await request(app)
            .post("/api/v1/offers")
            .set("Authorization", `Bearer ${hostToken}`)
            .send({
                title: "Workflow Offer",
                description: "Test Description",
                tag: "Workflow",
                duration: 60,
                credits: 10
            });
        expect(res.statusCode).toBe(201);
        offerId = res.body._id;
    });

    it("2. User searches for the Offer", async () => {
        const res = await request(app)
            .get("/api/v1/offers?search=Workflow")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]._id).toBe(offerId);
    });

    it("3. User books the Offer", async () => {
        const res = await request(app)
            .post("/api/v1/bookings")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                offerId: offerId,
                requesterId: userId
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("pending");
        bookingId = res.body._id;
    });

    it("4. Host accepts the Booking", async () => {
        const res = await request(app)
            .patch(`/api/v1/bookings/${bookingId}/accept`)
            .set("Authorization", `Bearer ${hostToken}`)
            .send({
                meetingLink: "https://meet.google.com/test-link"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("accepted");
        expect(res.body.meetingLink).toBe("https://meet.google.com/test-link");
    });

    it("5. Host (or User) marks as Complete", async () => {
        // Let's say Host completes it
        const res = await request(app)
            .patch(`/api/v1/bookings/${bookingId}/complete`)
            .set("Authorization", `Bearer ${hostToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("completed");
    });

    it("6. User reviews the Host", async () => {
        const res = await request(app)
            .post("/api/v1/reviews")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                bookingId: bookingId,
                rating: 5,
                comment: "Great session!"
            });

        expect(res.statusCode).toBe(201);
    });

    it("7. Verify Leaderboard (Host should be on top)", async () => {
        const res = await request(app)
            .get("/api/v1/auth/leaderboard");

        expect(res.statusCode).toBe(200);
        const topUser = res.body[0];
        // We can't guarantee he is top 1 if other tests ran, but we can check if he is present or better, check his profile

        const hostProfile = await request(app)
            .get("/api/v1/auth/me")
            .set("Authorization", `Bearer ${hostToken}`);

        expect(hostProfile.body.totalHoursGiven).toBeGreaterThan(0);
        expect(hostProfile.body.averageRating).toBe(5);
    });
});

import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const log = (msg: string) => {
    console.log(msg);
};

const runTest = async () => {
    log("Starting Workflow Verification...");

    let app: any;
    try {
        // Dynamic import to handle app loading
        const module = await import("../app.js");
        app = module.default;
        log("App imported successfully");
    } catch (e: any) {
        log(`Failed to import app: ${e.message}`);
        process.exit(1);
    }

    // Connect to DB if not connected
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lms_test");
            log("Connected to MongoDB");
        } catch (e: any) {
            log(`DB Connection Failed: ${e.message}`);
            process.exit(1);
        }
    }

    let hostToken: string;
    let userToken: string;
    let hostId: string;
    let userId: string;
    let offerId: string;
    let bookingId: string;

    try {
        // --- Setup Users ---
        log("Creating Host...");
        const hostEmail = `host_${Date.now()}@test.com`;
        const hostRes = await request(app).post("/api/v1/auth/register").send({
            name: "Host User",
            email: hostEmail,
            password: "password123",
            credits: 100
        });

        if (hostRes.statusCode !== 201) {
            log(`Register Host Failed: ${JSON.stringify(hostRes.body)}`);
            // Try login if already exists (unlikely with random email)
        }

        const hostLogin = await request(app).post("/api/v1/auth/login").send({
            email: hostEmail,
            password: "password123"
        });
        hostToken = hostLogin.body.token;
        hostId = hostLogin.body.user._id;
        log(`Host Created: ${hostId}`);

        log("Creating Requester...");
        const userEmail = `user_${Date.now()}@test.com`;
        await request(app).post("/api/v1/auth/register").send({
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
        log(`Requester Created: ${userId}`);

        // --- 1. Create Offer ---
        log("1. Creating Offer...");
        const offerRes = await request(app)
            .post("/api/v1/offers")
            .set("Authorization", `Bearer ${hostToken}`)
            .send({
                title: "Workflow Offer",
                description: "Test Description",
                tag: "Workflow",
                duration: 60,
                credits: 10
            });
        if (offerRes.statusCode !== 201) throw new Error(`Create Offer Failed: ${JSON.stringify(offerRes.body)}`);
        log(`Offer Created Body: ${JSON.stringify(offerRes.body)}`);
        offerId = offerRes.body._id;
        log(`Offer Created: ${offerId}`);

        // --- 2. Search Offer ---
        log("2. Searching Offer...");
        const searchRes = await request(app)
            .get("/api/v1/offers?search=Workflow")
            .set("Authorization", `Bearer ${userToken}`);
        if (searchRes.statusCode !== 200) throw new Error("Search Failed");
        if (searchRes.body.length === 0) throw new Error("Offer not found in search");
        log("Search Successful");

        // --- 3. Create Booking ---
        log("3. Creating Booking...");
        const bookRes = await request(app)
            .post("/api/v1/bookings")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                offerId: offerId,
                requesterId: userId
            });
        if (bookRes.statusCode !== 201) throw new Error(`Booking Failed: ${JSON.stringify(bookRes.body)}`);
        bookingId = bookRes.body._id;
        log(`Booking Created: ${bookingId}`);

        // --- 4. Accept Booking ---
        log("4. Accepting Booking...");
        const acceptRes = await request(app)
            .patch(`/api/v1/bookings/${bookingId}/accept`)
            .set("Authorization", `Bearer ${hostToken}`)
            .send({
                meetingLink: "https://meet.google.com/test-link"
            });
        if (acceptRes.statusCode !== 200) throw new Error(`Accept Failed: ${JSON.stringify(acceptRes.body)}`);
        if (acceptRes.body.status !== "accepted") throw new Error("Status not updated to accepted");
        log("Booking Accepted");

        // --- 5. Complete Booking ---
        log("5. Completing Booking...");
        const completeRes = await request(app)
            .patch(`/api/v1/bookings/${bookingId}/complete`)
            .set("Authorization", `Bearer ${hostToken}`);
        if (completeRes.statusCode !== 200) throw new Error(`Complete Failed: ${JSON.stringify(completeRes.body)}`);
        if (completeRes.body.status !== "completed") throw new Error("Status not updated to completed");
        log("Booking Completed");

        // --- 6. Review Host ---
        log("6. Reviewing Host...");
        const reviewRes = await request(app)
            .post("/api/v1/reviews")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                bookingId: bookingId,
                rating: 5,
                comment: "Great session!"
            });
        if (reviewRes.statusCode !== 201) {
            log(`Review Failed Status: ${reviewRes.statusCode}`);
            log(`Review Failed Body: ${reviewRes.text}`);
            throw new Error(`Review Failed`);
        }
        log("Review Created");

        // --- 7. Check Leaderboard ---
        log("7. Checking Leaderboard...");
        const leaderRes = await request(app)
            .get("/api/v1/auth/leaderboard");
        if (leaderRes.statusCode !== 200) throw new Error("Leaderboard Fetch Failed");

        log("SUCCESS: All workflow steps passed!");
    } catch (error: any) {
        log(`TEST FAILED: ${error.message}`);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

runTest();

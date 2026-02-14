import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lms_test");
        console.log("Connected!");
        await mongoose.disconnect();
        console.log("Disconnected!");
    } catch (e) {
        console.error("DB Connection Failed", e);
    }
};

run();

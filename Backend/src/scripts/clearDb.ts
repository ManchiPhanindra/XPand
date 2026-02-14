import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Offer from "../models/Offer";
import Booking from "../models/Booking";

dotenv.config();

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
        console.log("MongoDB Connected");

        await User.deleteMany({});
        console.log("Users deleted");

        await Offer.deleteMany({});
        console.log("Offers deleted");

        await Booking.deleteMany({});
        console.log("Bookings deleted");

        console.log("All data cleared successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing data:", error);
        process.exit(1);
    }
};

clearData();

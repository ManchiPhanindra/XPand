import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });

// Prevent duplicate reviews for the same booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);

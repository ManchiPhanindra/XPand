import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "rejected"],
    default: "pending"
  },
  meetingLink: String,
  note: String
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);

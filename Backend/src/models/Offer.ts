import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tag: String,
  duration: Number, // in minutes
  credits: { type: Number, default: 0 }, // Cost of the session
  prerequisites: String,
  availability: String,
  format: {
    type: String,
    enum: ['One-on-One', 'Group', 'Review', 'Other'],
    default: 'One-on-One'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);

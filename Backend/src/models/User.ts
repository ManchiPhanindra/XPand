import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  credits: { type: Number, default: 100 },
  skillsOffered: [String],
  skillsWanted: [String],
  totalHoursGiven: { type: Number, default: 0 },
  totalHoursReceived: { type: Number, default: 0 },
  giveScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("User", userSchema);

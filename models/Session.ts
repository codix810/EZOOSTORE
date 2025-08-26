import mongoose, { Schema, models } from "mongoose";

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Userazo" },
  deviceId: String,
  token: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
});

export const Session = models.Session || mongoose.model("Session", sessionSchema);

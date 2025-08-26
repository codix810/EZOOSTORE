import mongoose, { Schema, models } from "mongoose";

const UserazoSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, default: "Userazo" },
  image: String,
  loginCount: { type: Number, default: 0 },
  lastLogin: Date,
  loginHistory: [String],
}, { timestamps: true });

export const Userazo = models.Userazo || mongoose.model("Userazo", UserazoSchema);

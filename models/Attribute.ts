import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema({
  type: { type: String, enum: ["color", "size", "logo"], required: true },
  value: { type: String },       // للون أو الحجم
  logoUrl: { type: String },     // للوجو
}, { timestamps: true });

export const Attribute = mongoose.models.Attribute || mongoose.model("Attribute", AttributeSchema);

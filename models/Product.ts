// /models/Product.ts
import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);

// lib/db.ts
import mongoose from "mongoose";

let isConnected = false; // عشان ما يعملش reconnect كل مرة

export default async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "houdaDB",
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

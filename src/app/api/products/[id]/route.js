import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import { Product } from "../../../../../models/Product";
import { v2 as cloudinary } from "cloudinary";

// 🛠️ إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 GET: جلب منتج واحد
export async function GET(req, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Product error:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

// 🔴 DELETE: حذف منتج + حذف صورة من Cloudinary
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 🖼️ لو فيه صورة متخزنة نحذفها من Cloudinary
    if (product.imageUrl) {
      try {
        const urlParts = product.imageUrl.split("/");
        const uploadIndex = urlParts.findIndex((part) => part === "upload");
        const publicPathParts = urlParts.slice(uploadIndex + 1);
        const filteredParts = publicPathParts.filter((part) => !part.startsWith("v"));
        const fileName = filteredParts.pop();
        const publicId = [...filteredParts, fileName.split(".").slice(0, -1).join(".")].join("/");

        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.warn("⚠️ Cloudinary delete error:", cloudErr);
      }
    }

    // حذف المنتج من الداتا بيز
    await product.deleteOne();

    return NextResponse.json({ message: "Product and image deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Product error:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}

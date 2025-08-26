import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import { Attribute } from "../../../../../models/Attribute";
import { v2 as cloudinary } from "cloudinary";

// 🛠️ إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 GET: جلب Attribute واحد
export async function GET(req, { params }) {
  try {
    await connectDB();
    const attribute = await Attribute.findById(params.id).lean();

    if (!attribute) {
      return NextResponse.json({ message: "Attribute not found" }, { status: 404 });
    }

    return NextResponse.json({ attribute }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Attribute error:", error);
    return NextResponse.json({ message: "Failed to fetch attribute" }, { status: 500 });
  }
}

// 🟡 PUT: تعديل Attribute
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    // لو فيه صورة Logo للتعديل، ممكن نحذف القديمة
    if (body.logoUrl) {
      const oldAttr = await Attribute.findById(params.id);
      if (oldAttr?.logoUrl) {
        try {
          const urlParts = oldAttr.logoUrl.split("/");
          const uploadIndex = urlParts.findIndex((part) => part === "upload");
          const publicPathParts = urlParts.slice(uploadIndex + 1);
          const filteredParts = publicPathParts.filter((part) => !part.startsWith("v"));
          const fileName = filteredParts.pop();
const publicId = [...filteredParts, fileName ? fileName.split(".").slice(0, -1).join(".") : ""].join("/");

          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.warn("⚠️ Cloudinary delete error:", cloudErr);
        }
      }
    }

    const updatedAttr = await Attribute.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedAttr) {
      return NextResponse.json({ message: "Attribute not found" }, { status: 404 });
    }

    return NextResponse.json({ attribute: updatedAttr }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT Attribute error:", error);
    return NextResponse.json({ message: "Error updating attribute" }, { status: 500 });
  }
}

// 🔴 DELETE: حذف Attribute + حذف Logo من Cloudinary
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const attr = await Attribute.findById(params.id);
    if (!attr) {
      return NextResponse.json({ message: "Attribute not found" }, { status: 404 });
    }

    // حذف Logo لو موجود
    if (attr.type === "logo" && attr.logoUrl) {
      try {
        const urlParts = attr.logoUrl.split("/");
        const uploadIndex = urlParts.findIndex((part) => part === "upload");
        const publicPathParts = urlParts.slice(uploadIndex + 1);
        const filteredParts = publicPathParts.filter((part) => !part.startsWith("v"));
        const fileName = filteredParts.pop();
const publicId = [...filteredParts, fileName ? fileName.split(".").slice(0, -1).join(".") : ""].join("/");

        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.warn("⚠️ Cloudinary delete error:", cloudErr);
      }
    }

    await attr.deleteOne();

    return NextResponse.json({ message: "Attribute and logo deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Attribute error:", error);
    return NextResponse.json({ message: "Failed to delete attribute" }, { status: 500 });
  }
}

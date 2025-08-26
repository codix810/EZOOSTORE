//app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db"; // ✅ default import
import { TshirtOrder } from "../../../../../models/TshirtOrder";
import { v2 as cloudinary } from "cloudinary";

// 🛠️ إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 GET: عرض طلب واحد
export async function GET(req, { params }) {
  try {
    await connectDB();
    const order = await TshirtOrder.findById(params.id).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Order error:", error);
    return NextResponse.json({ message: "Failed to fetch order" }, { status: 500 });
  }
}

// 🟡 PUT: تعديل طلب
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    const updatedOrder = await TshirtOrder.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT Order error:", error);
    return NextResponse.json({ message: "Error updating order" }, { status: 500 });
  }
}

// 🔴 DELETE: حذف طلب + حذف صورة من Cloudinary
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const order = await TshirtOrder.findById(params.id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 🖼️ لو فيه لوجو متخزن نحذفه من Cloudinary
    if (order.logo) {
      try {
        const urlParts = order.logo.split("/");
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

    // حذف الطلب من الداتا بيز
    await order.deleteOne();

    return NextResponse.json({ message: "Order and logo deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Order error:", error);
    return NextResponse.json({ message: "Failed to delete order" }, { status: 500 });
  }
}

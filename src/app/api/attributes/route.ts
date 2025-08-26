import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { Attribute } from "../../../../models/Attribute";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: عرض كل العناصر
export async function GET() {
  await connectDB();
  const attributes = await Attribute.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, attributes });
}

// POST: إضافة عنصر جديد
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    let logoUrl = "";

    if (data.type === "logo" && data.file) {
      const uploaded = await cloudinary.uploader.upload(data.file, { folder: "admin-logos" });
      logoUrl = uploaded.secure_url;
    }

    const attr = await Attribute.create({
      type: data.type,
      value: data.value || "",
      logoUrl: logoUrl || "",
    });

    return NextResponse.json({ success: true, attribute: attr });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

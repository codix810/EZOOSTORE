// /app/api/products/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { Product } from "../../../../models/Product";

interface ProductInput {
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  imageUrl: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data: ProductInput = await req.json();
    const { name, description, price, discount, category, imageUrl } = data;

    if (!name || !description || !price || !category || !imageUrl) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const productData: ProductInput = { name, description, price, category, imageUrl };
    if (discount !== undefined) productData.discount = discount;

    const product = await Product.create(productData);
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("❌ Product API Error:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error("❌ Product API Error (GET):", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

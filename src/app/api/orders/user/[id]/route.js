//app/api/orders/user/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../../../../lib/db";
import { TshirtOrder } from "../../../../../../models/TshirtOrder";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // ⚠️ صحح استخدام params
    const resolvedParams = await params; // دلوقتي انت جبت الـ object كامل
    const userId = resolvedParams.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID مفقود" }, { status: 400 });
    }

    const userOrders = await TshirtOrder.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders: userOrders }, { status: 200 });
  } catch (error) {
    console.error("❌ GET User Orders error:", error);
    return NextResponse.json({ success: false, message: "فشل جلب الطلبات" }, { status: 500 });
  }
}

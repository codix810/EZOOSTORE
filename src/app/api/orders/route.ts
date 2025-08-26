import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { TshirtOrder } from "../../../../models/TshirtOrder";

// 🟢 إنشاء طلب جديد
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const { items, customer, userId, shipping = 20, total, coupon = "", status = "قيد المعالجة" } = data;

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.governorate || !customer?.address || !userId) {
      return NextResponse.json({ success: false, error: "Missing customer info" }, { status: 400 });
    }

    // ✅ إذا فيه أكتر من منتج أو منتج واحد، نتعامل مع كل حاجة ضمن items
    let orderItems = items;

    if (!Array.isArray(items) || items.length === 0) {
      // حالة المنتج الواحد: تحويل البيانات القديمة لهيئة items
      const { productId = null, size, color, price, discountedPrice, quantity = 1, imageUrl = "", logo } = data;

      if (!size || !color || !price) {
        return NextResponse.json({ success: false, error: "Missing product info" }, { status: 400 });
      }

      orderItems = [
        {
          productId,
          name: data.name || "Custom T-Shirt",
          size,
          color,
          quantity,
          price,
          discountedPrice: discountedPrice ?? price,
          imageUrl: imageUrl || logo || "",
        },
      ];
    }

interface OrderItem {
  productId: string | null;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  imageUrl: string;
}

const orderTotal = typeof total === "number"
  ? total
  : orderItems.reduce((sum: number, i: OrderItem) => {
      return sum + (i.discountedPrice ?? i.price) * i.quantity;
    }, 0) + shipping;


    const order = await TshirtOrder.create({
      items: orderItems,
      shipping,
      total: orderTotal,
      coupon,
      status,
      user: userId,
      customer,
    });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("❌ Order API Error:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

// 🟢 جلب كل الطلبات
export async function GET() {
  try {
    await connectDB();
    const orders = await TshirtOrder.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Order API Error (GET):", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/db";
import { Userazo } from "../../../../models/login";
import { Session } from "../../../../models/Session";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, deviceId } = await request.json();

    if (!email || !password || !deviceId) {
      return NextResponse.json({ message: "كل البيانات مطلوبة" }, { status: 400 });
    }

    const user = await Userazo.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "الحساب غير موجود" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "كلمة السر غير صحيحة" }, { status: 401 });
    }

    // ✅ تحديث عداد الدخول
    const now = new Date();
    user.loginCount += 1;
    user.lastLogin = now;
    user.loginHistory.unshift(now.toISOString().split("T")[0]);
    await user.save();

    // ✅ إنشاء JWT
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "user",
        lastLogin: now.toISOString(),
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ تأكد هل الجلسة موجودة بنفس الجهاز
    const existingSession = await Session.findOne({ userId: user._id, deviceId });

    if (!existingSession) {
      await Session.create({
        userId: user._id,
        deviceId,
        token,
        userAgent: request.headers.get("user-agent") || "unknown",
        createdAt: new Date(),
        lastLogin: now,
        isActive: true,
      });
    }

    // ✅ إعداد الكوكي
    const response = NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "Userazo",
        image: user.image || null,
      },
    }, { status: 200 });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Login Error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "حصل خطأ في السيرفر", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "حصل خطأ في السيرفر", error: String(error) },
      { status: 500 }
    );
  }
}
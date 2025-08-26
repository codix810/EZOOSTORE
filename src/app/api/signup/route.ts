import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/db";
import { Userazo } from "../../../../models/login";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password, phone, role } = await request.json();
    const createdAt = new Date();

    if (!name || !email || !password || !phone || !role) {
      return NextResponse.json({ message: "كل البيانات مطلوبة" }, { status: 400 });
    }

    // ✅ التحقق لو المستخدم موجود بالفعل
    const exists = await Userazo.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      return NextResponse.json(
        { message: "الإيميل أو رقم الهاتف موجود بالفعل" },
        { status: 409 }
      );
    }

    // ✅ تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ نمنع أي حد يسجل كـ admin من الفورم
    const finalRole = ["admin"].includes(role) ? role : "Userazo";

    // ✅ إنشاء المستخدم
    const newUser = await Userazo.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: finalRole,
      createdAt,
    });

    // ✅ إنشاء التوكن
    const token = jwt.sign(
      {
        userId: newUser._id,
        name,
        email,
        phone,
        role: finalRole,
        createdAt,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "تم إنشاء الحساب بنجاح 🎉",
        user: {
          _id: newUser._id,
          name,
          email,
          phone,
          role: finalRole,
          createdAt,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Register Error:", error);

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
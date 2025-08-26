// app/api/users/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // أو db("اسم_القاعدة")
    const Userazo = await db.collection('Userazo').find({}).toArray();

    return NextResponse.json({ Userazo });
  } catch (err) {
    console.error('🔥 Error in GET /api/users:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

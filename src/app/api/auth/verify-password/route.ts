import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_masjid_cempaka_2026";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!decoded || !decoded.username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await prisma.admin.findUnique({ where: { username: decoded.username } });
    if (!admin) return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return NextResponse.json({ error: "Password salah!" }, { status: 401 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify Password Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_masjid_cempaka_2026";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Cek apakah database admin masih kosong (untuk setup awal)
    const adminCount = await prisma.admin.count();
    
    if (adminCount === 0) {
      // Jika kosong, buat akun admin default: admin / admin123
      if (username === "admin" && password === "admin123") {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.admin.create({
          data: { username, password: hashedPassword },
        });
      }
    }

    // Cari admin di database
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    // Buat token JWT
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "1d" });

    // Set cookie
    const response = NextResponse.json({ success: true, message: "Login berhasil" });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

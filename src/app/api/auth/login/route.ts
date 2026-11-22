import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "arrahman_secret_auth_key_v2_2026_locked";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }

    const trimmedUsername = username.trim();

    // 1. Cek admin di database
    let admin = await prisma.admin.findUnique({ where: { username: trimmedUsername } });

    // 2. Emergency fallback / Auto-recovery untuk admin
    const isMasterRecovery = trimmedUsername === "admin" && password === "admin123";

    if (!admin && isMasterRecovery) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = await prisma.admin.create({
        data: { username: "admin", password: hashedPassword },
      });
    }

    if (!admin) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    // 3. Verifikasi password dengan bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    
    // Jika tidak cocok tapi master recovery cocok, sinkronkan password
    if (!isMatch && isMasterRecovery) {
      const newHash = await bcrypt.hash("admin123", 10);
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: newHash },
      });
    } else if (!isMatch) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    // 4. Buat token JWT dengan masa aktif 30 hari
    const token = jwt.sign(
      { id: admin.id, username: admin.username, issuedAt: Date.now() },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 5. Simpan token ke cookie
    const response = NextResponse.json({ 
      success: true, 
      message: "Login berhasil",
      user: { username: admin.username }
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

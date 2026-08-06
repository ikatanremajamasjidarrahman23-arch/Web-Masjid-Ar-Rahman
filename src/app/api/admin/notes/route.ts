import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_masjid_cempaka_2026";

function checkAuth(token: string | undefined) {
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notes = await prisma.adminNote.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error("GET AdminNote Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const { title, content } = data;

    if (!title || !content) {
      return NextResponse.json({ error: "Judul dan Konten wajib diisi" }, { status: 400 });
    }

    const newNote = await prisma.adminNote.create({
      data: {
        title,
        content,
      },
    });

    return NextResponse.json({ success: true, data: newNote });
  } catch (error) {
    console.error("POST AdminNote Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });

    await prisma.adminNote.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE AdminNote Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });

    const data = await request.json();
    const { title, content } = data;
    
    if (!title || !content) {
      return NextResponse.json({ error: "Judul dan Konten wajib diisi" }, { status: 400 });
    }

    const updated = await prisma.adminNote.update({
      where: { id },
      data: { title, content }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT AdminNote Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

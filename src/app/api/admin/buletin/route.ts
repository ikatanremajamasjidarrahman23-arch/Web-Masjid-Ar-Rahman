import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationToAll } from "@/lib/push";
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
    const bulletins = await prisma.bulletin.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: bulletins });
  } catch (error) {
    console.error("GET Bulletin Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const { title, description, imageUrl, expiryDate } = data;

    if (!title || !description || !expiryDate) {
      return NextResponse.json({ error: "Judul, Deskripsi, dan Tanggal Berakhir wajib diisi" }, { status: 400 });
    }

    const newBulletin = await prisma.bulletin.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        expiryDate: new Date(expiryDate),
        isActive: true,
      },
    });

    // Gunakan fungsi after() dari Next.js agar notifikasi dikirim di latar belakang
    // tanpa membuat loading website menjadi lambat (Vercel akan menunggu ini selesai).
    after(() => {
      sendNotificationToAll(
        "Buletin Baru: " + title,
        description.length > 50 ? description.substring(0, 50) + "..." : description,
        "/"
      ).catch(console.error);
    });

    return NextResponse.json({ success: true, data: newBulletin });
  } catch (error) {
    console.error("POST Bulletin Error:", error);
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

    await prisma.bulletin.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Bulletin Error:", error);
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
    
    // Allow toggle isActive
    if (data.toggleActive) {
      const bulletin = await prisma.bulletin.findUnique({ where: { id } });
      if (!bulletin) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
      
      const updated = await prisma.bulletin.update({
        where: { id },
        data: { isActive: !bulletin.isActive }
      });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PUT Bulletin Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

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

    const ukm = await prisma.ukm.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: ukm });
  } catch (error) {
    console.error("GET UKM Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const { namaUkm, kategori, deskripsi, jadwalKegiatan, pembina, kontakWa, imageUrl } = data;

    if (!namaUkm || !kategori || !deskripsi) {
      return NextResponse.json({ error: "Nama UKM, Kategori, dan Deskripsi wajib diisi" }, { status: 400 });
    }

    const newUkm = await prisma.ukm.create({
      data: {
        namaUkm,
        kategori,
        deskripsi,
        jadwalKegiatan: jadwalKegiatan || null,
        pembina: pembina || null,
        kontakWa: kontakWa || null,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: newUkm });
  } catch (error) {
    console.error("POST UKM Error:", error);
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
    
    // Check if it's a toggle active request
    if (data.toggleActive) {
      const ukm = await prisma.ukm.findUnique({ where: { id } });
      if (!ukm) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
      
      const updated = await prisma.ukm.update({
        where: { id },
        data: { isActive: !ukm.isActive }
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // Full update
    const { namaUkm, kategori, deskripsi, jadwalKegiatan, pembina, kontakWa, imageUrl } = data;
    
    if (!namaUkm || !kategori || !deskripsi) {
      return NextResponse.json({ error: "Nama UKM, Kategori, dan Deskripsi wajib diisi" }, { status: 400 });
    }

    const updated = await prisma.ukm.update({
      where: { id },
      data: { 
        namaUkm, 
        kategori, 
        deskripsi,
        jadwalKegiatan: jadwalKegiatan || null,
        pembina: pembina || null,
        kontakWa: kontakWa || null,
        imageUrl: imageUrl || null,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT UKM Error:", error);
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

    await prisma.ukm.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE UKM Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

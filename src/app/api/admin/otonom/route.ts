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

    const otonom = await prisma.otonom.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: otonom });
  } catch (error) {
    console.error("GET Otonom Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const { namaOrganisasi, kategori, deskripsi, jadwalKegiatan, pembina, kontakWa, imageUrl } = data;

    if (!namaOrganisasi || !kategori || !deskripsi) {
      return NextResponse.json({ error: "Nama Organisasi, Kategori, dan Deskripsi wajib diisi" }, { status: 400 });
    }

    const newOtonom = await prisma.otonom.create({
      data: {
        namaOrganisasi,
        kategori,
        deskripsi,
        jadwalKegiatan: jadwalKegiatan || null,
        pembina: pembina || null,
        kontakWa: kontakWa || null,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: newOtonom });
  } catch (error) {
    console.error("POST Otonom Error:", error);
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
      const otonom = await prisma.otonom.findUnique({ where: { id } });
      if (!otonom) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
      
      const updated = await prisma.otonom.update({
        where: { id },
        data: { isActive: !otonom.isActive }
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // Full update
    const { namaOrganisasi, kategori, deskripsi, jadwalKegiatan, pembina, kontakWa, imageUrl } = data;
    
    if (!namaOrganisasi || !kategori || !deskripsi) {
      return NextResponse.json({ error: "Nama Organisasi, Kategori, dan Deskripsi wajib diisi" }, { status: 400 });
    }

    const updated = await prisma.otonom.update({
      where: { id },
      data: { 
        namaOrganisasi, 
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
    console.error("PUT Otonom Error:", error);
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

    await prisma.otonom.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Otonom Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

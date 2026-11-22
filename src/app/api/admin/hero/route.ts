import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const heroImages = await prisma.heroImage.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: heroImages });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { imageUrl, caption } = await request.json();
    if (!imageUrl) return NextResponse.json({ error: "URL gambar wajib diisi." }, { status: 400 });

    const count = await prisma.heroImage.count();
    if (count >= 40) {
      return NextResponse.json({ error: "Maksimal 40 foto hero diperbolehkan." }, { status: 400 });
    }
    const heroImage = await prisma.heroImage.create({
      data: { imageUrl, caption: caption || null, order: count },
    });
    return NextResponse.json({ success: true, data: heroImage });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambahkan foto." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID tidak ditemukan." }, { status: 400 });

    await prisma.heroImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus foto." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, caption, order, isActive } = await request.json();
    if (!id) return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });

    const updated = await prisma.heroImage.update({
      where: { id },
      data: {
        ...(caption !== undefined && { caption }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui." }, { status: 500 });
  }
}


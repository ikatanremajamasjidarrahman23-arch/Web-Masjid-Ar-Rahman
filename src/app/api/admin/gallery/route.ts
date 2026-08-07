import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, category, imageUrl, imagePosition = "center" } = data;

    if (!title || !category || !imageUrl) {
      return NextResponse.json(
        { error: "Judul, Kategori, dan Foto wajib diisi." },
        { status: 400 }
      );
    }

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        category,
        imageUrl,
        imagePosition,
      },
    });

    return NextResponse.json({ success: true, data: newGallery });
  } catch (error) {
    console.error("Create Gallery Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID Galeri tidak ditemukan." },
        { status: 400 }
      );
    }

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Foto galeri berhasil dihapus." });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

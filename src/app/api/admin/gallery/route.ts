import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session.valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: galleries });
  } catch (error) {
    console.error("GET Gallery Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyAdminSession();
    if (!session.valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();

    // Dukungan Upload Sekaligus (Batch / Multiple Photos)
    if (Array.isArray(data.items) && data.items.length > 0) {
      const createdItems = [];
      for (const item of data.items) {
        if (item.imageUrl) {
          const created = await prisma.gallery.create({
            data: {
              title: item.title || data.title || "Dokumentasi Kegiatan",
              category: item.category || data.category || "Kegiatan Masjid",
              imageUrl: item.imageUrl,
              imagePosition: item.imagePosition || "center",
              linkGdrive: item.linkGdrive || data.linkGdrive || null,
            },
          });
          createdItems.push(created);
        }
      }
      return NextResponse.json({ success: true, data: createdItems, count: createdItems.length });
    }

    // Single item upload
    const { title, category, imageUrl, imagePosition = "center", linkGdrive } = data;

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
        linkGdrive: linkGdrive || null,
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
    const session = await verifyAdminSession();
    if (!session.valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

export async function PUT(request: Request) {
  try {
    const session = await verifyAdminSession();
    if (!session.valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const { id, title, category, imageUrl, imagePosition, linkGdrive } = data;

    if (!id) {
      return NextResponse.json(
        { error: "ID Galeri wajib diisi." },
        { status: 400 }
      );
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(imageUrl && { imageUrl }),
        ...(imagePosition && { imagePosition }),
        ...(linkGdrive !== undefined && { linkGdrive }),
      },
    });

    return NextResponse.json({ success: true, data: updatedGallery });
  } catch (error) {
    console.error("Update Gallery Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat memperbarui galeri." },
      { status: 500 }
    );
  }
}

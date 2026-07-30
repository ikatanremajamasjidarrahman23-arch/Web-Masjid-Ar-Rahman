import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationToAll } from "@/lib/push";

// Tambah Kegiatan IRMAS
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, content, imageUrl } = data;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul dan konten wajib diisi." },
        { status: 400 }
      );
    }

    const activity = await prisma.irmasActivity.create({
      data: {
        title,
        content,
        imageUrl,
      },
    });

    // Gunakan fungsi after() agar tidak membebani loading website
    after(() => {
      sendNotificationToAll(
        "Info IRMAS Baru: " + title,
        "Cek info terbaru dari Ikatan Remaja Masjid",
        "/irmas"
      ).catch(console.error);
    });

    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("Create IRMAS Activity Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// Hapus Kegiatan IRMAS
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID Kegiatan tidak ditemukan." },
        { status: 400 }
      );
    }

    await prisma.irmasActivity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Kegiatan berhasil dihapus." });
  } catch (error) {
    console.error("Delete IRMAS Activity Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationToAll } from "@/lib/push";

// Workaround for experimental after in next/server if needed, but we removed it from config so we can just use normal async execution or setTimeout since this is an API route.
// Actually, `after` is stable in Next.js 15, but let's just do it directly or without breaking the type if `after` causes issues.
import { after } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, speaker, schedule, location, description, imageUrl } = data;

    if (!title || !speaker || !schedule || !location) {
      return NextResponse.json(
        { error: "Judul, Pemateri, Jadwal, dan Lokasi wajib diisi." },
        { status: 400 }
      );
    }

    const newKajian = await prisma.studySchedule.create({
      data: {
        title,
        speaker,
        schedule,
        location,
        description,
        imageUrl,
      },
    });

    try {
      after(() => {
        sendNotificationToAll(
          "Kajian Baru: " + title,
          "Pemateri: " + speaker + " | Jadwal: " + schedule,
          "/"
        ).catch(console.error);
      });
    } catch (e) {
      console.error("Failed to use after(), executing synchronously", e);
      sendNotificationToAll(
        "Kajian Baru: " + title,
        "Pemateri: " + speaker + " | Jadwal: " + schedule,
        "/"
      ).catch(console.error);
    }

    return NextResponse.json({ success: true, data: newKajian });
  } catch (error: any) {
    console.error("Create Kajian Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat membuat jadwal." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID Kajian tidak ditemukan." },
        { status: 400 }
      );
    }

    await prisma.studySchedule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Kajian berhasil dihapus." });
  } catch (error: any) {
    console.error("Delete Kajian Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server saat menghapus jadwal." },
      { status: 500 }
    );
  }
}

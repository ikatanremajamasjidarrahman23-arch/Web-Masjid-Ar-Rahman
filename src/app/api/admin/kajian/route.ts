import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationToAll } from "@/lib/push";

export async function POST(request: Request) {
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

    // Send push notification asynchronously (await is required on Vercel so it doesn't get killed)
    await sendNotificationToAll(
      "Kajian Baru: " + title,
      "Pemateri: " + speaker + " | Jadwal: " + schedule,
      "/"
    ).catch(console.error);

    return NextResponse.json({ success: true, data: newKajian });
  } catch (error) {
    console.error("Create Kajian Error:", error);
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
        { error: "ID Kajian tidak ditemukan." },
        { status: 400 }
      );
    }

    await prisma.studySchedule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Kajian berhasil dihapus." });
  } catch (error) {
    console.error("Delete Kajian Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

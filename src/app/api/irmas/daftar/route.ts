import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, address, reason } = data;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "Nama, No WhatsApp, dan Alamat wajib diisi." },
        { status: 400 }
      );
    }

    const newMember = await prisma.irmasMemberRegistration.create({
      data: {
        name,
        phone,
        address,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil disubmit.",
      data: newMember,
    });
  } catch (error) {
    console.error("IRMAS Registration Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Hapus Data Pendaftar Anggota IRMAS
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID Pendaftar tidak ditemukan." },
        { status: 400 }
      );
    }

    await prisma.irmasMemberRegistration.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Data pendaftar berhasil dihapus." });
  } catch (error) {
    console.error("Delete IRMAS Member Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

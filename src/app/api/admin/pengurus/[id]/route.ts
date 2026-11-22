import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return verifyToken(token);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const { name, position, parentId, order } = data;

    if (!name || !name.trim() || !position || !position.trim()) {
      return NextResponse.json({ error: "Nama dan jabatan pengurus wajib diisi." }, { status: 400 });
    }

    // Hindari atasan menunjuk ke diri sendiri
    const cleanParentId = parentId && typeof parentId === "string" && parentId.trim() !== "" && parentId !== id 
      ? parentId.trim() 
      : null;

    const member = await prisma.organizationMember.update({
      where: { id },
      data: {
        name: name.trim(),
        position: position.trim(),
        parentId: cleanParentId,
        order: Number(order) || 0,
      },
    });

    revalidatePath("/profil");

    return NextResponse.json(member);
  } catch (error: any) {
    console.error("PUT Pengurus Error:", error);
    return NextResponse.json({ error: error.message || "Gagal memperbarui pengurus" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.organizationMember.delete({
      where: { id },
    });

    revalidatePath("/profil");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Pengurus Error:", error);
    return NextResponse.json({ error: error.message || "Gagal menghapus pengurus" }, { status: 500 });
  }
}

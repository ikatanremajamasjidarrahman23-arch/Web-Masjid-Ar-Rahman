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

export async function GET() {
  try {
    const members = await prisma.organizationMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pengurus" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, position, parentId, order } = data;

    if (!name || !name.trim() || !position || !position.trim()) {
      return NextResponse.json({ error: "Nama dan jabatan pengurus wajib diisi." }, { status: 400 });
    }

    const member = await prisma.organizationMember.create({
      data: {
        name: name.trim(),
        position: position.trim(),
        parentId: parentId && typeof parentId === "string" && parentId.trim() !== "" ? parentId.trim() : null,
        order: Number(order) || 0,
      },
    });

    revalidatePath("/profil");

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error("POST Pengurus Error:", error);
    return NextResponse.json({ error: error.message || "Gagal menambahkan pengurus" }, { status: 500 });
  }
}

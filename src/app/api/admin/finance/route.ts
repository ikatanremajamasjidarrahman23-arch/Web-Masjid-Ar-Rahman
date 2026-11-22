import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET: Daftar semua transaksi keuangan
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const finances = await prisma.finance.findMany({
      orderBy: { date: "desc" },
    });

    const totalIn = finances
      .filter((f) => f.type === "IN")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalOut = finances
      .filter((f) => f.type === "OUT")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const saldo = totalIn - totalOut;

    return NextResponse.json({ finances, totalIn, totalOut, saldo });
  } catch (error) {
    console.error("GET /api/admin/finance error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Tambah transaksi baru
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, amount, description, date, category } = body;

    if (!type || !amount || !description || !date) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const finance = await prisma.finance.create({
      data: {
        type: type as "IN" | "OUT",
        amount: Number(amount),
        description: String(description),
        date: new Date(date),
        category: category || null,
      },
    });

    return NextResponse.json({ finance }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/finance error:", error);
    return NextResponse.json({ error: "Gagal menyimpan transaksi" }, { status: 500 });
  }
}

// PUT: Update transaksi
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, type, amount, description, date, category } = body;

    if (!id) {
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    }

    const finance = await prisma.finance.update({
      where: { id },
      data: {
        type: type as "IN" | "OUT",
        amount: Number(amount),
        description: String(description),
        date: new Date(date),
        category: category || null,
      },
    });

    return NextResponse.json({ finance });
  } catch (error) {
    console.error("PUT /api/admin/finance error:", error);
    return NextResponse.json({ error: "Gagal memperbarui transaksi" }, { status: 500 });
  }
}

// DELETE: Hapus transaksi berdasarkan ?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    }

    await prisma.finance.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/finance error:", error);
    return NextResponse.json({ error: "Gagal menghapus transaksi" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia-negara");

async function verifyAuth() {
  const token = cookies().get("admin_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const members = await prisma.organizationMember.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, position, parentId, order } = data;
    
    if (!name || !position) {
      return NextResponse.json({ error: "Name and position required" }, { status: 400 });
    }

    const member = await prisma.organizationMember.create({
      data: {
        name,
        position,
        parentId: parentId || null,
        order: order || 0
      }
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

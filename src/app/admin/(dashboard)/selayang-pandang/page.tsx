import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import SelayangPandangDashboardClient from "./SelayangPandangDashboardClient";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_masjid_cempaka_2026";

export const revalidate = 0;

export default async function SelayangPandangDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (error) {
    redirect("/admin/login");
  }

  const settings = await prisma.settings.findFirst();
  const galleries = await prisma.gallery.findMany({
    where: { category: "Selayang Pandang" },
    orderBy: { createdAt: "asc" }
  });

  return <SelayangPandangDashboardClient 
    initialSettings={settings} 
    initialGalleries={galleries} 
  />;
}

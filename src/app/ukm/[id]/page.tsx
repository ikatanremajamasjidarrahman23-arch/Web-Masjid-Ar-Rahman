import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UkmDetailPageClient from "./UkmDetailPageClient";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let ukm = null;
  try {
    ukm = await prisma.ukm.findFirst({
      where: {
        OR: [
          { id },
          { namaUkm: { contains: id.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });
  } catch (error) {
    console.warn("Database not available during UKM metadata generation");
  }

  if (!ukm) {
    return { title: "Unit Kegiatan - Masjid Jami' Ar-Rahman" };
  }

  return {
    title: `${ukm.namaUkm} - Masjid Jami' Ar-Rahman`,
    description: ukm.deskripsi.slice(0, 160),
  };
}

export default async function UkmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let ukm = null;
  let otherUkms: any[] = [];

  try {
    ukm = await prisma.ukm.findFirst({
      where: {
        OR: [
          { id },
          { namaUkm: { contains: id.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });

    if (ukm) {
      otherUkms = await prisma.ukm.findMany({
        where: {
          id: { not: ukm.id },
          isActive: true,
        },
        take: 3,
      });
    }
  } catch (error) {
    console.warn("Database not available during UKM detail page render");
  }

  if (!ukm) {
    notFound();
  }

  return <UkmDetailPageClient ukm={ukm} otherUkms={otherUkms} />;
}


import { prisma } from "@/lib/prisma";
import UkmClient from "./UkmClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Kegiatan Masjid (UKM) - Masjid Ar-Rahman",
  description: "Daftar unit kegiatan masjid dan organisasi otonom di bawah naungan Masjid Ar-Rahman.",
};

export const revalidate = 60; // Cache for 1 minute

export default async function UkmPage() {
  const ukms = await prisma.ukm.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Unit Kegiatan Masjid (UKM)</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Mengenal lebih dekat unit kegiatan dan organisasi yang bernaung di bawah Masjid Ar-Rahman.
          </p>
        </div>

        <UkmClient initialData={ukms} />
      </div>
    </div>
  );
}

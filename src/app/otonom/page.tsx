import { prisma } from "@/lib/prisma";
import OtonomClient from "./OtonomClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lembaga & Otonom - Masjid Ar-Rahman",
  description: "Daftar lembaga, majelis, dan organisasi otonom di bawah naungan Masjid Ar-Rahman.",
};

export const revalidate = 60; // Cache for 1 minute

export default async function OtonomPage() {
  const otonoms = await prisma.otonom.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lembaga & Otonom</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Mengenal lebih dekat lembaga, majelis, dan organisasi yang bernaung di bawah Masjid Ar-Rahman.
          </p>
        </div>

        <OtonomClient initialData={otonoms} />
      </div>
    </div>
  );
}

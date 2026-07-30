import { prisma } from "@/lib/prisma";
import BulletinBoard from "@/components/BulletinBoard";
import { Megaphone, Newspaper } from "lucide-react";

export const revalidate = 60;

export default async function BuletinPage() {
  const activeBulletins = await prisma.bulletin.findMany({
    where: {
      isActive: true,
      expiryDate: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <Megaphone className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Papan Buletin</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Informasi, berita, dan pengumuman terbaru dari DKM Masjid Jami' Ar-Rahman.
          </p>
        </div>

        {/* Pengumuman Terbaru Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <Newspaper className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Pengumuman Terbaru</h2>
          </div>

          {activeBulletins.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl border border-gray-100 shadow-sm">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada Pengumuman</h3>
              <p className="text-gray-500">Saat ini tidak ada buletin atau pengumuman yang aktif.</p>
            </div>
          ) : (
            <BulletinBoard bulletins={activeBulletins} />
          )}
        </div>

      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Newspaper, UserPlus } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function IrmasPage() {
  const settings = await prisma.settings.findFirst();
  const activities = await prisma.irmasActivity.findMany({
    orderBy: {
      date: 'desc'
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center animate-fade-in flex flex-col items-center">
          {settings?.irmasLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.irmasLogoUrl} alt="Logo IRMAS" className="w-auto object-contain mb-6 drop-shadow-sm transition-all scale-125 md:scale-150" style={{ height: `${Math.max(settings.logoSizeIrmas || 160, 120)}px` }} />
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mt-6">Ikatan Remaja Masjid (IRMAS)</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Wadah kegiatan positif pemuda dan pemudi di lingkungan Masjid Jami' Ar-Rahman.
          </p>
          <Link href="/irmas/daftar" className="mt-8 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium shadow-md transition-colors flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Daftar Menjadi Anggota
          </Link>
        </div>

        {/* Berita & Kegiatan Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <Newspaper className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Berita & Kegiatan Terbaru</h2>
          </div>

          {activities.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500">Belum ada berita kegiatan yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  {activity.imageUrl && (
                    <div className="aspect-video w-full bg-gray-200 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activity.imageUrl} alt={activity.title} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-semibold text-primary-600 mb-2">
                      {format(new Date(activity.date), "dd MMMM yyyy", { locale: id })}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                      {activity.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

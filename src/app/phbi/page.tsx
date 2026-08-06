import { prisma } from "@/lib/prisma";
import { Calendar, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PhbiGalleryClient from "@/components/PhbiGalleryClient";

export const revalidate = 60;

export default async function PhbiPage() {
  const events = await prisma.phbiEvent.findMany({
    include: {
      media: true,
    },
    orderBy: {
      date: 'desc'
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Galeri PHBI</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi momen berkesan dan dokumentasi visual seputar Peringatan Hari Besar Islam serta berbagai kegiatan keagamaan di Masjid Jami' Ar-Rahman
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Belum Ada Dokumentasi</h3>
            <p className="text-gray-500 mt-2">Data kegiatan PHBI belum ditambahkan oleh Admin.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {events.map((event, index) => (
              <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                
                {/* Event Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{event.title}</h2>
                    <p className="text-gray-600 mt-2">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary-600 bg-primary-50 px-4 py-2 rounded-lg font-medium whitespace-nowrap">
                    <Calendar className="w-5 h-5" />
                    {format(new Date(event.date), "dd MMMM yyyy", { locale: id })}
                  </div>
                </div>

                {/* Media Grid */}
                {event.media.length === 0 ? (
                  <div className="text-gray-400 italic text-sm py-4 bg-gray-100/50 rounded-lg text-center">
                    Tidak ada media (foto/video) untuk acara ini.
                  </div>
                ) : (
                  <PhbiGalleryClient media={event.media} />
                )}
                
                {event.linkMore && (
                  <div className="mt-8 text-center">
                    <a 
                      href={event.linkMore} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium rounded-xl transition-colors border border-primary-200 shadow-sm"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Lihat Foto Lainnya Secara Lengkap Di Sini
                    </a>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

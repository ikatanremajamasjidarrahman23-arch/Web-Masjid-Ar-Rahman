import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, Camera } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export default async function GalleryPublicPage() {
  const galleries = await prisma.gallery.findMany({
    where: {
      category: {
        not: "Selayang Pandang"
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-900 min-h-screen py-16 text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-800/30 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-primary-900/40 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header Title */}
        <div className="text-center animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mb-6 text-primary-400 border border-gray-700 shadow-sm">
            <Camera className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Galeri Kegiatan</h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Momen-momen berharga dari berbagai kegiatan ibadah, sosial, dan perayaan hari besar Islam di Masjid Jami' Ar-Rahman.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {galleries.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm p-16 text-center rounded-3xl border border-gray-700 shadow-lg">
              <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Belum ada foto galeri yang diunggah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleries.map((item) => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-800 shadow-lg border border-gray-700/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ objectPosition: item.imagePosition || 'center' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-5">
                    <span className="text-primary-400 text-xs font-semibold mb-1 uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
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

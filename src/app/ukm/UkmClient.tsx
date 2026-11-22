"use client";

import Link from "next/link";
import { Users, Image as ImageIcon, Music, BookOpen, Sparkles, ChevronRight } from "lucide-react";

type Ukm = {
  id: string;
  namaUkm: string;
  kategori: string;
  deskripsi: string;
  jadwalKegiatan: string | null;
  pembina: string | null;
  linkSelengkapnya: string | null;
  imageUrl: string | null;
  galleryImages: string[];
  createdAt: Date;
};

export default function UkmClient({ initialData }: { initialData: Ukm[] }) {
  if (!initialData || initialData.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-gray-100 max-w-lg mx-auto">
        <Users className="w-14 h-14 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Unit Kegiatan</h3>
        <p className="text-gray-500 text-sm">Data unit kegiatan masjid akan segera diperbarui.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {initialData.map((item) => {
        const isHadroh = item.namaUkm.toLowerCase().includes("hadroh");
        const isMajelis = item.namaUkm.toLowerCase().includes("jumhuriyah") || item.namaUkm.toLowerCase().includes("majelis");
        const totalPhotos = (item.galleryImages?.length || 0) + (item.imageUrl ? 1 : 0);

        return (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Cover Foto */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.namaUkm}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-300">
                    <ImageIcon className="w-16 h-16 opacity-50" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-black/20 to-transparent" />

                {/* Kategori & Tag Total Foto */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-extrabold rounded-full shadow-md">
                    {isHadroh ? <Music className="w-3.5 h-3.5 text-amber-600" /> : isMajelis ? <BookOpen className="w-3.5 h-3.5 text-rose-600" /> : <Sparkles className="w-3.5 h-3.5 text-primary-600" />}
                    {item.kategori}
                  </span>

                  {totalPhotos > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                      <ImageIcon className="w-3 h-3 text-amber-300" />
                      {totalPhotos} Foto
                    </span>
                  )}
                </div>

                {/* Nama UKM */}
                <div className="absolute bottom-4 left-5 right-5 z-10">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {item.namaUkm}
                  </h2>
                </div>
              </div>

              {/* Konten Ringkas */}
              <div className="p-6 sm:p-7 space-y-4">
                {/* Info Ketua / Pembina */}
                {item.pembina && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-primary-50/70 border border-primary-100">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {item.pembina.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-primary-700 uppercase tracking-wider">
                        Ketua Pelaksana / Pembina
                      </p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {item.pembina}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cuplikan Deskripsi */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {item.deskripsi}
                </p>

                {/* Cuplikan Foto Thumbnail */}
                {item.galleryImages && item.galleryImages.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                      <span>Dokumentasi Kegiatan</span>
                      <span className="text-primary-600 font-semibold text-[11px]">
                        {item.galleryImages.length} koleksi
                      </span>
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {item.galleryImages.slice(0, 4).map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-xs"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photoUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Link ke Dedicated Page (BUKAN POPUP!) */}
            <div className="p-6 pt-0">
              <Link
                href={`/ukm/${item.id}`}
                className="w-full py-3.5 px-4 bg-primary-700 hover:bg-primary-800 text-amber-300 font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm active:scale-98"
              >
                <span>Buka Halaman Lengkap &amp; Galeri</span>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { MessageCircle, X, Users, Calendar, MapPin, Image as ImageIcon } from "lucide-react";

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

export default function UkmClient({ initialData, variant = "default" }: { initialData: Ukm[], variant?: "default" | "masonry" }) {
  const [selectedItem, setSelectedItem] = useState<Ukm | null>(null);

  const handleLinkClick = (url: string) => {
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(finalUrl, "_blank");
  };

  if (!initialData || initialData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada data</h3>
        <p className="text-gray-500">Saat ini belum ada data lembaga atau otonom yang dapat ditampilkan.</p>
      </div>
    );
  }

  const getMasonryClass = (index: number) => {
    const cycle = index % 5;
    if (cycle === 0) return "col-span-2 row-span-2 md:col-span-1 md:row-span-2";
    if (cycle === 1) return "col-span-1 row-span-1";
    if (cycle === 2) return "col-span-1 row-span-1";
    if (cycle === 3) return "col-span-2 md:col-span-1 row-span-1";
    if (cycle === 4) return "col-span-2 md:col-span-1 row-span-1";
    return "col-span-1 row-span-1";
  };

  return (
    <>
      {variant === "masonry" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[150px] md:auto-rows-[200px]">
          {initialData.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`relative overflow-hidden rounded-2xl shadow-md group cursor-pointer ${getMasonryClass(index)} bg-primary-50`}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={item.imageUrl} 
                  alt={item.namaUkm} 
                  className="w-full h-full object-cover md:object-contain transform group-hover:scale-105 transition-transform duration-500 md:bg-white"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-200">
                  <ImageIcon className="w-16 h-16 opacity-50" />
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <span className="inline-block px-2 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold rounded mb-2 shadow-sm">
                  {item.kategori}
                </span>
                <h3 className="text-white font-bold text-lg md:text-2xl line-clamp-2 drop-shadow-md">{item.namaUkm}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
              <div className="h-48 relative overflow-hidden bg-primary-50 flex items-center justify-center shrink-0">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={item.imageUrl} 
                    alt={item.namaUkm} 
                    className="w-full h-full object-cover md:object-contain group-hover:scale-105 transition-transform duration-500 md:bg-white"
                  />
                ) : (
                  <div className="text-primary-200">
                    <ImageIcon className="w-16 h-16 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold rounded-full shadow-sm">
                    {item.kategori}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.namaUkm}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{item.deskripsi}</p>
                
                <div className="space-y-2 mb-6 text-sm text-gray-500">
                  {item.pembina && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-500 shrink-0" />
                      <span className="truncate">Pembina: {item.pembina}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold rounded-xl transition-colors mt-auto"
                >
                  Detail & Kontak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 shrink-0 bg-gray-100">
              {selectedItem.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.namaUkm} 
                  className="w-full h-full object-cover md:object-contain md:bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-200">
                  <ImageIcon className="w-20 h-20 opacity-50" />
                </div>
              )}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur text-gray-800 p-2 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-3">
                  {selectedItem.kategori}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedItem.namaUkm}</h2>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap mb-6">
                  {selectedItem.deskripsi}
                </div>

                {selectedItem.pembina && (
                  <div className="mb-8 bg-gray-50 border border-gray-100 p-5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary-500 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Pembina / Ketua</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedItem.pembina}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>



              {selectedItem.linkSelengkapnya ? (
                <button
                  onClick={() => handleLinkClick(selectedItem.linkSelengkapnya!)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm"
                >
                  Klik Selengkapnya
                </button>
              ) : (
                <div className="w-full py-3.5 rounded-xl bg-gray-100 text-center text-gray-500 font-medium border border-dashed border-gray-300">
                  Tautan belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

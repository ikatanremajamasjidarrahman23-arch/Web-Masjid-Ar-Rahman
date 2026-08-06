"use client";

import { useState } from "react";
import { MessageCircle, X, Users, Calendar, MapPin, Image as ImageIcon } from "lucide-react";

type Otonom = {
  id: string;
  namaOrganisasi: string;
  kategori: string;
  deskripsi: string;
  jadwalKegiatan: string | null;
  pembina: string | null;
  kontakWa: string | null;
  imageUrl: string | null;
  createdAt: Date;
};

export default function OtonomClient({ initialData }: { initialData: Otonom[] }) {
  const [selectedItem, setSelectedItem] = useState<Otonom | null>(null);

  const formatWhatsAppNumber = (number: string) => {
    // Remove non-numeric characters
    let cleaned = number.replace(/\D/g, "");
    // Auto-convert 08 to 628
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return cleaned;
  };

  const handleWhatsAppClick = (number: string) => {
    const formatted = formatWhatsAppNumber(number);
    window.open(`https://wa.me/${formatted}`, "_blank");
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialData.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
            <div className="h-48 relative overflow-hidden bg-primary-50 flex items-center justify-center shrink-0">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={item.imageUrl} 
                  alt={item.namaOrganisasi} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.namaOrganisasi}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{item.deskripsi}</p>
              
              <div className="space-y-2 mb-6 text-sm text-gray-500">
                {item.pembina && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-500 shrink-0" />
                    <span className="truncate">Pembina: {item.pembina}</span>
                  </div>
                )}
                {item.jadwalKegiatan && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
                    <span className="truncate">Jadwal: {item.jadwalKegiatan}</span>
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
                  alt={selectedItem.namaOrganisasi} 
                  className="w-full h-full object-cover"
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedItem.namaOrganisasi}</h2>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {selectedItem.deskripsi}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Informasi Kegiatan</h4>
                <div className="space-y-4">
                  {selectedItem.jadwalKegiatan && (
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Jadwal Rutin</p>
                        <p className="text-sm text-gray-600">{selectedItem.jadwalKegiatan}</p>
                      </div>
                    </div>
                  )}
                  {selectedItem.pembina && (
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pembina / Ketua</p>
                        <p className="text-sm text-gray-600">{selectedItem.pembina}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedItem.kontakWa ? (
                <button
                  onClick={() => handleWhatsAppClick(selectedItem.kontakWa!)}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  Hubungi via WhatsApp
                </button>
              ) : (
                <div className="w-full py-3.5 rounded-xl bg-gray-100 text-center text-gray-500 font-medium border border-dashed border-gray-300">
                  Kontak WhatsApp belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Users, Calendar, Image as ImageIcon, Download, 
  X, CheckCircle2, ChevronRight, Music, BookOpen, 
  Sparkles, ExternalLink, ZoomIn, ArrowDown 
} from "lucide-react";

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
  const [selectedItem, setSelectedItem] = useState<Ukm | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  // Auto-buka atau scroll jika URL memiliki hash (#hadroh atau #jumhuriyah)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("hadroh")) {
        const found = initialData.find((u) => u.namaUkm.toLowerCase().includes("hadroh"));
        if (found) setSelectedItem(found);
      } else if (hash.includes("jumhuriyah") || hash.includes("majelis")) {
        const found = initialData.find((u) => u.namaUkm.toLowerCase().includes("jumhuriyah") || u.namaUkm.toLowerCase().includes("majelis"));
        if (found) setSelectedItem(found);
      }
    }
  }, [initialData]);

  // Helper download image terkompresi tanpa merusak kualitas
  const handleDownloadImage = async (url: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingUrl(url);

    try {
      // Optimasi Cloudinary: fl_attachment + q_auto:good untuk kompresi ringan beresolusi tinggi
      let downloadUrl = url;
      if (downloadUrl.includes("res.cloudinary.com") && downloadUrl.includes("/upload/")) {
        downloadUrl = downloadUrl.replace(
          "/upload/",
          "/upload/fl_attachment,q_auto:good,f_auto/"
        );
      }

      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanName = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      link.download = `${cleanName}-${Date.now().toString().slice(-4)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setTimeout(() => setDownloadingUrl(null), 800);
    }
  };

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
    <div className="space-y-12">

      {/* Grid Kartu Utama UKM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {initialData.map((item) => {
          const isHadroh = item.namaUkm.toLowerCase().includes("hadroh");
          const isMajelis = item.namaUkm.toLowerCase().includes("jumhuriyah") || item.namaUkm.toLowerCase().includes("majelis");
          const totalPhotos = (item.galleryImages?.length || 0) + (item.imageUrl ? 1 : 0);

          return (
            <div
              key={item.id}
              id={isHadroh ? "hadroh" : isMajelis ? "jumhuriyah" : item.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Hero Banner / Cover Foto */}
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
                      {isHadroh ? <Music className="w-3.5 h-3.5 text-amber-600" /> : <BookOpen className="w-3.5 h-3.5 text-rose-600" />}
                      {item.kategori}
                    </span>

                    {totalPhotos > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                        <ImageIcon className="w-3 h-3 text-amber-300" />
                        {totalPhotos} Foto
                      </span>
                    )}
                  </div>

                  {/* Nama UKM Overlay */}
                  <div className="absolute bottom-4 left-5 right-5 z-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                      {item.namaUkm}
                    </h2>
                  </div>
                </div>

                {/* Konten & Cuplikan Sejarah */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Info Pembina / Ketua */}
                  {item.pembina && (
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-primary-50/70 border border-primary-100">
                      <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {item.pembina.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-primary-700 uppercase tracking-wider">
                          Ketua / Pembina
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {item.pembina}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Deskripsi Singkat */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {item.deskripsi}
                  </p>

                  {/* Cuplikan Galeri Foto */}
                  {item.galleryImages && item.galleryImages.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                        <span>Dokumentasi Kegiatan</span>
                        <span className="text-primary-600 font-semibold lowercase text-[11px]">
                          bisa diunduh
                        </span>
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {item.galleryImages.slice(0, 4).map((photoUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedItem(item)}
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group/thumb border border-gray-100 shadow-xs"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photoUrl}
                              alt={`Dokumentasi ${item.namaUkm} ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110"
                            />
                            {idx === 3 && item.galleryImages.length > 4 && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs">
                                +{item.galleryImages.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full py-3.5 px-4 bg-primary-700 hover:bg-primary-800 text-amber-300 font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-98"
                >
                  <span>Baca Sejarah &amp; Lihat Galeri Lengkap</span>
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL DETAIL UKM LENGKAP: SEJARAH & GALERI BANYAK ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-full">
                  {selectedItem.kategori}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">•</span>
                <span className="text-xs text-gray-500 hidden sm:inline">Masjid Jami' Ar-Rahman</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
              
              {/* Header Title & Ketua */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                  {selectedItem.namaUkm}
                </h2>

                {selectedItem.pembina && (
                  <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-2xl border border-primary-100 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {selectedItem.pembina.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                        Ketua / Pembina Resmi
                      </p>
                      <p className="text-base font-extrabold text-gray-900">
                        {selectedItem.pembina}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sejarah & Perjalanan Lengkap */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <span>Sejarah &amp; Perjalanan</span>
                </h3>
                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                  {selectedItem.deskripsi}
                </div>
              </div>

              {/* ── KOLEKSI GALERI FOTO BANYAK & BISA DIUNDUH ── */}
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    <span>Galeri Foto &amp; Dokumentasi</span>
                    <span className="text-xs font-semibold text-gray-500">
                      ({(selectedItem.galleryImages?.length || 0) + (selectedItem.imageUrl ? 1 : 0)} Foto)
                    </span>
                  </h3>
                  <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                    Bisa Diunduh Bebas
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  💡 Klik salah satu foto untuk memperbesar atau klik tombol unduh untuk menyimpan foto berkualitas asli dengan ukuran yang sudah dioptimasi.
                </p>

                {/* Grid Galeri UKM */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {/* Foto Utama */}
                  {selectedItem.imageUrl && (
                    <div
                      onClick={() => setActivePhoto(selectedItem.imageUrl)}
                      className="group/photo relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xs border border-gray-100 cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedItem.imageUrl}
                        alt="Foto Utama"
                        className="w-full h-full object-cover transition-transform group-hover/photo:scale-108"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => handleDownloadImage(selectedItem.imageUrl!, `${selectedItem.namaUkm}-cover`, e)}
                          title="Unduh Foto Ini"
                          className="p-2 rounded-xl bg-white text-gray-800 shadow-md hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="p-2 rounded-xl bg-white text-gray-800 shadow-md">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Foto-Foto Galeri Lainnya */}
                  {selectedItem.galleryImages?.map((photoUrl, index) => (
                    <div
                      key={index}
                      onClick={() => setActivePhoto(photoUrl)}
                      className="group/photo relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xs border border-gray-100 cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt={`Dokumentasi ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform group-hover/photo:scale-108"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => handleDownloadImage(photoUrl, `${selectedItem.namaUkm}-${index + 1}`, e)}
                          title="Unduh Foto Ini"
                          className="p-2 rounded-xl bg-white text-gray-800 shadow-md hover:scale-110 active:scale-95 transition-transform"
                        >
                          {downloadingUrl === photoUrl ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                        <div className="p-2 rounded-xl bg-white text-gray-800 shadow-md">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Masjid Jami' Ar-Rahman Cempaka</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX POPUP PERBESAR FOTO UKM ── */}
      {activePhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-60 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhoto}
              alt="Preview Foto"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => handleDownloadImage(activePhoto, `${selectedItem?.namaUkm || "foto-ukm"}-full`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                {downloadingUrl === activePhoto ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mengunduh...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Unduh Foto (Kualitas HD &amp; Terkompresi)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

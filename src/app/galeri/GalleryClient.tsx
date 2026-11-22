"use client";

import { useState } from "react";
import { 
  Camera, Filter, Download, X, ChevronLeft, ChevronRight, 
  Sparkles, Calendar, Eye, ZoomIn, CheckCircle2 
} from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string; // e.g. "PHBI", "Kegiatan Masjid", "Kajian & Edukasi"
  badge: "PHBI" | "Kegiatan Masjid" | string;
  date?: string | null;
  description?: string | null;
  imagePosition?: string;
}

export default function GalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter items
  const filteredItems = initialItems.filter((item) => {
    if (selectedCategory === "Semua") return true;
    if (selectedCategory === "PHBI") {
      return item.badge === "PHBI" || item.category.toUpperCase().includes("PHBI");
    }
    if (selectedCategory === "Kegiatan Masjid") {
      return item.badge === "Kegiatan Masjid" && !item.category.toUpperCase().includes("PHBI");
    }
    return item.category === selectedCategory;
  });

  // Unique categories for pills
  const categories = [
    { id: "Semua", label: "Semua Foto", count: initialItems.length },
    { 
      id: "Kegiatan Masjid", 
      label: "Kegiatan Masjid", 
      count: initialItems.filter(i => i.badge === "Kegiatan Masjid" && !i.category.toUpperCase().includes("PHBI")).length 
    },
    { 
      id: "PHBI", 
      label: "PHBI (Hari Besar Islam)", 
      count: initialItems.filter(i => i.badge === "PHBI" || i.category.toUpperCase().includes("PHBI")).length 
    },
  ];

  // Helper download image (compressed & original quality)
  const handleDownload = async (item: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(item.id);

    try {
      // Jika dari Cloudinary, tambahkan fl_attachment & q_auto untuk kompresi maksimal tanpa merusak kualitas
      let downloadUrl = item.imageUrl;
      if (downloadUrl.includes("res.cloudinary.com") && downloadUrl.includes("/upload/")) {
        downloadUrl = downloadUrl.replace(
          "/upload/",
          "/upload/fl_attachment,q_auto:good,f_auto/"
        );
      }

      // Fetch blob untuk memastikan browser men-download langsung bukan sekadar membuka tab
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanName = (item.title || "foto-galeri-masjid-ar-rahman")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      link.download = `${cleanName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback jika CORS memblokir blob
      window.open(item.imageUrl, "_blank");
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  // Navigasi Lightbox
  const currentIndex = activePhoto ? filteredItems.findIndex((i) => i.id === activePhoto.id) : -1;
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setActivePhoto(filteredItems[currentIndex - 1]);
    } else {
      setActivePhoto(filteredItems[filteredItems.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < filteredItems.length - 1) {
      setActivePhoto(filteredItems[currentIndex + 1]);
    } else {
      setActivePhoto(filteredItems[0]);
    }
  };

  return (
    <div className="space-y-10">

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary-700 text-amber-300 shadow-md shadow-primary-900/20 ring-2 ring-amber-400/40 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 shadow-xs"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-primary-900/60 text-amber-300" : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Galeri */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-gray-100 shadow-xs max-w-md mx-auto">
          <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">Belum Ada Foto</h3>
          <p className="text-gray-500 text-xs">Tidak ditemukan dokumentasi untuk kategori yang dipilih.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isPHBI = item.badge === "PHBI" || item.category.toUpperCase().includes("PHBI");

            return (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ objectPosition: item.imagePosition || "center" }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
                        isPHBI
                          ? "bg-amber-500/90 text-slate-950 border border-amber-300/40"
                          : "bg-emerald-600/90 text-white border border-emerald-400/30"
                      }`}
                    >
                      {isPHBI ? <Sparkles className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                      {item.badge}
                    </span>
                  </div>

                  {/* Quick Action Overlay (Download & Zoom) */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={(e) => handleDownload(item, e)}
                      title="Unduh Foto (Ukuran Pas & Kualitas Tinggi)"
                      className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-800 shadow-md transition-transform hover:scale-110 active:scale-95"
                    >
                      {downloadingId === item.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Download className="w-4 h-4 text-gray-700" />
                      )}
                    </button>
                    <div className="p-2 rounded-xl bg-white/90 text-gray-800 shadow-md">
                      <ZoomIn className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Caption / Title */}
                <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    {item.description && item.description !== "-" && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary-500" />
                      {item.date ? new Date(item.date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "Masjid Ar-Rahman"}
                    </span>
                    <span className="text-primary-600 font-semibold group-hover:underline">
                      Perbesar
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIGHTBOX MODAL FULLSCREEN ── */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-gray-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Foto Utama */}
            <div className="relative flex-1 flex items-center justify-center bg-black min-h-[300px] max-h-[68vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-w-full max-h-[68vh] object-contain"
              />
            </div>

            {/* Info Footer */}
            <div className="p-5 sm:p-6 bg-gray-900 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      activePhoto.badge === "PHBI" || activePhoto.category.toUpperCase().includes("PHBI")
                        ? "bg-amber-400 text-slate-950"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {activePhoto.badge}
                  </span>
                  {activePhoto.date && (
                    <span className="text-xs text-gray-400">
                      {new Date(activePhoto.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  {activePhoto.title}
                </h2>
                {activePhoto.description && activePhoto.description !== "-" && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {activePhoto.description}
                  </p>
                )}
              </div>

              {/* Action: Unduh Foto */}
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleDownload(activePhoto)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {downloadingId === activePhoto.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Berhasil Diunduh!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Unduh Foto (Kualitas Asli)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

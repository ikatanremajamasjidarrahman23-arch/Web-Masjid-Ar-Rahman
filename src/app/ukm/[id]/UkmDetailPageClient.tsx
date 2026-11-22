"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, Calendar, Image as ImageIcon, Download, 
  X, CheckCircle2, ChevronLeft, ChevronRight, Music, 
  BookOpen, Sparkles, ExternalLink, ZoomIn, ArrowLeft, 
  Share2, ShieldCheck 
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

export default function UkmDetailPageClient({ 
  ukm, 
  otherUkms 
}: { 
  ukm: Ukm; 
  otherUkms: Ukm[] 
}) {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Kumpulkan seluruh foto unik
  const allPhotos: string[] = [];
  if (ukm.imageUrl) allPhotos.push(ukm.imageUrl);
  if (ukm.galleryImages && Array.isArray(ukm.galleryImages)) {
    ukm.galleryImages.forEach((p) => {
      if (p && !allPhotos.includes(p)) allPhotos.push(p);
    });
  }

  const isHadroh = ukm.namaUkm.toLowerCase().includes("hadroh");
  const isMajelis = ukm.namaUkm.toLowerCase().includes("jumhuriyah") || ukm.namaUkm.toLowerCase().includes("majelis");

  // Helper download image terkompresi tanpa merusak kualitas
  const handleDownloadImage = async (url: string, suffix: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingUrl(url);

    try {
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
      const cleanName = ukm.namaUkm
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      link.download = `${cleanName}-${suffix}.jpg`;
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

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 sm:pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── BREADCRUMBS ── */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-primary-700 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/ukm" className="hover:text-primary-700 transition-colors">
            Unit Kegiatan (UKM)
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate">{ukm.namaUkm}</span>
        </nav>

        {/* ── HERO BANNER ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-950">
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            {ukm.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ukm.imageUrl}
                alt={ukm.namaUkm}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-400">
                <ImageIcon className="w-20 h-20 opacity-40" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

            {/* Badge Kategori */}
            <div className="absolute top-5 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-extrabold shadow-md">
                {isHadroh ? <Music className="w-4 h-4 text-amber-600" /> : isMajelis ? <BookOpen className="w-4 h-4 text-rose-600" /> : <Sparkles className="w-4 h-4 text-primary-600" />}
                {ukm.kategori}
              </span>
            </div>

            {/* Title & Info Over Banner */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider block mb-1">
                  Badan Otonom Masjid Jami' Ar-Rahman
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {ukm.namaUkm}
                </h1>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-xs font-bold border border-white/20 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "Link Disalin!" : "Bagikan"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── KARTU KETUA / PEMBINA ── */}
        {ukm.pembina && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-emerald-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
                {ukm.pembina.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-0.5">
                  Ketua Pelaksana / Pembina
                </p>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {ukm.pembina}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Penanggung jawab dan pembimbing unit {ukm.namaUkm}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SK Pengurus Resmi DKM</span>
            </div>
          </div>
        )}

        {/* ── SEJARAH & PERJALANAN ── */}
        <div className="bg-white rounded-3xl p-7 sm:p-10 border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <span>Sejarah &amp; Perjalanan</span>
            </h2>
            <span className="text-xs text-gray-400 hidden sm:inline">
              Arsip Resmi Ar-Rahman
            </span>
          </div>

          <div className="prose prose-base max-w-none text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
            {ukm.deskripsi}
          </div>

          {ukm.linkSelengkapnya && (
            <div className="pt-4 border-t border-gray-100">
              <a
                href={ukm.linkSelengkapnya.startsWith("http") ? ukm.linkSelengkapnya : `https://${ukm.linkSelengkapnya}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>Kunjungi Tautan Eksternal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* ── GALERI FOTO BANYAK & BISA DIUNDUH ── */}
        <div className="bg-white rounded-3xl p-7 sm:p-10 border border-gray-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
                <ImageIcon className="w-6 h-6 text-amber-600" />
                <span>Galeri Foto &amp; Dokumentasi</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Koleksi foto kegiatan {ukm.namaUkm}. Tersedia fitur download berkualitas tinggi dan ukuran terkompresi.
              </p>
            </div>
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold self-start sm:self-auto">
              {allPhotos.length} Foto Tersedia
            </span>
          </div>

          {allPhotos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum ada foto dokumentasi yang diunggah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allPhotos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhoto(photoUrl)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={`Dokumentasi ${ukm.namaUkm} ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />

                  {/* Overlay Action Buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handleDownloadImage(photoUrl, `foto-${idx + 1}`, e)}
                      title="Unduh Foto Ini (Ukuran Pas & Berkualitas)"
                      className="p-2.5 rounded-xl bg-white text-gray-900 shadow-md hover:scale-110 active:scale-95 transition-transform"
                    >
                      {downloadingUrl === photoUrl ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <div className="p-2.5 rounded-xl bg-white text-gray-900 shadow-md">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── UKM LAINNYA ── */}
        {otherUkms.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-extrabold text-gray-900">
              Unit Kegiatan &amp; Lembaga Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherUkms.map((other) => (
                <Link
                  key={other.id}
                  href={`/ukm/${other.id}`}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {other.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={other.imageUrl}
                        alt={other.namaUkm}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
                      {other.kategori}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary-700 transition-colors truncate mt-1">
                      {other.namaUkm}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      {other.pembina ? `Ketua: ${other.pembina}` : "Unit Masjid Ar-Rahman"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── BACK BUTTON ── */}
        <div className="pt-4 flex justify-center">
          <Link
            href="/ukm"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Seluruh Unit Kegiatan</span>
          </Link>
        </div>

      </div>

      {/* ── LIGHTBOX MODAL FULLSCREEN ── */}
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
                onClick={() => handleDownloadImage(activePhoto, "preview-full")}
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


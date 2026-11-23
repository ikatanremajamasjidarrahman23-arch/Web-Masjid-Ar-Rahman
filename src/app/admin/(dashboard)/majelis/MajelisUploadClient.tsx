"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { 
  Camera, UploadCloud, Trash2, ExternalLink, CheckCircle2, 
  X, AlertCircle, Sparkles, Image as ImageIcon, ZoomIn, 
  RefreshCw, Heart, BookOpen
} from "lucide-react";
import { compressImage } from "@/utils/imageCompression";

interface MajelisUploadClientProps {
  initialPhotos: string[];
  majelisId: string;
  majelisName: string;
}

export default function MajelisUploadClient({
  initialPhotos = [],
  majelisId,
  majelisName,
}: MajelisUploadClientProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activityTitle, setActivityTitle] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lightbox preview untuk foto yang sudah tayang
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Saat ibu-ibu memilih foto dari HP / komputer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // Batalkan satu foto yang baru dipilih
  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Bersihkan semua foto yang dipilih
  const handleClearSelected = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Unggah foto ke Cloudinary lalu simpan ke database
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setErrorMessage("Silakan pilih minimal 1 foto kegiatan terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    const uploadedUrls: string[] = [];

    try {
      // Unggah setiap foto satu per satu dengan kompresi otomatis
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress({ current: i + 1, total: selectedFiles.length });

        // 1. Kompres foto agar hemat kuota & cepat terkirim
        const compressed = await compressImage(file, 1.2);

        // 2. Kirim ke API upload Cloudinary
        const formData = new FormData();
        formData.append("file", compressed);

        const uploadRes = await axios.post("/api/upload", formData);
        if (uploadRes.data?.url) {
          uploadedUrls.push(uploadRes.data.url);
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error("Gagal mengunggah foto ke server. Silakan coba lagi.");
      }

      // 3. Simpan daftar URL foto ke sistem Majelis Ta'lim & Galeri
      const saveRes = await axios.post("/api/admin/majelis", {
        images: uploadedUrls,
        title: activityTitle.trim() || `Kegiatan ${majelisName}`,
      });

      if (saveRes.data?.photos) {
        setPhotos(saveRes.data.photos);
      } else {
        // Fallback update state lokal
        setPhotos((prev) => [...uploadedUrls, ...prev]);
      }

      setSuccessMessage(`Alhamdulillah! ${uploadedUrls.length} foto kegiatan berhasil diunggah ke website.`);
      handleClearSelected();
      setActivityTitle("");
    } catch (err: any) {
      console.error("Upload error:", err);
      const msg = err.response?.data?.error || err.message || "Terjadi kendala saat mengunggah foto.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Hapus foto kegiatan yang sudah pernah diunggah
  const handleDeletePhoto = async (photoUrl: string) => {
    const isConfirm = window.confirm(
      "Apakah Ibu yakin ingin menghapus foto kegiatan ini dari website?"
    );
    if (!isConfirm) return;

    try {
      const res = await axios.delete(`/api/admin/majelis?imageUrl=${encodeURIComponent(photoUrl)}`);
      if (res.data?.photos) {
        setPhotos(res.data.photos);
      } else {
        setPhotos((prev) => prev.filter((p) => p !== photoUrl));
      }
      setSuccessMessage("Foto kegiatan berhasil dihapus.");
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menghapus foto. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Kartu Sambutan Hangat untuk Ibu-Ibu */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-300" />
              <span>Portal Dokumentasi Ibu-Ibu Majelis Ta'lim</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Assalamu'alaikum, Ibu Pengurus! 🌸
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              Halaman ini dirancang khusus agar sangat mudah digunakan. Cukup pilih foto kegiatan dari HP atau komputer, lalu tekan tombol simpan. Foto akan otomatis tayang di halaman website <b>{majelisName}</b>.
            </p>
          </div>

          <a
            href={`/ukm/${majelisId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <span>Lihat Halaman di Web</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Notifikasi Pesan Sukses / Error */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium">
            <p>{successMessage}</p>
          </div>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-emerald-600 hover:text-emerald-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium flex-1">
            <p>{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Formulir Upload Foto Sederhana */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Langkah 1: Pilih Foto Kegiatan
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Ibu bisa memilih 1 foto atau langsung banyak foto sekaligus dari galeri HP atau kamera.
              </p>
            </div>
          </div>
        </div>

        {/* Input File Tersembunyi */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="majelis-photo-input"
          disabled={isUploading}
        />

        {/* Tombol Besar untuk Memilih Foto */}
        <label
          htmlFor="majelis-photo-input"
          className={`group flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-3xl transition-all cursor-pointer text-center ${
            isUploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
              : "border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500"
          }`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            Sentuh di Sini untuk Memilih Foto
          </span>
          <span className="text-xs sm:text-sm text-emerald-700 font-medium max-w-md">
            Bisa ambil langsung dari Kamera HP atau pilih foto yang ada di Galeri HP / Komputer
          </span>
        </label>

        {/* Pratinjau Foto yang Baru Dipilih */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                Foto yang Dipilih: <span className="text-emerald-700 font-extrabold">{selectedFiles.length} Foto</span>
              </span>
              <button
                type="button"
                onClick={handleClearSelected}
                disabled={isUploading}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer disabled:opacity-50"
              >
                Batal Semua
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previewUrls.map((url, index) => (
                <div 
                  key={index} 
                  className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-square bg-gray-100 shadow-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(index)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                      title="Batalkan foto ini"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="absolute bottom-1 left-2 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded-md font-mono">
                    Foto #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Langkah 2: Catatan / Judul Acara (Opsional) */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Langkah 2: Nama Acara / Kegiatan <span className="text-xs font-normal text-gray-500">(Boleh dikosongkan)</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Contoh: <em>Kajian Rutin Selasa Pagi</em> atau <em>Peringatan Maulid Nabi</em>.
              </p>
            </div>
          </div>

          <input
            type="text"
            value={activityTitle}
            onChange={(e) => setActivityTitle(e.target.value)}
            placeholder="Ketik nama acara di sini (misal: Pengajian Rutin Ibu-Ibu)..."
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 bg-gray-50/50 outline-none transition-all"
          />
        </div>

        {/* Langkah 3: Tombol Simpan / Unggah */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Langkah 3: Simpan ke Website
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Klik tombol di bawah dan tunggu sampai proses selesai.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all shadow-lg ${
              isUploading || selectedFiles.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30 active:scale-99 cursor-pointer"
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>
                  Sedang Mengunggah Foto ({uploadProgress?.current} dari {uploadProgress?.total})... Mohon Tunggu
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6" />
                <span>
                  Unggah &amp; Simpan {selectedFiles.length > 0 ? `${selectedFiles.length} Foto` : "Foto"} ke Website
                </span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Bagian Koleksi Foto yang Sudah Pernah Diunggah */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Foto Kegiatan yang Sudah Tayang di Web
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Total saat ini ada <b>{photos.length} foto</b> kegiatan Majelis Ta'lim.
              </p>
            </div>
          </div>

          <a
            href={`/ukm/${majelisId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>Buka Halaman Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-gray-50 border border-gray-100">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold text-sm">Belum ada foto kegiatan.</p>
            <p className="text-gray-400 text-xs mt-1">
              Gunakan formulir di atas untuk mulai mengunggah foto pertama!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photoUrl, index) => (
              <div
                key={photoUrl + index}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 aspect-square bg-gray-100 shadow-xs hover:shadow-md transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt={`Kegiatan Majelis ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay Aksi */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <button
                    type="button"
                    onClick={() => setZoomPhoto(photoUrl)}
                    className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-800 transition-colors shadow-sm cursor-pointer"
                    title="Perbesar Foto"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photoUrl)}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm cursor-pointer"
                    title="Hapus foto ini dari website"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute top-2 left-2 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded-md font-mono">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Lightbox untuk Melihat Foto Ukuran Penuh */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] bg-transparent flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomPhoto}
              alt="Foto Penuh"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

    </div>
  );
}

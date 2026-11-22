"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, ExternalLink, FolderOpen, UploadCloud, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";

type Gallery = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  imagePosition?: string;
  linkGdrive?: string | null;
  createdAt: string | Date;
};

export default function GalleryDashboardClient({ initialGalleries }: { initialGalleries: Gallery[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan Masjid");
  const [imagePosition, setImagePosition] = useState("center");
  const [linkGdrive, setLinkGdrive] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return alert("Pilih minimal 1 foto!");

    setLoading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const uploadedItems = [];

      for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        setUploadProgress({ current: i + 1, total: files.length });

        const compressedFile = await compressImage(currentFile);
        const fileData = new FormData();
        fileData.append("file", compressedFile);
        
        const uploadRes = await axios.post("/api/upload", fileData);
        if (!uploadRes.data.success) {
          throw new Error(`Gagal upload foto ke-${i + 1}`);
        }

        const secureUrl = uploadRes.data.data.secure_url;
        uploadedItems.push({
          title: title.trim() || "Dokumentasi Kegiatan",
          category,
          imageUrl: secureUrl,
          imagePosition,
          linkGdrive: linkGdrive.trim() || null,
        });
      }

      // Kirim seluruh item sekaligus ke API
      await axios.post("/api/admin/gallery", {
        items: uploadedItems,
      });

      setIsModalOpen(false);
      setTitle("");
      setCategory("Kegiatan Masjid");
      setImagePosition("center");
      setLinkGdrive("");
      setFiles([]);
      setUploadProgress(null);
      router.refresh();

    } catch (error: any) {
      alert("Gagal menambahkan foto galeri: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto galeri ini?")) return;
    try {
      await axios.delete(`/api/admin/gallery?id=${id}`);
      router.refresh();
    } catch {
      alert("Gagal menghapus foto.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Galeri &amp; PHBI</h1>
          <p className="text-sm text-gray-500">
            Kelola dokumentasi foto kegiatan masjid dan perayaan PHBI. Mendukung upload banyak foto sekaligus dan tautan Google Drive.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto (Sekaligus)</span>
        </button>
      </div>

      {/* Grid Galeri List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialGalleries.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col group">
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                style={{ objectPosition: item.imagePosition || "center" }}
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-bold text-white">
                {item.category}
              </div>

              {item.linkGdrive && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center gap-1 shadow">
                  <FolderOpen className="w-3 h-3" /> GDrive
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h3>
                {item.linkGdrive && (
                  <a
                    href={item.linkGdrive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-1 truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.linkGdrive}</span>
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Upload Sekaligus */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-gray-100 relative">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Upload Foto Galeri (Bisa Banyak Sekaligus)</h2>
            <p className="text-xs text-gray-500 mb-5">
              Pilih satu atau beberapa foto untuk diunggah bersamaan ke dalam sistem.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* File Input Multiple */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pilih Foto (Bisa Pilih Banyak Foto Sekaligus) *
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-2xl p-5 text-center transition-colors cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(Array.from(e.target.files));
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
                  />
                  {files.length > 0 && (
                    <p className="mt-2 text-xs font-bold text-primary-700">
                      ✓ {files.length} foto terpilih untuk diunggah
                    </p>
                  )}
                </div>
              </div>

              {/* Judul Kegiatan */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Judul Acara / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Cth: Pawai Obor 1447 H / Sholat Idul Fitri"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tanda / Kategori *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="Kegiatan Masjid">Kegiatan Masjid</option>
                  <option value="PHBI">PHBI (Peringatan Hari Besar Islam)</option>
                  <option value="Kajian & Edukasi">Kajian &amp; Edukasi</option>
                  <option value="Ibadah">Ibadah</option>
                  <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Link Google Drive */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Link Google Drive (Opsional — Untuk "Lihat Foto Selengkapnya")
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={linkGdrive}
                    onChange={(e) => setLinkGdrive(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none pr-8"
                  />
                  <FolderOpen className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Jika diisi, pada foto ini akan disematkan tombol langsung ke folder Google Drive.
                </p>
              </div>

              {/* Posisi Potongan Foto */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Fokus Potongan Foto *
                </label>
                <select
                  required
                  value={imagePosition}
                  onChange={(e) => setImagePosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="center">Tengah (Rekomendasi)</option>
                  <option value="top">Atas (Fokus Wajah)</option>
                  <option value="bottom">Bawah</option>
                </select>
              </div>

              {/* Progress Indicator */}
              {loading && uploadProgress && (
                <div className="bg-primary-50 p-3.5 rounded-xl border border-primary-200 text-xs text-primary-800 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>
                    Mengompres &amp; mengunggah foto ke-{uploadProgress.current} dari {uploadProgress.total}...
                  </span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Sedang Mengunggah...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Unggah {files.length > 1 ? `(${files.length} Foto)` : "Foto"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

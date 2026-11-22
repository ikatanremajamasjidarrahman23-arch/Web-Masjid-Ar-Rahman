"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, GripVertical, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";

type HeroImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
  isActive: boolean;
};

export default function HeroImageClient({ initialImages }: { initialImages: HeroImage[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih foto terlebih dahulu!");
    if (file.size > 4 * 1024 * 1024) return alert("Ukuran foto maksimal 4MB.");
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed);
      const uploadRes = await axios.post("/api/upload", form);
      if (!uploadRes.data.success) throw new Error("Gagal upload");
      const imageUrl = uploadRes.data.data.secure_url;
      await axios.post("/api/admin/hero", { imageUrl, caption });
      setIsModalOpen(false);
      setCaption("");
      setFile(null);
      setPreview(null);
      router.refresh();
    } catch (err: any) {
      alert("Gagal: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto hero ini?")) return;
    try {
      await axios.delete(`/api/admin/hero?id=${id}`);
      router.refresh();
    } catch {
      alert("Gagal menghapus.");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await axios.put("/api/admin/hero", { id, isActive: !isActive });
      router.refresh();
    } catch {
      alert("Gagal mengubah status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Foto Hero Beranda</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola foto slideshow di bagian utama (hero) halaman beranda.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Foto Hero
        </button>
      </div>

      {/* Info panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>💡 Tips:</strong> Upload 3–5 foto terbaik masjid dengan orientasi <strong>landscape (horizontal)</strong> dan resolusi minimal 1200×600 px agar tampil optimal. Foto akan berganti otomatis di halaman beranda.
      </div>

      {/* Grid */}
      {initialImages.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada foto hero</p>
          <p className="text-gray-400 text-sm mt-1">Klik "Tambah Foto Hero" untuk mulai</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialImages.map((img, idx) => (
            <div
              key={img.id}
              className={`group relative rounded-2xl overflow-hidden border-2 shadow-sm transition-all ${
                img.isActive ? "border-primary-200" : "border-gray-200 opacity-60"
              }`}
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.caption || `Hero ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${img.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {img.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    {img.caption && (
                      <p className="text-sm text-gray-600 truncate">{img.caption}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(img.id, img.isActive)}
                      title={img.isActive ? "Nonaktifkan" : "Aktifkan"}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
                      {img.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      title="Hapus"
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !loading && setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Tambah Foto Hero</h3>
              <p className="text-sm text-gray-500 mt-1">Upload foto untuk tampil di slideshow beranda</p>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {/* Preview */}
              <div
                className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => document.getElementById("hero-file-input")?.click()}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-sm font-medium">Klik untuk pilih foto</span>
                    <span className="text-xs">Landscape, maks. 4MB</span>
                  </div>
                )}
                <input
                  id="hero-file-input"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Keterangan Foto <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: Suasana Sholat Jumat Masjid Ar-Rahman"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setPreview(null); setFile(null); setCaption(""); }}
                  disabled={loading}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {loading ? "Mengupload..." : "Simpan Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


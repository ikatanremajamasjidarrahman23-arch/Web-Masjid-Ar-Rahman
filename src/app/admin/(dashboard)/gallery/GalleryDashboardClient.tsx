"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";

type Gallery = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  imagePosition?: string;
};

export default function GalleryDashboardClient({ initialGalleries }: { initialGalleries: Gallery[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Ibadah");
  const [imagePosition, setImagePosition] = useState("center");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih foto terlebih dahulu!");
    
    // Validasi ukuran maksimal 4MB (Vercel limit)
    if (file.size > 4 * 1024 * 1024) {
      return alert("❌ Ukuran foto terlalu besar (Maksimal 4MB). Silakan perkecil ukuran foto Anda terlebih dahulu.");
    }

    setLoading(true);

    try {
      const compressedFile = await compressImage(file);
      const fileData = new FormData();
      fileData.append("file", compressedFile);
      const uploadRes = await axios.post("/api/upload", fileData);
      
      if (!uploadRes.data.success) throw new Error("Gagal upload gambar");
      
      const imageUrl = uploadRes.data.data.secure_url;

      await axios.post("/api/admin/gallery", { title, category, imageUrl, imagePosition });
      
      setIsModalOpen(false);
      setTitle("");
      setCategory("Ibadah");
      setImagePosition("center");
      setFile(null);
      router.refresh();
      
    } catch (error: any) {
      alert("Gagal menambahkan foto galeri: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto galeri ini?")) return;
    try {
      await axios.delete(`/api/admin/gallery?id=${id}`);
      router.refresh();
    } catch (error) {
      alert("Gagal menghapus foto.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Galeri Foto</h2>
          <p className="text-gray-600">Unggah dan kelola foto kegiatan masjid.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Unggah Foto
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
        {initialGalleries.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center rounded-xl border border-gray-200">
            <p className="text-gray-500">Belum ada foto galeri yang diunggah.</p>
          </div>
        ) : (
          initialGalleries.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group">
              <div className="relative aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ objectPosition: item.imagePosition || 'center' }} />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-semibold text-white">
                  {item.category}
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-gray-900 mb-4 line-clamp-2">{item.title}</h3>
                
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="w-full py-1.5 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-xs mt-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Unggah Foto Galeri</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Foto *</label>
                <input 
                  type="file" accept="image/*" required
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul / Keterangan *</label>
                <input 
                  type="text" required 
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Cth: Sholat Idul Fitri 1445 H"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select
                  required
                  value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="Ibadah">Ibadah</option>
                  <option value="PHBI">PHBI (Peringatan Hari Besar)</option>
                  <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                  <option value="Kajian & Edukasi">Kajian & Edukasi</option>
                  <option value="Selayang Pandang">Selayang Pandang (Halaman Utama)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fokus Potongan Foto *</label>
                <select
                  required
                  value={imagePosition} onChange={e => setImagePosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="center">Tengah (Default)</option>
                  <option value="top">Atas (Fokus Wajah/Kepala)</option>
                  <option value="bottom">Bawah</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" disabled={loading}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                  {loading ? "Mengunggah..." : "Simpan Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

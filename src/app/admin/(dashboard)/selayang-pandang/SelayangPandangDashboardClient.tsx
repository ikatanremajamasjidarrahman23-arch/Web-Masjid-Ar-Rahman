"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, Save, Check } from "lucide-react";
import axios from "axios";
import { saveSelayangPandangSettings } from "@/app/actions/selayangPandang";

type Gallery = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

type Settings = {
  selayangPandangTitle: string | null;
  selayangPandangDescription: string | null;
};

export default function SelayangPandangDashboardClient({ 
  initialSettings, 
  initialGalleries 
}: { 
  initialSettings: Settings | null,
  initialGalleries: Gallery[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSavingText, setIsSavingText] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const handleSaveText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingText(true);
    const formData = new FormData(e.currentTarget);
    try {
      await saveSelayangPandangSettings(formData);
      alert("Teks Selayang Pandang berhasil diperbarui!");
      router.refresh();
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan teks.");
    } finally {
      setIsSavingText(false);
    }
  };

  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih foto terlebih dahulu!");
    
    // Validasi ukuran maksimal 4MB (Vercel limit)
    if (file.size > 4 * 1024 * 1024) {
      return alert("❌ Ukuran foto terlalu besar (Maksimal 4MB). Silakan perkecil ukuran foto Anda terlebih dahulu.");
    }

    setLoading(true);

    try {
      const fileData = new FormData();
      fileData.append("file", file);
      const uploadRes = await axios.post("/api/upload", fileData);
      
      if (!uploadRes.data.success) throw new Error("Gagal upload gambar");
      
      const imageUrl = uploadRes.data.data.secure_url;

      await axios.post("/api/admin/gallery", { 
        title, 
        category: "Selayang Pandang", 
        imageUrl 
      });
      
      setIsModalOpen(false);
      setTitle("");
      setFile(null);
      router.refresh();
      
    } catch (error: any) {
      alert("Gagal menambahkan foto galeri: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Hapus foto selayang pandang ini?")) return;
    try {
      await axios.delete(`/api/admin/gallery?id=${id}`);
      router.refresh();
    } catch (error) {
      alert("Gagal menghapus foto.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kelola Selayang Pandang</h2>
        <p className="text-gray-600">Atur teks deskripsi dan foto-foto yang akan tampil di bagian depan (Beranda) website.</p>
      </div>

      {/* Teks Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <StickyNoteIcon className="w-5 h-5 text-primary-500" /> Pengaturan Teks
        </h3>
        <form onSubmit={handleSaveText} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Seksi</label>
              <input 
                type="text"
                name="selayangPandangTitle"
                defaultValue={initialSettings?.selayangPandangTitle || "Selayang Pandang"}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Contoh: Selayang Pandang"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat</label>
              <textarea 
                name="selayangPandangDescription"
                rows={3}
                defaultValue={initialSettings?.selayangPandangDescription || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Deskripsi singkat yang tampil di bawah judul..."
                required
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingText}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {isSavingText ? "Menyimpan..." : <><Save className="w-4 h-4"/> Simpan Teks</>}
            </button>
          </div>
        </form>
      </div>

      {/* Foto Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary-500" /> Galeri Foto
          </h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Unggah Foto
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {initialGalleries.length === 0 ? (
            <div className="col-span-full bg-gray-50 p-8 text-center rounded-xl border border-gray-200 border-dashed">
              <p className="text-gray-500">Belum ada foto galeri yang diunggah.</p>
            </div>
          ) : (
            initialGalleries.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group">
                <div className="relative aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-gray-900 mb-4 line-clamp-2">{item.title}</h3>
                  
                  <button 
                    onClick={() => handleDeletePhoto(item.id)}
                    className="w-full py-1.5 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-xs mt-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Unggah Foto Selayang Pandang</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreatePhoto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Foto *</label>
                <input 
                  type="file" accept="image/*" required
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Foto *</label>
                <input 
                  type="text" required 
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Cth: Suasana Masjid..."
                />
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

// Simple icon for the text section
function StickyNoteIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
      <path d="M15 3v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

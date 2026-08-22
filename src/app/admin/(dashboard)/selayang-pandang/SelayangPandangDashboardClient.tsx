"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, Save, Check } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";
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
  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter();

  const handleOpenModal = (id?: string, defaultTitle?: string) => {
    if (id) {
      setEditId(id);
      setTitle(defaultTitle || "");
    } else {
      setEditId(null);
      setTitle("");
    }
    setFile(null);
    setIsModalOpen(true);
  };

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
    
    // For new uploads, file is required. For edits, it is optional.
    if (!editId && !file) return alert("Pilih foto terlebih dahulu!");
    
    // Validate file size if file exists
    if (file && file.size > 4 * 1024 * 1024) {
      return alert("❌ Ukuran foto terlalu besar (Maksimal 4MB). Silakan perkecil ukuran foto Anda terlebih dahulu.");
    }

    setLoading(true);

    try {
      let imageUrl = "";
      
      // Upload file if selected
      if (file) {
        const compressedFile = await compressImage(file);
        const fileData = new FormData();
        fileData.append("file", compressedFile);
        const uploadRes = await axios.post("/api/upload", fileData);
        
        if (!uploadRes.data.success) throw new Error("Gagal upload gambar");
        imageUrl = uploadRes.data.data.secure_url;
      }

      if (editId) {
        await axios.put("/api/admin/gallery", { 
          id: editId,
          ...(title && { title }), 
          ...(imageUrl && { imageUrl }),
        });
      } else {
        if (!imageUrl) throw new Error("Gagal mendapatkan URL gambar.");
        await axios.post("/api/admin/gallery", { 
          title, 
          category: "Selayang Pandang", 
          imageUrl 
        });
      }
      
      setIsModalOpen(false);
      setTitle("");
      setFile(null);
      setEditId(null);
      router.refresh();
      
    } catch (error: any) {
      alert("Gagal memproses foto galeri: " + (error.response?.data?.error || error.message));
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
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary-500" /> Galeri Foto
            </h3>
            <p className="text-sm text-gray-500 mt-1">Terdapat 5 slot foto yang akan tampil pada layout utama. Atur sesuai keinginan Anda agar tepat sasaran.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[150px] md:auto-rows-[200px] animate-fade-in bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
          {[
            { label: "Foto Utama (Kiri)", className: "col-span-2 row-span-2 md:col-span-1 md:row-span-2" },
            { label: "Tengah Atas", className: "col-span-1 row-span-1" },
            { label: "Tengah Bawah", className: "col-span-1 row-span-1" },
            { label: "Kanan Atas", className: "col-span-2 md:col-span-1 row-span-1" },
            { label: "Kanan Bawah", className: "col-span-2 md:col-span-1 row-span-1" }
          ].map((slot, index) => {
            const item = initialGalleries[index];
            return (
              <div 
                key={index} 
                className={`relative bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group ${slot.className}`}
              >
                {item ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Overlay Action */}
                    <div className="absolute inset-0 bg-black/50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3 z-20">
                      <p className="text-white font-semibold text-sm text-center bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm shadow-sm">{slot.label}</p>
                      <div className="flex gap-2 w-full max-w-[200px]">
                        <button 
                          onClick={() => handleOpenModal(item.id, item.title)} 
                          className="flex-1 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          Ubah
                        </button>
                        <button 
                          onClick={() => handleDeletePhoto(item.id)} 
                          className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                    
                    {/* Position Label - Shown when not hovering */}
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none group-hover:opacity-0 transition-opacity z-10 font-medium">
                      {index + 1}. {slot.label}
                    </div>
                  </>
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full w-full">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm mb-4">{index + 1}. {slot.label}</p>
                    <button 
                      onClick={() => handleOpenModal()} 
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4"/> Isi Slot Ini
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editId ? "Ganti Foto (Kosongkan jika hanya ingin ubah judul)" : "Pilih Foto *"}
                </label>
                <input 
                  type="file" accept="image/*" required={!editId}
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

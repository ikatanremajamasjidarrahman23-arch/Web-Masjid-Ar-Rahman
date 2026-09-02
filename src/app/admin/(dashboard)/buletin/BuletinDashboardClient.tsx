"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Megaphone, Plus, Trash2, ImagePlus, Check, X, Calendar as CalendarIcon, Clock, ToggleLeft, ToggleRight, Bell } from "lucide-react";

type Bulletin = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  imagePosition?: string;
};

export default function BuletinDashboardClient() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    expiryDate: "",
    imagePosition: "center",
  });

  const fetchBulletins = async () => {
    try {
      const res = await axios.get("/api/admin/buletin");
      setBulletins(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data buletin", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBulletins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("isBanner", "true");

        const uploadRes = await axios.post("/api/upload", uploadData);
        if (uploadRes.data?.success) {
          finalImageUrl = uploadRes.data.data.secure_url;
        } else {
          throw new Error("Gagal upload gambar");
        }
      }

      await axios.post("/api/admin/buletin", { ...formData, imageUrl: finalImageUrl });
      
      setFormData({ title: "", description: "", imageUrl: "", expiryDate: "", imagePosition: "center" });
      setSelectedFile(null);
      setImagePreview(null);
      setShowForm(false);
      fetchBulletins();
    } catch (error) {
      console.error("Gagal menyimpan buletin", error);
      alert("Terjadi kesalahan saat menyimpan buletin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buletin ini?")) return;
    try {
      await axios.delete(`/api/admin/buletin?id=${id}`);
      fetchBulletins();
    } catch (error) {
      console.error("Gagal menghapus", error);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await axios.put(`/api/admin/buletin?id=${id}`, { toggleActive: true });
      fetchBulletins();
    } catch (error) {
      console.error("Gagal mengubah status", error);
    }
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    try {
      const res = await axios.post("/api/admin/test-push");
      alert("✅ " + res.data.message);
    } catch (error: any) {
      alert("❌ Gagal mengirim notifikasi tes: " + (error.response?.data?.error || error.message));
    } finally {
      setIsTestingPush(false);
    }
  };

  const isExpired = (expiryStr: string) => {
    return new Date(expiryStr) < new Date();
  };

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-gray-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-gray-200 rounded col-span-2"></div><div className="h-2 bg-gray-200 rounded col-span-1"></div></div><div className="h-2 bg-gray-200 rounded"></div></div></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Papan Buletin</h2>
          <p className="text-gray-600 mt-1">Kelola berita atau informasi penting untuk ditampilkan di halaman depan.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTestPush}
            disabled={isTestingPush}
            className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-200 transition-all font-medium disabled:opacity-70"
          >
            <Bell size={18} />
            {isTestingPush ? "Mengirim..." : "Cek Notifikasi"}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all font-medium"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Batal" : "Buat Buletin Baru"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buletin *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="Contoh: Pendaftaran Hewan Qurban 1446H Dibuka"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Informasi *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="Tuliskan isi pengumuman secara detail di sini..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gambar (Opsional)</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2 relative rounded-xl overflow-hidden h-32 border border-gray-200 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" style={{ objectPosition: formData.imagePosition }} />
                      <button 
                        type="button" 
                        onClick={() => { setSelectedFile(null); setImagePreview(null); }} 
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                        title="Hapus gambar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu Berakhir *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fokus Potongan Foto *</label>
                <select
                  required
                  value={formData.imagePosition} onChange={e => setFormData({ ...formData, imagePosition: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                >
                  <option value="center">Tengah (Default)</option>
                  <option value="top">Atas (Fokus Wajah/Kepala)</option>
                  <option value="bottom">Bawah</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-all font-medium disabled:opacity-70"
              >
                {isSubmitting ? "Menyimpan..." : (
                  <>
                    <Check size={18} /> Simpan & Umumkan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bulletins.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
            Belum ada data buletin. Klik tombol "Buat Buletin Baru" untuk menambahkan.
          </div>
        ) : (
          bulletins.map((bulletin) => {
            const expired = isExpired(bulletin.expiryDate);
            return (
              <div key={bulletin.id} className={`bg-white rounded-2xl shadow-sm border ${bulletin.isActive && !expired ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-200 opacity-75'} overflow-hidden flex flex-col transition-all hover:shadow-md`}>
                {bulletin.imageUrl && (
                  <div className="h-40 w-full relative overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bulletin.imageUrl} alt={bulletin.title} className="w-full h-full object-cover" style={{ objectPosition: bulletin.imagePosition || 'center' }} />
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-gray-900 line-clamp-2">{bulletin.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {expired ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg">Berakhir</span>
                      ) : bulletin.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">Aktif</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">Nonaktif</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{bulletin.description}</p>
                  
                  <div className="pt-4 border-t border-gray-100 space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} className="text-gray-400" />
                      Dibuat: {format(new Date(bulletin.createdAt), "dd MMM yyyy", { locale: id })}
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-medium ${expired ? 'text-red-500' : 'text-orange-500'}`}>
                      <CalendarIcon size={14} />
                      Berakhir: {format(new Date(bulletin.expiryDate), "dd MMM yyyy, HH:mm", { locale: id })}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => handleToggle(bulletin.id)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title={bulletin.isActive ? "Nonaktifkan" : "Aktifkan"}
                    >
                      {bulletin.isActive ? <ToggleRight size={20} className="text-primary-600" /> : <ToggleLeft size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(bulletin.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}

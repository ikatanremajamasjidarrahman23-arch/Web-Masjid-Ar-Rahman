"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Image as ImageIcon, BookOpen, Clock, User, MapPin } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";

type Schedule = {
  id: string;
  title: string;
  speaker: string;
  schedule: string;
  location: string;
  description: string | null;
  imageUrl: string | null;
};

export default function KajianDashboardClient({ initialSchedules }: { initialSchedules: Schedule[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    schedule: "",
    location: "Ruang Utama Masjid",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", speaker: "", schedule: "", location: "Ruang Utama Masjid", description: "" });
    setFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setFormData({
      title: schedule.title,
      speaker: schedule.speaker,
      schedule: schedule.schedule,
      location: schedule.location,
      description: schedule.description || "",
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      if (file) {
        const compressedFile = await compressImage(file);
        const fileData = new FormData();
        fileData.append("file", compressedFile);
        const uploadRes = await axios.post("/api/upload", fileData);
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.data.secure_url;
        }
      }

      if (editingId) {
        await axios.put("/api/admin/kajian", { ...formData, id: editingId, imageUrl });
      } else {
        await axios.post("/api/admin/kajian", { ...formData, imageUrl });
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        title: "", speaker: "", schedule: "", location: "Ruang Utama Masjid", description: ""
      });
      setFile(null);
      router.refresh();
      
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Gagal menambahkan jadwal kajian.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jadwal kajian ini?")) return;
    try {
      await axios.delete(`/api/admin/kajian?id=${id}`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || error.message || "Gagal menghapus jadwal kajian.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Jadwal Kajian</h2>
          <p className="text-gray-600">Manajemen jadwal kajian rutin masjid.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {initialSchedules.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center rounded-xl border border-gray-200">
            <p className="text-gray-500">Belum ada jadwal kajian yang ditambahkan.</p>
          </div>
        ) : (
          initialSchedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {schedule.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={schedule.imageUrl} alt={schedule.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                  <BookOpen className="w-10 h-10" />
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded border border-primary-100">
                    <Clock className="w-3 h-3 inline mr-1"/> {schedule.schedule}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2">{schedule.title}</h3>
                
                <div className="space-y-1 mb-4 flex-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400"/> {schedule.speaker}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400"/> {schedule.location}
                  </p>
                </div>
                
                
                <div className="flex items-center gap-2 mt-auto">
                  <button 
                    onClick={() => openEditModal(schedule)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(schedule.id)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-fade-in shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit Jadwal Kajian" : "Tambah Jadwal Kajian"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kajian *</label>
                <input 
                  type="text" name="title" required 
                  value={formData.title} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Cth: Kajian Tafsir Jalalain"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pemateri / Ustadz *</label>
                <input 
                  type="text" name="speaker" required 
                  value={formData.speaker} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Cth: Ustadz Dr. Fulan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu / Jadwal *</label>
                  <input 
                    type="text" name="schedule" required 
                    value={formData.schedule} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Cth: Setiap Ahad, 05:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi *</label>
                  <input 
                    type="text" name="location" required 
                    value={formData.location} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tambahan</label>
                <textarea 
                  name="description" rows={3}
                  value={formData.description} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Materi yang dibahas, dsb."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster / Gambar (Opsional)</label>
                <input 
                  type="file" accept="image/*"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
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
                  {loading ? "Menyimpan..." : "Simpan Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, Users, Newspaper, Phone } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Activity = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  date: Date;
};

type Member = {
  id: string;
  name: string;
  phone: string;
  address: string;
  reason: string | null;
  createdAt: Date;
};

export default function IrmasDashboardClient({ 
  initialActivities, 
  initialMembers 
}: { 
  initialActivities: Activity[];
  initialMembers: Member[];
}) {
  const [activeTab, setActiveTab] = useState<"kegiatan" | "pendaftar">("kegiatan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // Upload gambar jika ada
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post("/api/upload", formData);
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.data.secure_url;
        }
      }

      // Simpan kegiatan
      await axios.post("/api/admin/irmas", { title, content, imageUrl });
      
      // Reset & Refresh
      setIsModalOpen(false);
      setTitle("");
      setContent("");
      setFile(null);
      router.refresh();
      
    } catch (error) {
      alert("Gagal menambahkan kegiatan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) return;
    try {
      await axios.delete(`/api/admin/irmas?id=${id}`);
      router.refresh();
    } catch (error) {
      alert("Gagal menghapus kegiatan.");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Hapus data pendaftar ini?")) return;
    try {
      await axios.delete(`/api/admin/irmas/member?id=${id}`);
      router.refresh();
    } catch (error) {
      alert("Gagal menghapus pendaftar.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Kelola IRMAS</h2>
        <p className="text-gray-600">Manajemen kegiatan dan anggota Ikatan Remaja Masjid.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("kegiatan")}
          className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "kegiatan" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Newspaper className="w-5 h-5" /> Kegiatan / Berita
        </button>
        <button
          onClick={() => setActiveTab("pendaftar")}
          className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "pendaftar" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Users className="w-5 h-5" /> Pendaftar Anggota Baru
          {initialMembers.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">{initialMembers.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content: Kegiatan */}
      {activeTab === "kegiatan" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-600 font-medium">Total: {initialActivities.length} Kegiatan</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Kegiatan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {activity.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activity.imageUrl} alt={activity.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-primary-600 mb-2">
                    {format(new Date(activity.date), "dd MMMM yyyy", { locale: id })}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{activity.content}</p>
                  
                  <button 
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Pendaftar */}
      {activeTab === "pendaftar" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Nama</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Kontak & Alamat</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Alasan / Motivasi</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Tanggal Daftar</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-sm text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {initialMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Belum ada pendaftar baru.
                    </td>
                  </tr>
                ) : (
                  initialMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-primary-600 font-medium mb-1">
                          <Phone className="w-4 h-4" /> {member.phone}
                        </div>
                        <div className="text-sm text-gray-600">{member.address}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{member.reason || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(member.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Kegiatan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-fade-in shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Tambah Kegiatan IRMAS</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan</label>
                <input 
                  type="text" required 
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Contoh: Kerja Bakti Rutin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Konten</label>
                <textarea 
                  required rows={4}
                  value={content} onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Ceritakan detail kegiatan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Kegiatan (Opsional)</label>
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
                  {loading ? "Menyimpan..." : "Simpan Kegiatan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

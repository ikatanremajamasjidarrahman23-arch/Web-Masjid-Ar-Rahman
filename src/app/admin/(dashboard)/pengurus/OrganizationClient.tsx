"use client";

import { useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Save, X, Loader2 } from "lucide-react";

type Member = {
  id: string;
  name: string;
  position: string;
  parentId: string | null;
  order: number;
};

export default function OrganizationClient({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Member>>({
    name: "",
    position: "",
    parentId: "",
    order: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (formData.id) {
        // Edit
        const res = await axios.put(`/api/admin/pengurus/${formData.id}`, formData);
        setMembers(members.map(m => m.id === formData.id ? res.data : m));
      } else {
        // Add
        const res = await axios.post("/api/admin/pengurus", formData);
        setMembers([...members, res.data].sort((a, b) => a.order - b.order));
      }
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      alert(`Terjadi kesalahan: ${errorMessage}\nPastikan database sudah diupdate (prisma db push).`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengurus ini?")) return;
    try {
      await axios.delete(`/api/admin/pengurus/${id}`);
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  const editMember = (member: Member) => {
    setFormData({
      id: member.id,
      name: member.name,
      position: member.position,
      parentId: member.parentId || "",
      order: member.order
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: "", position: "", parentId: "", order: 0 });
    setIsEditing(false);
  };

  // Helper to get parent name
  const getParentName = (parentId: string | null) => {
    if (!parentId) return "- (Tertinggi)";
    return members.find(m => m.id === parentId)?.name || "Unknown";
  };

  return (
    <div className="space-y-8">
      {/* Form Tambah / Edit */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          {isEditing ? <Edit2 className="w-5 h-5 text-primary-500" /> : <Plus className="w-5 h-5 text-primary-500" />}
          {isEditing ? "Edit Pengurus" : "Tambah Pengurus Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required 
                value={formData.name || ""} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                placeholder="Contoh: H. Ahmad Fulan"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jabatan</label>
              <input 
                type="text" 
                required 
                value={formData.position || ""} 
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                placeholder="Contoh: Ketua DKM"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Atasan (Melapor Kepada)</label>
              <select 
                value={formData.parentId || ""} 
                onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none appearance-none"
              >
                <option value="">Tidak ada (Jabatan Tertinggi)</option>
                {members.filter(m => m.id !== formData.id).map(m => (
                  <option key={m.id} value={m.id}>{m.position} - {m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan Tampil (Opsional)</label>
              <input 
                type="number" 
                value={formData.order === undefined || isNaN(formData.order) ? "" : formData.order} 
                onChange={(e) => setFormData({...formData, order: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                <X className="w-4 h-4" /> Batal
              </button>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
              {isEditing ? "Simpan Perubahan" : "Tambahkan Pengurus"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Pengurus */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Daftar Pengurus</h2>
          <p className="text-sm text-gray-500 mt-1">Struktur organisasi yang akan ditampilkan di halaman jemaah.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Jabatan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Atasan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Urutan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada data pengurus</p>
                      <p className="text-sm text-gray-400 mt-1">Silakan tambahkan pengurus melalui form di atas.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-primary-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                        {member.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm flex items-center gap-2">
                        {!member.parentId ? (
                          <span className="text-gray-400 italic">Tertinggi</span>
                        ) : (
                          getParentName(member.parentId)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-medium">{member.order}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => editMember(member)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

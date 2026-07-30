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
    } catch (error) {
      alert("Terjadi kesalahan");
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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{isEditing ? "Edit Pengurus" : "Tambah Pengurus Baru"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                required 
                value={formData.name || ""} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Contoh: H. Ahmad Fulan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <input 
                type="text" 
                required 
                value={formData.position || ""} 
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Contoh: Ketua DKM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atasan (Melapor Kepada)</label>
              <select 
                value={formData.parentId || ""} 
                onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="">Tidak ada (Jabatan Tertinggi)</option>
                {members.filter(m => m.id !== formData.id).map(m => (
                  <option key={m.id} value={m.id}>{m.position} - {m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil (Order)</label>
              <input 
                type="number" 
                value={formData.order || 0} 
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Batal
              </button>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
              {isEditing ? "Simpan Perubahan" : "Tambahkan"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Pengurus */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Nama</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Jabatan</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Atasan</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-24">Urutan</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data pengurus
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 text-gray-700">{member.position}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">{getParentName(member.parentId)}</td>
                    <td className="px-6 py-4 text-gray-700">{member.order}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => editMember(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StickyNote, Plus, Trash2, Edit, X } from "lucide-react";

type AdminNote = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export default function NotepadClient() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const fetchNotes = async () => {
    try {
      const res = await axios.get("/api/admin/notes");
      setNotes(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil catatan admin", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/api/admin/notes?id=${editingId}`, formData);
      } else {
        await axios.post("/api/admin/notes", formData);
      }
      setFormData({ title: "", content: "" });
      setShowForm(false);
      setEditingId(null);
      fetchNotes();
    } catch (error) {
      console.error("Gagal menyimpan catatan", error);
      alert("Terjadi kesalahan saat menyimpan catatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;
    try {
      await axios.delete(`/api/admin/notes?id=${noteId}`);
      fetchNotes();
    } catch (error) {
      console.error("Gagal menghapus catatan", error);
      alert("Terjadi kesalahan saat menghapus catatan.");
    }
  };

  const handleEdit = (note: AdminNote) => {
    setFormData({
      title: note.title,
      content: note.content,
    });
    setEditingId(note.id);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Memuat catatan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-3 rounded-xl text-primary-600">
            <StickyNote className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Catatan Admin</h1>
            <p className="text-gray-500 text-sm">Catatan internal khusus untuk pengelola (tidak terlihat oleh publik)</p>
          </div>
        </div>
        <button
          onClick={() => {
            setFormData({ title: "", content: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Buat Catatan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Catatan" : "Buat Catatan Baru"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Catatan</label>
                <input
                  type="text"
                  required
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-3"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Rapat DKM Bulan Depan"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Isi Catatan</label>
                <textarea
                  required
                  rows={8}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-3 resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tulis detail catatan Anda di sini..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-3 px-6 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Catatan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
            <StickyNote className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Belum ada catatan</h3>
            <p className="text-gray-500 mt-2">Mulai buat catatan pertama Anda dengan menekan tombol "Buat Catatan" di atas.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group relative">
              <div className="p-5 flex-grow">
                <h3 className="font-bold text-gray-800 text-lg mb-3 leading-tight">{note.title}</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
              </div>
              <div className="bg-[#FEF9C3] px-5 py-3 border-t border-[#FEF08A] flex justify-between items-center mt-auto">
                <span className="text-xs text-gray-600 font-medium">
                  {format(new Date(note.updatedAt), "d MMM yyyy, HH:mm", { locale: id })}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

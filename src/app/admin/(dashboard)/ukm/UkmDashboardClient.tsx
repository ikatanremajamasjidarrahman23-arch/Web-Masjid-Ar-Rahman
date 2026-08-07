"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, X, ImagePlus, Check, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ImageCropper from "@/components/admin/ImageCropper";

type Ukm = {
  id: string;
  namaUkm: string;
  kategori: string;
  deskripsi: string;
  jadwalKegiatan: string | null;
  pembina: string | null;
  linkSelengkapnya: string | null;
  imageUrl: string | null;
  galleryImages: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function UkmDashboardClient() {
  const [data, setData] = useState<Ukm[]>([]);
  const [filteredData, setFilteredData] = useState<Ukm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Cropper States
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<'logo' | 'gallery'>('logo');

  const [formData, setFormData] = useState({
    namaUkm: "",
    kategori: "",
    deskripsi: "",
    jadwalKegiatan: "",
    pembina: "",
    linkSelengkapnya: "",
    imageUrl: "",
    galleryImages: [] as string[],
  });
  const [file, setFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/ukm");
      setData(res.data.data);
      
      // Extract unique categories
      const uniqueCats = Array.from(new Set(res.data.data.map((item: Ukm) => item.kategori))) as string[];
      setCategories(uniqueCats);
    } catch (error) {
      console.error("Gagal mengambil data UKM", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter(item => 
        item.namaUkm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter) {
      result = result.filter(item => item.kategori === categoryFilter);
    }
    setFilteredData(result);
  }, [data, searchQuery, categoryFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'gallery') => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (target === 'logo') {
        // Logo/banner is uploaded fully without cropping
        setFile(selectedFile);
        setFormData({ ...formData, imageUrl: URL.createObjectURL(selectedFile) });
      } else {
        // Gallery images get cropped
        const imageUrl = URL.createObjectURL(selectedFile);
        setImageToCrop(imageUrl);
        setCropTarget(target);
        setCropperOpen(true);
        e.target.value = '';
      }
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    if (cropTarget === 'gallery') {
      setGalleryFiles([...galleryFiles, croppedFile]);
    }
    setCropperOpen(false);
    setImageToCrop(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;

      // Upload image if file is selected
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await axios.post("/api/upload", uploadData);
        if (uploadRes.data.success) {
          finalImageUrl = uploadRes.data.data.secure_url;
        }
      }

      // Upload gallery files if any
      let finalGalleryImages = [...formData.galleryImages];
      if (galleryFiles.length > 0) {
        for (const gFile of galleryFiles) {
          const uploadData = new FormData();
          uploadData.append("file", gFile);
          const uploadRes = await axios.post("/api/upload", uploadData);
          if (uploadRes.data.success) {
            finalGalleryImages.push(uploadRes.data.data.secure_url);
          }
        }
      }
      
      // Limit to 4 images
      if (finalGalleryImages.length > 4) {
        finalGalleryImages = finalGalleryImages.slice(finalGalleryImages.length - 4);
      }

      const payload = { ...formData, imageUrl: finalImageUrl, galleryImages: finalGalleryImages };

      if (editingId) {
        await axios.put(`/api/admin/ukm?id=${editingId}`, payload);
      } else {
        await axios.post("/api/admin/ukm", payload);
      }
      
      setFormData({
        namaUkm: "", kategori: "", deskripsi: "", jadwalKegiatan: "", pembina: "", linkSelengkapnya: "", imageUrl: "", galleryImages: []
      });
      setFile(null);
      setGalleryFiles([]);
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan data", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`/api/admin/ukm?id=${id}`);
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus data", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await axios.put(`/api/admin/ukm?id=${id}`, { toggleActive: true });
      fetchData();
    } catch (error) {
      console.error("Gagal mengubah status data", error);
    }
  };

  const handleEdit = (item: Ukm) => {
    setFormData({
      namaUkm: item.namaUkm,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      jadwalKegiatan: item.jadwalKegiatan || "",
      pembina: item.pembina || "",
      linkSelengkapnya: item.linkSelengkapnya || "",
      imageUrl: item.imageUrl || "",
      galleryImages: item.galleryImages || [],
    });
    setEditingId(item.id);
    setFile(null);
    setGalleryFiles([]);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Unit Kegiatan Masjid (UKM)</h1>
          <p className="text-gray-500 text-sm">Kelola daftar unit kegiatan, majelis, dan organisasi di bawah naungan masjid.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ namaUkm: "", kategori: "", deskripsi: "", jadwalKegiatan: "", pembina: "", linkSelengkapnya: "", imageUrl: "", galleryImages: [] });
            setEditingId(null);
            setFile(null);
            setGalleryFiles([]);
            setShowForm(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          Tambah UKM
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama UKM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit UKM" : "Tambah UKM Baru"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama UKM *</label>
                  <input
                    type="text"
                    required
                    value={formData.namaUkm}
                    onChange={(e) => setFormData({ ...formData, namaUkm: e.target.value })}
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5"
                    placeholder="Contoh: Majelis Ta'lim Ar-Rahman"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                  <input
                    type="text"
                    required
                    list="kategori-list"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5"
                    placeholder="Contoh: Kajian & Dakwah"
                  />
                  <datalist id="kategori-list">
                    <option value="Kajian & Dakwah" />
                    <option value="Seni & Budaya Islam" />
                    <option value="Pendidikan" />
                    <option value="Sosial & Kemanusiaan" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-3 resize-none"
                  placeholder="Penjelasan singkat tentang organisasi ini..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pembina/Ketua</label>
                  <input
                    type="text"
                    value={formData.pembina}
                    onChange={(e) => setFormData({ ...formData, pembina: e.target.value })}
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5"
                    placeholder="Contoh: Ust. Ahmad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tautan Selengkapnya / GDrive</label>
                  <input
                    type="url"
                    value={formData.linkSelengkapnya}
                    onChange={(e) => setFormData({ ...formData, linkSelengkapnya: e.target.value })}
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5"
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">URL folder Google Drive atau website eksternal</p>
                </div>
              </div>



              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo/Banner/Foto (Opsional)</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'logo')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-400">ATAU</span>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5"
                      placeholder="Tempel URL gambar..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Bagian Dalam (Galeri UKM)</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'gallery')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                  />
                  {(formData.galleryImages.length > 0 || galleryFiles.length > 0) && (
                    <div className="flex flex-wrap gap-3">
                      {formData.galleryImages.map((url, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => {
                            const newUrls = [...formData.galleryImages];
                            newUrls.splice(idx, 1);
                            setFormData({...formData, galleryImages: newUrls});
                          }} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {galleryFiles.map((gf, idx) => (
                        <div key={`file-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(gf)} alt={`New Gallery ${idx}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => {
                            const newFiles = [...galleryFiles];
                            newFiles.splice(idx, 1);
                            setGalleryFiles(newFiles);
                          }} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 sticky bottom-0 bg-white z-10 pb-2">
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
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? "Menyimpan..." : <><Check className="w-5 h-5"/> Simpan Data</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal (Only for Gallery now) */}
      {cropperOpen && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropperOpen(false);
            setImageToCrop(null);
          }}
          aspect={3 / 2}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="py-4 px-6 font-semibold">Nama UKM</th>
                <th className="py-4 px-6 font-semibold">Kategori</th>
                <th className="py-4 px-6 font-semibold">Pembina</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.namaUkm} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                            <ImagePlus className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.namaUkm}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {item.pembina || "-"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggle(item.id)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          item.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

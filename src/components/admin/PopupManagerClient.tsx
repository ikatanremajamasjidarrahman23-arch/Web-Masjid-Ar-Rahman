"use client";

import { useState } from "react";
import { savePopupSettings } from "@/app/actions/popup";
import { Save, Upload, Loader2, Image as ImageIcon, Power, Clock } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";

export default function PopupManagerClient({ settings }: { settings: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupImagePreview, setPopupImagePreview] = useState<string | null>(settings?.popupImage || null);
  const [isActive, setIsActive] = useState<boolean>(settings?.popupIsActive || false);

  const handleUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file, 0.5); // 0.5MB untuk kompresi, namun tetap menjaga resolusi
      const formData = new FormData();
      formData.append("file", compressedFile);
      const res = await axios.post("/api/upload", formData);
      setPopupImagePreview(res.data.data.secure_url);
    } catch (error) {
      alert("Gagal mengunggah banner.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    if (popupImagePreview) {
      formData.append("popupImage", popupImagePreview);
    }
    formData.append("popupIsActive", isActive.toString());

    try {
      await savePopupSettings(formData);
      alert("Pengaturan popup berhasil disimpan.");
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan pengaturan popup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Toggle Status */}
      <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-2xl">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Power className="w-5 h-5" /> Status Popup
          </h3>
          <p className="text-sm text-gray-600 mt-1">Aktifkan untuk menampilkan banner popup di halaman beranda Jemaah saat situs pertama kali dibuka.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
          <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Banner Upload */}
        <div className="w-full md:w-1/2 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">Banner Ucapan / Pengumuman</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
            {popupImagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={popupImagePreview} alt="Popup Preview" className="max-h-64 w-auto object-contain mb-4 rounded-xl shadow-sm" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-medium transition-colors mt-2">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {popupImagePreview ? "Ganti Banner" : "Unggah Banner"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadBanner} disabled={isUploading} />
            </label>
            <p className="text-xs text-gray-500 mt-2">Gunakan rasio gambar landscape atau persegi (cth: poster ukuran IG).</p>
          </div>
        </div>

        {/* Settings Options */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Durasi Penayangan (Detik)
            </label>
            <p className="text-xs text-gray-500 mb-3">Tentukan berapa detik banner akan muncul sebelum tertutup secara otomatis. Pengunjung juga tetap bisa menutup banner secara manual melalui tombol (X).</p>
            <input 
              type="number"
              name="popupDuration"
              min="1"
              max="60"
              defaultValue={settings?.popupDuration || 10}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Contoh: 10"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan Pengaturan Popup
        </button>
      </div>

    </form>
  );
}

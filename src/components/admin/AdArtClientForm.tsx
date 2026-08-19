"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/settings";
import { Save, Upload, Loader2, FileText, File } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";

export default function AdArtClientForm({ settings }: { settings: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(settings?.adArtFileUrl || null);
  const [content, setContent] = useState<string>(settings?.adArtContent || "");

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressedFile);
      const res = await axios.post("/api/upload", formData);
      setFilePreview(res.data.data.secure_url);
    } catch (error) {
      alert("Gagal mengunggah file AD/ART.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    
    // We only want to update adArt specific fields without overwriting everything else.
    // However, saveSettings in this codebase overwrites missing fields with null if they aren't provided.
    // To safely use saveSettings, we must append ALL existing settings to formData.
    if (settings) {
      Object.keys(settings).forEach(key => {
        if (settings[key] !== null && settings[key] !== undefined) {
          formData.append(key, settings[key].toString());
        }
      });
    }

    // Now overwrite with AD/ART specific updates
    formData.set("adArtContent", content);
    if (filePreview) {
      formData.set("adArtFileUrl", filePreview);
    } else {
      formData.delete("adArtFileUrl"); // Will be null in action
    }

    try {
      await saveSettings(formData);
      alert("Pengaturan AD/ART berhasil disimpan.");
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan pengaturan AD/ART.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-500" />
        Pengaturan AD/ART Kepengurusan
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Kelola dokumen Anggaran Dasar / Anggaran Rumah Tangga (AD/ART) Masjid. Dokumen ini akan bisa diakses jemaah melalui popup di halaman Profil.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Unggah File (PDF/Gambar)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors h-[280px]">
              {filePreview ? (
                <div className="flex flex-col items-center">
                  <File className="w-12 h-12 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-700 max-w-full truncate px-4 mb-4">File terlampir (PDF/Gambar)</p>
                  <a href={filePreview} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline mb-4">Lihat File</a>
                  <button type="button" onClick={() => setFilePreview(null)} className="text-red-500 text-xs hover:underline mb-4">Hapus Lampiran</button>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {filePreview ? "Ganti File" : "Pilih File"}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleUploadFile} disabled={isUploading} />
              </label>
              <p className="text-xs text-gray-500 mt-2">Maks. 5MB. Format PDF atau Gambar (JPG/PNG).</p>
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <label className="block text-sm font-semibold text-gray-700">Teks AD/ART (Manual)</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none min-h-[250px]"
              placeholder="Atau ketik langsung isi AD/ART di sini secara manual..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Anda bisa mengisi salah satu (file saja, atau teks saja) ataupun keduanya.</p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Simpan AD/ART
          </button>
        </div>
      </form>
    </div>
  );
}

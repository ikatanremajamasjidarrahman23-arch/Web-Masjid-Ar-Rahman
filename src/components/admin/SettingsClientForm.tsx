"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/settings";
import { Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import axios from "axios";

export default function SettingsClientForm({ settings }: { settings: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logoUrl || null);

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData);
      setLogoPreview(res.data.data.secure_url);
    } catch (error) {
      alert("Gagal mengunggah logo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    if (logoPreview) {
      formData.append("logoUrl", logoPreview);
    }

    try {
      await saveSettings(formData);
      alert("Pengaturan berhasil disimpan.");
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Masjid (Opsional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Logo Preview" className="h-32 w-auto object-contain mb-4 rounded" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-medium transition-colors">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {logoPreview ? "Ubah Logo" : "Unggah Logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} disabled={isUploading} />
            </label>
            <p className="text-xs text-gray-500 mt-2">Format PNG disarankan dengan latar belakang transparan.</p>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Visi Masjid</label>
            <textarea 
              name="visi"
              rows={3}
              defaultValue={settings?.visi || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Masukkan teks visi masjid..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Misi Masjid</label>
            <textarea 
              name="misi"
              rows={6}
              defaultValue={settings?.misi || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Masukkan teks misi masjid..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Tekan 'Enter' untuk membuat poin baru.</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sejarah Masjid</label>
        <textarea 
          name="sejarah"
          rows={8}
          defaultValue={settings?.sejarah || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Ceritakan sejarah berdirinya masjid..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar QRIS Donasi</label>
        <input 
          type="url"
          name="qrisImage"
          defaultValue={settings?.qrisImage || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="https://..."
        />
        <p className="text-xs text-gray-500 mt-1">Tempelkan link gambar QRIS di sini.</p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Pengumuman (Running Text)</label>
        <textarea 
          name="runningText"
          rows={2}
          defaultValue={settings?.runningText || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Masukkan teks pengumuman berjalan..."
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">Teks ini akan muncul berjalan (marquee) di bagian paling atas website.</p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Footer & Kontak</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat Masjid</label>
            <textarea 
              name="deskripsiSingkat"
              rows={2}
              defaultValue={settings?.deskripsiSingkat || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Deskripsi singkat yang tampil di bawah logo pada footer..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
            <textarea 
              name="alamat"
              rows={2}
              defaultValue={settings?.alamat || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Alamat lengkap masjid..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon / WA</label>
              <input 
                type="text"
                name="telepon"
                defaultValue={settings?.telepon || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+62 812-..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                name="email"
                defaultValue={settings?.email || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="info@masjid.com"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}

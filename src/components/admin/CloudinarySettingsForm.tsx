"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/settings";
import { Save, Loader2, Key, Cloud, Lock, ShieldAlert } from "lucide-react";

export default function CloudinarySettingsForm({ settings }: { settings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form values
  const [cloudName, setCloudName] = useState(settings?.cloudinaryCloudName || "");
  const [apiKey, setApiKey] = useState(settings?.cloudinaryApiKey || "");
  const [apiSecret, setApiSecret] = useState(settings?.cloudinaryApiSecret || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("cloudinaryCloudName", cloudName);
    formData.append("cloudinaryApiKey", apiKey);
    formData.append("cloudinaryApiSecret", apiSecret);
    
    try {
      await saveSettings(formData);
      alert("Pengaturan Cloudinary API berhasil disimpan.");
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan pengaturan Cloudinary.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-blue-800">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
        <div className="text-sm">
          <p className="font-bold text-blue-900 mb-1">Informasi Keamanan Integrasi</p>
          <p>Kredensial API ini akan digunakan untuk mengunggah seluruh gambar media di website. Pastikan <b>API Key</b> dan <b>API Secret</b> Anda tidak diketahui publik.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cloud Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Cloud className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Contoh: dhxyz..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white"
              placeholder="Contoh: 1234567890..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Dibiarkan tersamarkan untuk alasan keamanan.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">API Secret</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white"
              placeholder="Contoh: aBcDeF..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Dibiarkan tersamarkan untuk alasan keamanan.</p>
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan API Key
        </button>
      </div>
    </form>
  );
}

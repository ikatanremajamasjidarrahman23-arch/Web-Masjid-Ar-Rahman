"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/settings";
import { Save, Loader2, Key } from "lucide-react";

export default function CloudinarySettingsForm({ settings }: { settings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // Add dummy values for required non-cloudinary fields just to pass validation if needed, 
    // or let saveSettings handle partial updates (which Prisma update handles natively if we don't overwrite).
    // Let's assume saveSettings action accepts partial updates by just reading what's in formData.
    
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-gray-500" />
        <p className="text-sm text-gray-600">Pengaturan ini digunakan untuk menyimpan seluruh gambar. Kosongkan untuk menggunakan kunci dari .env bawaan.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cloud Name</label>
        <input 
          type="text"
          name="cloudinaryCloudName"
          defaultValue={settings?.cloudinaryCloudName || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Contoh: dhxyz..."
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
        <input 
          type="text"
          name="cloudinaryApiKey"
          defaultValue={settings?.cloudinaryApiKey || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Contoh: 1234567890..."
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">API Secret</label>
        <input 
          type="password"
          name="cloudinaryApiSecret"
          defaultValue={settings?.cloudinaryApiSecret || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Contoh: aBcDeF..."
        />
      </div>

      <div className="pt-4">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan API Key
        </button>
      </div>
    </form>
  );
}

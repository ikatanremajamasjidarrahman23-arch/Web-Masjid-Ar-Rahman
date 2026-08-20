"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/settings";
import { Save, Upload, Loader2, Image as ImageIcon, Check } from "lucide-react";
import axios from "axios";
import { fontOptions } from "@/lib/fonts";
import { themeOptions, themes, ThemeColor } from "@/lib/themes";
import { compressImage } from "@/utils/imageCompression";

export default function SettingsClientForm({ settings }: { settings: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingIrmas, setIsUploadingIrmas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logoUrl || null);
  const [irmasLogoPreview, setIrmasLogoPreview] = useState<string | null>(settings?.irmasLogoUrl || null);

  const [isDesignSubmitting, setIsDesignSubmitting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>(settings?.themeColor || "emerald");

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressedFile);
      const res = await axios.post("/api/upload", formData);
      setLogoPreview(res.data.data.secure_url);
    } catch (error) {
      alert("Gagal mengunggah logo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadIrmasLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingIrmas(true);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressedFile);
      const res = await axios.post("/api/upload", formData);
      setIrmasLogoPreview(res.data.data.secure_url);
    } catch (error) {
      alert("Gagal mengunggah logo IRMAS.");
    } finally {
      setIsUploadingIrmas(false);
    }
  };

  const handleDesignSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDesignSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("themeColor", selectedTheme);
    
    // Add missing fields from settings to avoid overwriting with null
    if (settings) {
      if (settings.visi) formData.append("visi", settings.visi);
      if (settings.misi) formData.append("misi", settings.misi);
      if (settings.sejarah) formData.append("sejarah", settings.sejarah);
      if (settings.logoUrl) formData.append("logoUrl", settings.logoUrl);
      if (settings.alamat) formData.append("alamat", settings.alamat);
      if (settings.telepon) formData.append("telepon", settings.telepon);
      if (settings.email) formData.append("email", settings.email);
      if (settings.selayangPandangTitle) formData.append("selayangPandangTitle", settings.selayangPandangTitle);
      if (settings.selayangPandangDescription) formData.append("selayangPandangDescription", settings.selayangPandangDescription);
      if (settings.ukmTitle) formData.append("ukmTitle", settings.ukmTitle);
      if (settings.ukmDescription) formData.append("ukmDescription", settings.ukmDescription);
      if (settings.runningTextSpeed) formData.append("runningTextSpeed", settings.runningTextSpeed.toString());
      if (settings.irmasLogoUrl) formData.append("irmasLogoUrl", settings.irmasLogoUrl);
      if (settings.logoSizeNavbar) formData.append("logoSizeNavbar", settings.logoSizeNavbar.toString());
      if (settings.logoSizeProfil) formData.append("logoSizeProfil", settings.logoSizeProfil.toString());
      if (settings.logoSizeIrmas) formData.append("logoSizeIrmas", settings.logoSizeIrmas.toString());
    }

    try {
      await saveSettings(formData);
      alert("Pengaturan desain (Font & Warna) berhasil diubah!");
      window.location.reload(); // Hard refresh to ensure layout picks up the new design!
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan pengaturan desain.");
    } finally {
      setIsDesignSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    if (logoPreview) {
      formData.append("logoUrl", logoPreview);
    }
    
    if (irmasLogoPreview) {
      formData.append("irmasLogoUrl", irmasLogoPreview);
    }
    
    // Also include the design settings in the general form submit so they don't get overwritten
    formData.append("fontFamily", settings?.fontFamily || "inter");
    formData.append("themeColor", selectedTheme);

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
    <div className="space-y-12">
      <form onSubmit={handleDesignSubmit} className="space-y-8 pb-8 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Tampilan & Desain</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pilihan Font Website</label>
              <select 
                name="fontFamily"
                defaultValue={settings?.fontFamily || "inter"}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Pilih gaya font utama untuk seluruh teks website.</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tema Warna Utama</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {themeOptions.map(theme => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => setSelectedTheme(theme.value)}
                    title={theme.label}
                    className={`relative w-full aspect-square rounded-xl border-2 transition-all overflow-hidden ${
                      selectedTheme === theme.value ? "border-gray-900 scale-105 shadow-md" : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: themes[theme.value as ThemeColor]?.["--color-primary-500"] }}
                  >
                    {selectedTheme === theme.value && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Pilih warna dominan yang paling sesuai (Saat ini: {themeOptions.find(t => t.value === selectedTheme)?.label}).</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={isDesignSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              {isDesignSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Simpan Tampilan
            </button>
          </div>
        </div>
      </form>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="pb-8 border-b border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Logo & Ukuran</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Logo Masjid Utama (Navbar & Profil)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors h-[220px]">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Logo Preview" className="h-20 w-auto object-contain mb-4 rounded" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Tinggi di Navbar (px)</label>
                  <input type="number" name="logoSizeNavbar" defaultValue={settings?.logoSizeNavbar || 48} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Tinggi di Profil (px)</label>
                  <input type="number" name="logoSizeProfil" defaultValue={settings?.logoSizeProfil || 80} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Logo Remaja Masjid (IRMAS)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors h-[220px]">
                {irmasLogoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={irmasLogoPreview} alt="Logo IRMAS Preview" className="h-20 w-auto object-contain mb-4 rounded" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-medium transition-colors">
                  {isUploadingIrmas ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {irmasLogoPreview ? "Ubah Logo" : "Unggah Logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadIrmasLogo} disabled={isUploadingIrmas} />
                </label>
                <p className="text-xs text-gray-500 mt-2">Format PNG disarankan dengan latar belakang transparan.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Tinggi di IRMAS (px)</label>
                  <input type="number" name="logoSizeIrmas" defaultValue={settings?.logoSizeIrmas || 80} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-start">
          <div className="w-full space-y-6">
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
        <p className="text-xs text-gray-500 mt-1 mb-4">Teks ini akan muncul berjalan (marquee) di bagian paling atas website.</p>
        
        <label className="block text-sm font-semibold text-gray-700 mb-2">Kecepatan Teks Berjalan (Detik)</label>
        <input 
          type="number"
          name="runningTextSpeed"
          min="5"
          max="100"
          defaultValue={settings?.runningTextSpeed || 25}
          className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">Normal = 25 detik. Semakin kecil angkanya, semakin cepat bergeraknya.</p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Teks Dinamis Beranda (Homepage)</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input type="hidden" name="selayangPandangTitle" value={settings?.selayangPandangTitle || "Selayang Pandang"} />
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Unit Kegiatan Masjid (UKM)</label>
              <input 
                type="text"
                name="ukmTitle"
                defaultValue={settings?.ukmTitle || "Unit Kegiatan Masjid"}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Contoh: Unit Kegiatan Masjid (UKM)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input type="hidden" name="selayangPandangDescription" value={settings?.selayangPandangDescription || ""} />
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat UKM</label>
              <textarea 
                name="ukmDescription"
                rows={3}
                defaultValue={settings?.ukmDescription || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Deskripsi singkat yang tampil di bawah judul UKM..."
              ></textarea>
            </div>
          </div>
        </div>
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
    </div>
  );
}

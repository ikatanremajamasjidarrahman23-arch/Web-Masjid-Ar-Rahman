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
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logoUrl || null);
  const [irmasLogoPreview, setIrmasLogoPreview] = useState<string | null>(settings?.irmasLogoUrl || null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    // Save original content to restore later
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyimpan...`;
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      await saveSettings(formData);
      alert("Pengaturan berhasil disimpan.");
      
      // If it's the design form, reload to apply new CSS vars globally
      if (form.name === "designForm") {
        window.location.reload();
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
    }
  };

  return (
    <div className="space-y-12">
      
      {/* 1. Desain & Tampilan */}
      <form name="designForm" onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-100">
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
              <input type="hidden" name="themeColor" value={selectedTheme} />
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
              <p className="text-xs text-gray-500 mt-2">Pilih warna dominan yang paling sesuai.</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
              <Save className="w-4 h-4" /> Simpan Tampilan
            </button>
          </div>
        </div>
      </form>

      {/* 2. Logo & Ukuran */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Logo & Ukuran</h3>
        <input type="hidden" name="logoUrl" value={logoPreview || ""} />
        <input type="hidden" name="irmasLogoUrl" value={irmasLogoPreview || ""} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Logo Masjid Utama (Navbar & Profil)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors h-[220px]">
              {logoPreview ? (
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Tinggi di IRMAS (px)</label>
                <input type="number" name="logoSizeIrmas" defaultValue={settings?.logoSizeIrmas || 80} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Save className="w-4 h-4" /> Simpan Logo
          </button>
        </div>
      </form>

      {/* 3. Visi Misi */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Visi & Misi</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Visi Masjid</label>
            <textarea name="visi" rows={3} defaultValue={settings?.visi || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Masukkan teks visi masjid..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Misi Masjid</label>
            <textarea name="misi" rows={6} defaultValue={settings?.misi || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Masukkan teks misi masjid..."></textarea>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Save className="w-4 h-4" /> Simpan Visi Misi
          </button>
        </div>
      </form>

      {/* 4. Sejarah */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sejarah Masjid</h3>
        <div>
          <textarea name="sejarah" rows={8} defaultValue={settings?.sejarah || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ceritakan sejarah berdirinya masjid..."></textarea>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Save className="w-4 h-4" /> Simpan Sejarah
          </button>
        </div>
      </form>

      {/* 5. QRIS */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">QRIS Donasi</h3>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar QRIS</label>
          <input type="url" name="qrisImage" defaultValue={settings?.qrisImage || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://..." />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Save className="w-4 h-4" /> Simpan QRIS
          </button>
        </div>
      </form>

      {/* 6. Running Text */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pengumuman (Running Text)</h3>
        <div className="space-y-4">
          <div>
            <textarea name="runningText" rows={2} defaultValue={settings?.runningText || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Masukkan teks pengumuman berjalan..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kecepatan (Detik)</label>
            <input type="number" name="runningTextSpeed" min="5" max="100" defaultValue={settings?.runningTextSpeed || 25} className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Save className="w-4 h-4" /> Simpan Pengumuman
          </button>
        </div>
      </form>

      {/* 7. Homepage Dinamis */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Teks Dinamis Beranda (Homepage)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Unit Kegiatan Masjid (UKM)</label>
            <input type="text" name="ukmTitle" defaultValue={settings?.ukmTitle || "Unit Kegiatan Masjid"} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat UKM</label>
            <textarea name="ukmDescription" rows={3} defaultValue={settings?.ukmDescription || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Save className="w-4 h-4" /> Simpan Teks Beranda
          </button>
        </div>
      </form>

      {/* 8. Footer */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Footer & Kontak</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat Masjid</label>
            <textarea name="deskripsiSingkat" rows={2} defaultValue={settings?.deskripsiSingkat || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
            <textarea name="alamat" rows={2} defaultValue={settings?.alamat || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon / WA</label>
              <input type="text" name="telepon" defaultValue={settings?.telepon || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="email" defaultValue={settings?.email || ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Save className="w-4 h-4" /> Simpan Kontak
          </button>
        </div>
      </form>

    </div>
  );
}

"use client";

import { useState } from "react";
import { saveDatabaseUrl } from "@/app/actions/env";
import { Server, AlertTriangle, Loader2, Save } from "lucide-react";

export default function DatabaseSettingsForm({ currentUrl }: { currentUrl: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [url, setUrl] = useState(currentUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      alert("URL Database tidak boleh kosong!");
      return;
    }

    if (!confirm("PERINGATAN BAHAYA!\n\nMengubah URL ini akan memindahkan server database utama. Jika URL salah, website akan langsung mati dan Anda tidak akan bisa kembali ke halaman ini.\n\nApakah Anda yakin ingin mengganti URL Database?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveDatabaseUrl(url);
      if (res.success) {
        alert("Konfigurasi Database berhasil disimpan. Mesin server kemungkinan akan melakukan restart ulang secara otomatis dalam beberapa saat.");
      } else {
        alert(res.error || "Terjadi kesalahan.");
      }
    } catch (error) {
      alert("Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
        <div className="text-sm">
          <p className="font-bold text-red-900 mb-1">Zona Berbahaya (Advanced)</p>
          <p>Fitur ini akan langsung menimpa file <code>.env</code> di dalam server (Khusus untuk Local/VPS Windows). Pastikan Anda memasukkan <i>connection string</i> yang valid (dimulai dengan <code>postgresql://</code>).</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Neon Database URL</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Server className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm bg-white"
            placeholder="postgresql://user:password@host/db..."
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Dibiarkan tersamarkan (password) untuk alasan keamanan saat ada orang lain di dekat Anda.</p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || url === currentUrl}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Perbarui Kunci Database
        </button>
      </div>
    </form>
  );
}

import { prisma } from "@/lib/prisma";
import DatabaseSettingsForm from "@/components/admin/DatabaseSettingsForm";
import CloudinarySettingsForm from "@/components/admin/CloudinarySettingsForm";
import { getDatabaseUrl } from "@/app/actions/env";

export default async function AdminPengaturanSistemPage() {
  const settings = await prisma.settings.findFirst();
  const dbUrl = await getDatabaseUrl();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan API Cloudinary (Media Storage)</h2>
          <p className="text-gray-600 mt-1">Ganti API Key Cloudinary untuk penyimpanan gambar.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
          <CloudinarySettingsForm settings={settings} />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Konfigurasi Database Utama</h2>
          <p className="text-gray-600 mt-1">Ganti kunci koneksi Neon PostgreSQL secara langsung (Hanya untuk tingkat lanjut).</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-2xl">
          <DatabaseSettingsForm currentUrl={dbUrl} />
        </div>
      </div>
    </div>
  );
}

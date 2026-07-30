import { prisma } from "@/lib/prisma";
import SettingsClientForm from "@/components/admin/SettingsClientForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import DatabaseSettingsForm from "@/components/admin/DatabaseSettingsForm";
import { getDatabaseUrl } from "@/app/actions/env";

export default async function AdminProfilPage() {
  const settings = await prisma.settings.findFirst();
  const dbUrl = await getDatabaseUrl();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Profil Masjid</h2>
          <p className="text-gray-600 mt-1">Ubah logo, teks Visi, Misi, Sejarah, dan QRIS yang akan ditampilkan di halaman Jemaah.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <SettingsClientForm settings={settings} />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Keamanan Akun</h2>
          <p className="text-gray-600 mt-1">Ubah password untuk login ke dashboard admin.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
          <ChangePasswordForm />
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

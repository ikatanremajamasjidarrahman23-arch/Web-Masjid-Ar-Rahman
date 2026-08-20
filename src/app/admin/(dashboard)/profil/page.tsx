import { prisma } from "@/lib/prisma";
import SettingsClientForm from "@/components/admin/SettingsClientForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminProfilPage() {
  const settings = await prisma.settings.findFirst();

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

    </div>
  );
}

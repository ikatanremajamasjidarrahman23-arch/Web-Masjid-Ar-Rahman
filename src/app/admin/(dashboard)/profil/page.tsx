import { prisma } from "@/lib/prisma";
import SettingsClientForm from "@/components/admin/SettingsClientForm";

export default async function AdminProfilPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Profil Masjid</h2>
        <p className="text-gray-600 mt-1">Ubah logo, teks Visi, Misi, Sejarah, dan QRIS yang akan ditampilkan di halaman Jemaah.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <SettingsClientForm settings={settings} />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import PopupManagerClient from "@/components/admin/PopupManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminPopupPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Popup Banner</h2>
        <p className="text-gray-600 mt-1">Kelola banner pengumuman atau ucapan yang muncul di atas layar ketika pengunjung membuka website.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <PopupManagerClient settings={settings} />
      </div>
    </div>
  );
}

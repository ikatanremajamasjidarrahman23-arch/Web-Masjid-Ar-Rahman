import { prisma } from "@/lib/prisma";
import PhbiClientManager from "@/components/admin/PhbiClientManager";

export const dynamic = "force-dynamic"; // Ensure it always fetches fresh data on load

export default async function AdminPhbiPage() {
  const events = await prisma.phbiEvent.findMany({
    include: {
      media: true,
    },
    orderBy: {
      date: 'desc'
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dokumentasi PHBI</h2>
        <p className="text-gray-600 mt-1">Kelola acara Peringatan Hari Besar Islam dan unggah foto/video dokumentasinya.</p>
      </div>

      <PhbiClientManager initialEvents={events} />
    </div>
  );
}

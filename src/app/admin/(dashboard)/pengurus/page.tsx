import OrganizationClient from "./OrganizationClient";
import AdArtClientForm from "@/components/admin/AdArtClientForm";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function PengurusPage() {
  const members = await prisma.organizationMember.findMany({
    orderBy: { order: "asc" }
  });
  const settings = await prisma.settings.findFirst();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
          <p className="text-gray-600 mt-1">Kelola data pengurus dan struktur organisasi masjid</p>
        </div>
      </div>

      <OrganizationClient initialMembers={members} />
      
      <div className="pt-6">
        <AdArtClientForm settings={settings} />
      </div>
    </div>
  );
}

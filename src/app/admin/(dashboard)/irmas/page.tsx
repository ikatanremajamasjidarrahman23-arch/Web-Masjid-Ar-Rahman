import { prisma } from "@/lib/prisma";
import IrmasDashboardClient from "./IrmasDashboardClient";

export const revalidate = 0; // Disable cache for admin page

export default async function AdminIrmasPage() {
  const activities = await prisma.irmasActivity.findMany({
    orderBy: { date: "desc" },
  });

  const members = await prisma.irmasMemberRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <IrmasDashboardClient 
      initialActivities={activities} 
      initialMembers={members} 
    />
  );
}

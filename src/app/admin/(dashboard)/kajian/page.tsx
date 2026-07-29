import { prisma } from "@/lib/prisma";
import KajianDashboardClient from "./KajianDashboardClient";

export const revalidate = 0; // Disable cache for admin page

export default async function AdminKajianPage() {
  const schedules = await prisma.studySchedule.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <KajianDashboardClient initialSchedules={schedules} />
  );
}

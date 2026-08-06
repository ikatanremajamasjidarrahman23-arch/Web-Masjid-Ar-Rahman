import UkmDashboardClient from "./UkmDashboardClient";

export const revalidate = 0; // Disable cache for admin page

export default async function AdminUkmPage() {
  return (
    <div className="space-y-6">
      <UkmDashboardClient />
    </div>
  );
}

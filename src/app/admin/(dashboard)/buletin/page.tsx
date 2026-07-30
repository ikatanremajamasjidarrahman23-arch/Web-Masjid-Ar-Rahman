import BuletinDashboardClient from "./BuletinDashboardClient";

export const revalidate = 0; // Disable cache for admin page

export default async function AdminBuletinPage() {
  return (
    <div className="space-y-6">
      <BuletinDashboardClient />
    </div>
  );
}

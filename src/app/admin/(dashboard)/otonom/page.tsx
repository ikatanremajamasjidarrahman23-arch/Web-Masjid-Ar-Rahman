import OtonomDashboardClient from "./OtonomDashboardClient";

export const revalidate = 0; // Disable cache for admin page

export default async function AdminOtonomPage() {
  return (
    <div className="space-y-6">
      <OtonomDashboardClient />
    </div>
  );
}

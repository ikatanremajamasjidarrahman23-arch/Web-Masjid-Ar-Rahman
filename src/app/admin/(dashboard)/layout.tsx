import AdminSidebar from "@/components/admin/AdminSidebar";
import { logoutAction } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar logoutAction={logoutAction} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 pt-20 md:pt-8 md:p-8 w-full max-w-[100vw]">
        {children}
      </main>
    </div>
  );
}

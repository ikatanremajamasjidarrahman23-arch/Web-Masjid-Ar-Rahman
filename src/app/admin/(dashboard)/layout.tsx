import AdminSidebar from "@/components/admin/AdminSidebar";
import { logoutAction } from "@/app/actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "arrahman_secret_auth_key_v2_2026_locked";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    // Sesi lama / token kedaluwarsa -> lempar langsung ke login
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar logoutAction={logoutAction} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 pt-36 md:pt-8 md:p-8 w-full max-w-[100vw]">
        {children}
      </main>
    </div>
  );
}

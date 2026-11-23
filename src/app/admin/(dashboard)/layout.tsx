import AdminSidebar from "@/components/admin/AdminSidebar";
import { logoutAction } from "@/app/actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

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

  let role = "admin";
  let username = "admin";

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    role = decoded.role || "admin";
    username = decoded.username || "admin";
  } catch {
    // Sesi lama / token kedaluwarsa -> lempar langsung ke login
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar logoutAction={logoutAction} role={role} username={username} />

      {/* Main Content Area — Beri padding atas yang lapang agar tidak tertabrak Navbar di mobile maupun desktop */}
      <main className="flex-1 md:ml-64 p-4 pt-36 md:pt-28 md:p-8 w-full max-w-[100vw]">
        {children}
      </main>
    </div>
  );
}

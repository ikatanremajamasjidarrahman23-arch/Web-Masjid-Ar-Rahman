"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, LogOut, Settings, Calendar, Users, Wallet, BookOpen, Image as ImageIcon, Menu, X, ImagePlus, Megaphone, Network, Globe, StickyNote, Library } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import VercelStatusLight from "./VercelStatusLight";

export default function AdminSidebar({ logoutAction }: { logoutAction: (payload: FormData) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Papan Buletin", href: "/admin/buletin", icon: Megaphone },
    { name: "Catatan Admin", href: "/admin/notepad", icon: StickyNote },
    { name: "Profil Masjid", href: "/admin/profil", icon: Users },
    { name: "Pengaturan Sistem", href: "/admin/pengaturan", icon: Settings },
    { name: "Struktur Organisasi", href: "/admin/pengurus", icon: Network },
    { name: "Unit Kegiatan Masjid", href: "/admin/ukm", icon: Library },
    { name: "Selayang Pandang", href: "/admin/selayang-pandang", icon: ImageIcon },
    { name: "Dokumentasi PHBI", href: "/admin/phbi", icon: Calendar },
    { name: "Kegiatan IRMAS", href: "/admin/irmas", icon: Users },
    { name: "Agenda Kegiatan", href: "/admin/kajian", icon: BookOpen },
    { name: "Galeri Foto", href: "/admin/gallery", icon: ImageIcon },
    { name: "Popup Banner", href: "/admin/popup", icon: ImagePlus },
    { name: "Kas & Donasi", href: "/admin/donasi", icon: Wallet },
  ];

  const handleSettingsClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (pathname === href) return;
    setShowPasswordModal(true);
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await axios.post("/api/auth/verify-password", { password });
      if (res.data.success) {
        setShowPasswordModal(false);
        setPassword("");
        router.push("/admin/pengaturan");
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Password salah atau terjadi kesalahan");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden fixed top-16 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Menu Admin</h1>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
        >
          <span className="text-sm font-medium">Menu</span>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <h1 className="text-xl font-bold text-gray-900 hidden md:block">Admin Panel</h1>
          <h1 className="text-xl font-bold text-gray-900 md:hidden">Menu</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            if (link.name === "Pengaturan Sistem") {
              return (
                <button 
                  key={link.name} 
                  onClick={(e) => handleSettingsClick(e, link.href)}
                  className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-gray-500"}`} />
                  <span className="font-medium text-left flex-1">{link.name}</span>
                </button>
              )
            }

            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-gray-500"}`} />
                <span className="font-medium">{link.name}</span>
              </Link>
            )
          })}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-3 py-2 w-full text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-left mb-2"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">Kembali ke Publik</span>
            </Link>
            <VercelStatusLight />
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-3 px-3 py-2 w-full text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Verifikasi Keamanan</h2>
              <button 
                onClick={() => setShowPasswordModal(false)} 
                className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleVerifyPassword} className="p-6 space-y-6">
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Untuk mengakses <strong>Pengaturan Sistem</strong>, silakan masukkan password akun admin Anda.
                </p>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5"
                  placeholder="Masukkan password admin..."
                  autoFocus
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="mr-3 px-5 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm"
                >
                  {isVerifying ? "Memeriksa..." : "Lanjutkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

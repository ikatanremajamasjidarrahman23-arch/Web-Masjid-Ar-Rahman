"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, LogOut, Settings, Calendar, Users, Wallet, BookOpen, Image as ImageIcon, Menu, X, ImagePlus, Megaphone, Network, Globe, StickyNote, Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import VercelStatusLight from "./VercelStatusLight";

export default function AdminSidebar({ logoutAction }: { logoutAction: (payload: FormData) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Papan Buletin", href: "/admin/buletin", icon: Megaphone },
    { name: "Catatan Admin", href: "/admin/notepad", icon: StickyNote },
    { name: "Profil & Pengaturan", href: "/admin/profil", icon: Settings },
    { name: "Struktur Organisasi", href: "/admin/pengurus", icon: Network },
    { name: "Lembaga & Otonom", href: "/admin/otonom", icon: Library },
    { name: "Dokumentasi PHBI", href: "/admin/phbi", icon: Calendar },
    { name: "Kegiatan IRMAS", href: "/admin/irmas", icon: Users },
    { name: "Agenda Kegiatan", href: "/admin/kajian", icon: BookOpen },
    { name: "Galeri Foto", href: "/admin/gallery", icon: ImageIcon },
    { name: "Popup Banner", href: "/admin/popup", icon: ImagePlus },
    { name: "Kas & Donasi", href: "/admin/donasi", icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
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
    </>
  );
}

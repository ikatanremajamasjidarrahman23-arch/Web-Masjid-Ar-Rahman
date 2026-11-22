"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Moon, ChevronDown, Heart, ChevronRight,
  Image as ImageIcon, Users, BookOpen,
  Calendar, Layers, MessageSquare, Phone, Music
} from "lucide-react";
import NavbarDateWidget from "./NavbarDateWidget";

interface Sublink {
  name: string;
  href: string;
  desc?: string;
  icon?: any;
}

interface NavItem {
  id: string;
  name: string;
  href?: string;
  isDropdown?: boolean;
  sublinks?: Sublink[];
}

const navLinks: NavItem[] = [
  { id: "beranda", name: "Beranda", href: "/" },
  { id: "profil", name: "Profil", href: "/profil" },
  { id: "kajian", name: "Kajian", href: "/kajian" },
  { id: "buletin", name: "Buletin", href: "/buletin" },
  { id: "galeri", name: "Galeri", href: "/galeri" },
  {
    id: "kelembagaan",
    name: "Kelembagaan",
    isDropdown: true,
    sublinks: [
      { name: "Hadroh Ahbabul Wafa", href: "/ukm#hadroh", desc: "Seni hadroh & marhabanan maulid", icon: Music },
      { name: "Majelis Ta'lim Jumhuriyah", href: "/ukm#jumhuriyah", desc: "Kajian rutin kaum ibu muslimah", icon: BookOpen },
      { name: "Remaja Masjid (IRMAS)", href: "/irmas", desc: "Wadah kepemudaan & kreativitas", icon: Users },
      { name: "Unit Kegiatan (UKM)", href: "/ukm", desc: "Seluruh badan otonom masjid", icon: Layers },
    ],
  },
  { id: "donasi", name: "Kas & Donasi", href: "/donasi" },
];

export default function Navbar({
  logoUrl,
  logoSize = 48,
}: {
  logoUrl?: string | null;
  logoSize?: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    kelembagaan: true,
  });
  const [donasiOpen, setDonasiOpen] = useState(false);
  
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll listener for progress bar and shadow
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on page route changes
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Anti-flicker dropdown handlers with hover bridge
  const handleMouseEnter = (id: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileAccordion = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isLinkActive = (href?: string) => {
    if (!href) return false;
    return href === "/" ? pathname === "/" : pathname?.startsWith(href);
  };

  const isDropdownActive = (sublinks?: Sublink[]) => {
    return sublinks?.some((sub) => pathname?.startsWith(sub.href)) ?? false;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-primary-950/98 backdrop-blur-xl border-b border-primary-800/60 h-16 sm:h-[72px] flex items-center ${
          scrolled ? "shadow-xl shadow-black/30" : "shadow-md"
        }`}
      >
        {/* Scroll progress bar */}
        {!isAdmin && (
          <div
            className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-primary-400 via-amber-400 to-emerald-400 transition-all duration-100 z-10"
            style={{ width: `${scrollProgress}%` }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo & Identitas */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group py-1">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo Masjid Jami' Ar-Rahman"
                  className="w-auto object-contain transition-all duration-300 drop-shadow-md brightness-110 h-10 sm:h-12"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-emerald-500 flex items-center justify-center text-white shadow-md ring-2 ring-white/10 group-hover:scale-105 transition-transform">
                    <Moon className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="font-bold tracking-tight text-white text-sm sm:text-base block leading-tight group-hover:text-amber-200 transition-colors">
                      Masjid Ar-Rahman
                    </span>
                    <span className="text-[10px] text-emerald-300/80 tracking-wider uppercase block">
                      Cempaka, Plumbon
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation (Rapi, 7 Menu Utama, Bebas Sesak) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {isAdmin ? (
                <NavbarDateWidget />
              ) : (
                <>
                  {navLinks.map((item) => {
                    if (item.isDropdown) {
                      const isOpened = activeDropdown === item.id;
                      const hasActiveChild = isDropdownActive(item.sublinks);

                      return (
                        <div
                          key={item.id}
                          className="relative"
                          onMouseEnter={() => handleMouseEnter(item.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer ${
                              hasActiveChild
                                ? "bg-primary-800 text-amber-300 shadow-xs ring-1 ring-amber-400/30"
                                : "text-white/85 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isOpened ? "rotate-180 text-amber-400" : "text-white/60"
                              }`}
                            />
                          </button>

                          {/* Dropdown Card dengan Anti-Flicker Invisible Bridge */}
                          {isOpened && (
                            <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-scale-in">
                              {/* Invisible Hover Bridge */}
                              <div className="absolute -top-2.5 left-0 w-full h-3" />

                              <div className="bg-primary-950/98 backdrop-blur-2xl border border-primary-700/80 rounded-2xl shadow-2xl p-2 ring-1 ring-white/10">
                                {item.sublinks?.map((sub) => {
                                  const SubIcon = sub.icon || ChevronRight;
                                  const isSubActive = isLinkActive(sub.href);

                                  return (
                                    <Link
                                      key={sub.name}
                                      href={sub.href}
                                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                        isSubActive
                                          ? "bg-primary-800/90 text-amber-300 font-bold"
                                          : "text-white/85 hover:text-white hover:bg-white/10"
                                      }`}
                                    >
                                      <div className={`mt-0.5 p-1.5 rounded-lg ${isSubActive ? "bg-amber-400/20 text-amber-300" : "bg-white/5 text-primary-300"}`}>
                                        <SubIcon className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className="text-xs xl:text-sm font-semibold leading-tight">{sub.name}</p>
                                        {sub.desc && (
                                          <p className="text-[11px] text-primary-300/80 font-normal mt-0.5 leading-snug">
                                            {sub.desc}
                                          </p>
                                        )}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    const active = isLinkActive(item.href);
                    return (
                      <Link
                        key={item.id}
                        href={item.href!}
                        className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all relative ${
                          active
                            ? "bg-primary-800 text-amber-300 shadow-xs ring-1 ring-amber-400/30"
                            : "text-white/85 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.name}
                        {active && (
                          <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                        )}
                      </Link>
                    );
                  })}

                  {/* Tombol Infaq Emas */}
                  <button
                    onClick={() => setDonasiOpen(true)}
                    className="ml-2 xl:ml-3 flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Infaq</span>
                  </button>

                </>
              )}
            </div>

            {/* Mobile Actions: Infaq Compact + Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              {!isAdmin && (
                <button
                  onClick={() => setDonasiOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-sm active:scale-95"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Infaq</span>
                </button>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all focus:outline-none"
                aria-label="Buka Menu Navigasi"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Spacious & Thumb-Friendly) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop dengan Blur */}
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel Drawer Sisi Kanan */}
        <div
          className={`absolute top-0 right-0 h-full w-[320px] max-w-[85vw] bg-primary-950 border-l border-primary-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header Drawer */}
          <div className="flex items-center justify-between p-5 border-b border-primary-800/80 bg-primary-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-emerald-500 flex items-center justify-center text-white shadow-sm">
                <Moon className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block leading-tight">Masjid Ar-Rahman</span>
                <span className="text-[10px] text-emerald-300/80 tracking-wide block">Menu Utama</span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Links (Accordion & Large Touch Target) */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {navLinks.map((item) => {
              if (item.isDropdown) {
                const isExpanded = mobileExpanded[item.id] ?? false;
                const hasActiveChild = isDropdownActive(item.sublinks);

                return (
                  <div key={item.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                    <button
                      type="button"
                      onClick={() => toggleMobileAccordion(item.id)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-white/90 hover:text-white transition-colors"
                    >
                      <span className={hasActiveChild ? "text-amber-300 font-bold" : ""}>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-white/60 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-amber-400" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 space-y-1 bg-black/20 border-t border-white/5">
                        {item.sublinks?.map((sub) => {
                          const SubIcon = sub.icon || ChevronRight;
                          const active = isLinkActive(sub.href);

                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all ${
                                active
                                  ? "bg-primary-800 text-amber-300 font-bold"
                                  : "text-white/80 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              <SubIcon className={`w-4 h-4 ${active ? "text-amber-400" : "text-primary-400"}`} />
                              <span>{sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href!}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-primary-800 text-amber-300 font-bold ring-1 ring-amber-400/30"
                      : "text-white/85 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.name}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Action Sheet (Ramah Jempol) */}
          <div className="p-4 border-t border-primary-800/80 bg-primary-900/30 space-y-2.5">
            <button
              onClick={() => { setDonasiOpen(true); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 active:scale-98 text-slate-950 font-bold rounded-2xl shadow-lg text-sm cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Infaq & Donasi Masjid</span>
            </button>

            <p className="text-center text-[10px] text-white/40 pt-1">
              © {new Date().getFullYear()} DKM Masjid Jami' Ar-Rahman Cempaka
            </p>
          </div>
        </div>
      </div>

      {/* Donasi Quick Modal */}
      {donasiOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setDonasiOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-amber-600 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Infaq & Donasi</h3>
            <p className="text-sm text-gray-500 mb-6">
              Salurkan kebaikan melalui rekening bank dan QRIS resmi masjid
            </p>
            <Link
              href="/donasi"
              onClick={() => setDonasiOpen(false)}
              className="block w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-md text-sm"
            >
              Buka Halaman Donasi →
            </Link>
            <button
              onClick={() => setDonasiOpen(false)}
              className="mt-3.5 text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

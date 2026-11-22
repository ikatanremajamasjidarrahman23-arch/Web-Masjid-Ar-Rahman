"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, ChevronDown, Heart, ChevronRight, ShieldCheck } from "lucide-react";
import NavbarDateWidget from "./NavbarDateWidget";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Buletin", href: "/buletin" },
  { name: "Kajian", href: "/kajian" },
  { name: "Profil", href: "/profil" },
  {
    name: "Galeri",
    isDropdown: true,
    sublinks: [
      { name: "Galeri Kegiatan", href: "/galeri" },
      { name: "Galeri PHBI", href: "/phbi" },
    ],
  },
  { name: "IRMAS", href: "/irmas" },
  { name: "UKM", href: "/ukm" },
  { name: "Kas & Donasi", href: "/donasi" },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [donasiOpen, setDonasiOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-primary-950/95 backdrop-blur-xl border-b border-primary-800/60 shadow-lg ${
          scrolled ? "py-1.5 shadow-black/30" : "py-3"
        }`}
      >
        {/* Scroll progress bar */}
        {!isAdmin && (
          <div
            className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-primary-400 via-amber-400 to-emerald-400 transition-all duration-100 z-10"
            style={{ width: `${scrollProgress}%` }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo Masjid"
                  className="w-auto object-contain transition-all duration-300 drop-shadow-md brightness-110"
                  style={{
                    height: scrolled
                      ? `${((logoSize * 1.0) / 16).toFixed(2)}rem`
                      : `${((logoSize * 1.25) / 16).toFixed(2)}rem`,
                  }}
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
                    <Moon className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="font-bold tracking-tight text-white text-base sm:text-lg block leading-tight">
                      Masjid Ar-Rahman
                    </span>
                    <span className="text-[10px] text-emerald-200/80 tracking-wider uppercase block">
                      Cempaka, Plumbon
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {isAdmin ? (
                <NavbarDateWidget />
              ) : (
                <>
                  {navLinks.map((link) => {
                    if (link.isDropdown) {
                      return (
                        <div
                          key={link.name}
                          className="relative"
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          <button
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                              link.sublinks?.some((s) => isActive(s.href))
                                ? "bg-primary-800 text-amber-300 shadow-xs"
                                : "text-white/90 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <span>{link.name}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                dropdownOpen ? "rotate-180 text-amber-400" : "text-white/60"
                              }`}
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {dropdownOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-52 bg-primary-900 border border-primary-700/80 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-scale-in">
                              {link.sublinks?.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                                    isActive(sub.href)
                                      ? "text-amber-300 bg-primary-800/80 font-bold"
                                      : "text-white/80 hover:text-white hover:bg-white/10"
                                  }`}
                                >
                                  <span>{sub.name}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-primary-400" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const active = isActive(link.href!);
                    return (
                      <Link
                        key={link.name}
                        href={link.href!}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all relative ${
                          active
                            ? "bg-primary-800 text-amber-300 shadow-xs"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {link.name}
                        {active && (
                          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full" />
                        )}
                      </Link>
                    );
                  })}

                  {/* Tombol Donasi */}
                  <button
                    onClick={() => setDonasiOpen(true)}
                    className="ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Infaq</span>
                  </button>

                  {/* Tombol Akses Admin */}
                  <Link
                    href="/admin"
                    title="Portal Admin"
                    className="ml-1 p-2 rounded-lg text-emerald-300/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              {!isAdmin && (
                <button
                  onClick={() => setDonasiOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-sm"
                >
                  <Heart className="w-3 h-3 fill-current" />
                  <span>Infaq</span>
                </button>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-primary-950 border-l border-primary-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Moon className="w-6 h-6 text-amber-300" />
              <span className="font-bold text-white text-base">Masjid Ar-Rahman</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.name} className="py-1">
                    <p className="px-4 py-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                      {link.name}
                    </p>
                    {link.sublinks?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`flex items-center justify-between px-6 py-2.5 rounded-xl text-sm transition-colors ${
                          isActive(sub.href)
                            ? "bg-primary-800 text-amber-300 font-bold"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{sub.name}</span>
                        <ChevronRight className="w-4 h-4 text-primary-400" />
                      </Link>
                    ))}
                  </div>
                );
              }

              const active = isActive(link.href!);
              return (
                <Link
                  key={link.name}
                  href={link.href!}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary-800 text-amber-300 font-bold"
                      : "text-white/85 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </Link>
              );
            })}

            {/* Link Admin di Mobile */}
            <div className="pt-3 mt-3 border-t border-white/10">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-300 bg-primary-900/60 hover:bg-primary-900 transition-colors"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Portal Admin & Pengurus</span>
              </Link>
            </div>
          </nav>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-white/10 space-y-3">
            <button
              onClick={() => { setDonasiOpen(true); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl shadow-md text-sm cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              Infaq & Donasi Masjid
            </button>
            <p className="text-center text-[11px] text-white/40">
              © {new Date().getFullYear()} DKM Masjid Ar-Rahman
            </p>
          </div>
        </div>
      </div>

      {/* Donasi Quick Modal */}
      {donasiOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
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

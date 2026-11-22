"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, ChevronDown, Heart, ChevronRight } from "lucide-react";
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
      setScrolled(scrollY > 60);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isAdmin
            ? "bg-primary-900/90 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        {/* Scroll progress bar */}
        {!isAdmin && (
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-400 via-amber-300 to-primary-400 transition-all duration-100 z-10"
            style={{ width: `${scrollProgress}%` }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo Masjid"
                  className={`w-auto object-contain transition-all duration-300 drop-shadow-sm ${
                    scrolled ? "brightness-200" : "brightness-110"
                  }`}
                  style={{
                    height: scrolled
                      ? `${((logoSize * 1.2) / 16).toFixed(2)}rem`
                      : `${((logoSize * 1.6) / 16).toFixed(2)}rem`,
                  }}
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <Moon className="w-7 h-7 text-primary-300 group-hover:text-primary-200 transition-colors" />
                  <span
                    className={`font-bold tracking-tight text-white drop-shadow-sm transition-all duration-300 ${
                      scrolled ? "text-lg" : "text-xl"
                    }`}
                  >
                    Masjid Ar-Rahman
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
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
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              dropdownOpen
                                ? "bg-white/15 text-white"
                                : "text-white/85 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {link.name}
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                dropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <div
                            className={`absolute top-full left-0 pt-2 w-52 transition-all duration-200 ${
                              dropdownOpen
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 -translate-y-2 pointer-events-none"
                            }`}
                          >
                            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                              {link.sublinks?.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  className="flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-white/15 transition-colors group"
                                >
                                  <span>{sub.name}</span>
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={link.name}
                        href={link.href!}
                        className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive(link.href!)
                            ? "text-white bg-white/20"
                            : "text-white/85 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {link.name}
                        {isActive(link.href!) && (
                          <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-primary-300 rounded-full" />
                        )}
                      </Link>
                    );
                  })}

                  {/* Donasi Button */}
                  <button
                    onClick={() => setDonasiOpen(true)}
                    className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-900 text-sm font-bold transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40 hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Infaq
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`absolute transition-all duration-300 ${
                  mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                }`}
              >
                <X className="w-6 h-6" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
                }`}
              >
                <Menu className="w-6 h-6" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-primary-950 shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Moon className="w-6 h-6 text-primary-300" />
              <span className="font-bold text-white">Masjid Ar-Rahman</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.name}>
                    <p className="px-6 py-2 text-xs font-bold text-primary-400 uppercase tracking-widest">
                      {link.name}
                    </p>
                    {link.sublinks?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="flex items-center gap-3 px-8 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-primary-400" />
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  href={link.href!}
                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors ${
                    isActive(link.href!)
                      ? "text-primary-300 bg-primary-800/50 border-r-2 border-primary-400"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer drawer */}
          <div className="p-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => { setDonasiOpen(true); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold rounded-xl transition-colors text-sm"
            >
              <Heart className="w-4 h-4" />
              Infaq & Donasi
            </button>
            <p className="text-center text-xs text-white/30">
              © {new Date().getFullYear()} DKM Masjid Ar-Rahman
            </p>
          </div>
        </div>
      </div>

      {/* Donasi Quick Modal */}
      {donasiOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDonasiOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Infaq & Donasi</h3>
            <p className="text-sm text-gray-500 mb-6">
              Lihat rekening dan QRIS resmi masjid untuk berdonasi
            </p>
            <Link
              href="/donasi"
              onClick={() => setDonasiOpen(false)}
              className="block w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Lihat Info Donasi →
            </Link>
            <button
              onClick={() => setDonasiOpen(false)}
              className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, ChevronDown } from "lucide-react";
import NavbarDateWidget from "./NavbarDateWidget";

export default function Navbar({ logoUrl, logoSize = 48 }: { logoUrl?: string | null, logoSize?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Buletin", href: "/buletin" },
    { name: "Profil", href: "/profil" },
    { 
      name: "Galeri", 
      isDropdown: true,
      sublinks: [
        { name: "Galeri Kegiatan", href: "/galeri" },
        { name: "Galeri PHBI", href: "/phbi" }
      ]
    },
    { name: "IRMAS", href: "/irmas" },
    { name: "Kas & Donasi", href: "/donasi" },
  ];

  return (
    <nav className="bg-primary-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={logoUrl} 
                  alt="Logo Masjid" 
                  className="w-auto object-contain transition-all" 
                  style={{ 
                    height: `${Math.max(logoSize || 48, 80)}px`,
                    transform: 'scale(1.35) translateY(4px)',
                    transformOrigin: 'left center'
                  }} 
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Moon className="w-8 h-8 text-primary-200" />
                  <span className="font-bold text-xl md:text-2xl tracking-tight hidden sm:block drop-shadow-sm ml-2 md:ml-4">Masjid Ar-Rahman</span>
                </div>
              )}
            </Link>
          </div>
          <div className="hidden md:block">
            {isAdmin ? (
              <NavbarDateWidget />
            ) : (
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => {
                  if (link.isDropdown) {
                    return (
                      <div 
                        key={link.name} 
                        className="relative group"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <button
                          className="flex items-center gap-1 hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          {link.name}
                          <ChevronDown className="w-4 h-4 opacity-70" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute left-0 top-full pt-1 w-48 z-50">
                            <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                              <div className="py-1">
                                {link.sublinks?.map((sublink) => (
                                  <Link
                                    key={sublink.name}
                                    href={sublink.href}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                  >
                                    {sublink.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href!}
                      className="hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          {!isAdmin && (
            <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Buka menu utama</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          )}
        </div>
      </div>

      {isOpen && !isAdmin && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-800 shadow-inner">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.name}>
                    <button
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      className="flex items-center justify-between w-full hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      {link.name}
                      <ChevronDown className={`w-5 h-5 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileDropdownOpen && (
                      <div className="pl-6 space-y-1 mt-1">
                        {link.sublinks?.map((sublink) => (
                          <Link
                            key={sublink.name}
                            href={sublink.href}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-primary-200 hover:text-white hover:bg-primary-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href!}
                  className="hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

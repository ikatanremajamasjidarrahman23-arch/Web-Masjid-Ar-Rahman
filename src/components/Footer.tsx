import Link from "next/link";
import { Moon, MapPin, Phone, Mail, Heart, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HijriCalendarWidget from "./HijriCalendarWidget";
import TextSizeAdjuster from "./TextSizeAdjuster";

export default async function Footer() {
  const settings = await prisma.settings.findFirst();

  return (
    <footer className="relative bg-primary-950 text-primary-100 overflow-hidden border-t border-primary-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-primary-800/50">

          {/* Brand & Profil Singkat */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              {settings?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logoUrl} alt="Logo Masjid" className="h-10 w-auto object-contain brightness-0 invert" />
              ) : (
                <Moon className="w-8 h-8 text-primary-400" />
              )}
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary-200 transition-colors">
                Masjid Ar-Rahman
              </span>
            </Link>
            <p className="text-sm text-primary-300 leading-relaxed">
              {settings?.deskripsiSingkat || "Menjadi pusat ibadah, dakwah, dan pembinaan umat yang ramah, modern, dan rahmatan lil 'alamin di lingkungan Cempaka."}
            </p>
            {/* Ayat Al-Qur'an */}
            <blockquote className="border-l-2 border-primary-500 pl-3.5 py-1 text-sm text-primary-300/90 font-serif">
              <span className="text-base text-amber-300 block mb-1 font-arabic" dir="rtl">
                وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
              </span>
              <span className="text-xs text-primary-400 block">
                "Dan Kami tidak mengutus engkau melainkan untuk (menjadi) rahmat bagi semesta alam."
              </span>
              <span className="text-[11px] font-semibold text-amber-400/80 block mt-0.5">
                (QS. Al-Anbiya: 107)
              </span>
            </blockquote>
          </div>

          {/* Tautan Navigasi */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest text-amber-300">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Profil & Sejarah", href: "/profil" },
                { label: "Galeri Kegiatan", href: "/galeri" },
                { label: "Galeri PHBI", href: "/phbi" },
                { label: "Kegiatan IRMAS", href: "/irmas" },
                { label: "Unit Kegiatan (UKM)", href: "/ukm" },
                { label: "Infaq & Donasi", href: "/donasi" },
                { label: "Papan Buletin", href: "/buletin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-200/80 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-400" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak & Alamat */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest text-amber-300">
              Sekretariat & Kontak
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-primary-200/90 leading-relaxed">
                  {settings?.alamat || "Perumahan Korpri Cempaka, Plumbon, Cirebon, Jawa Barat."}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-primary-200/90">{settings?.telepon || "+62 812-3456-7890"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-primary-200/90">{settings?.email || "info@masjidarrahman.com"}</span>
              </li>
            </ul>
            <div className="pt-2">
              <TextSizeAdjuster />
            </div>
          </div>

          {/* Kalender Hijriyah & Donasi */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest text-amber-300">
              Kalender & Layanan
            </h3>
            <HijriCalendarWidget />

            <Link
              href="/donasi"
              className="mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] text-sm"
            >
              <Heart className="w-4 h-4 fill-current" />
              Infaq & Sedekah
            </Link>

            <Link
              href="/admin"
              className="block text-center text-xs text-primary-400 hover:text-white transition-colors pt-1 font-medium"
            >
              Portal Login Admin
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-primary-400">
          <p>© {new Date().getFullYear()} DKM Masjid Jami' Ar-Rahman Cempaka. Hak cipta dilindungi.</p>
          <p className="text-primary-400/80">
            Dikelola bersama Ikatan Remaja Masjid (IRMAS) Ar-Rahman
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Moon, MapPin, Phone, Mail, Heart, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HijriCalendarWidget from "./HijriCalendarWidget";
import TextSizeAdjuster from "./TextSizeAdjuster";

export default async function Footer() {
  const settings = await prisma.settings.findFirst();

  return (
    <footer className="relative bg-primary-950 text-primary-100 overflow-hidden">
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M40 0 L50 15 L65 15 L55 25 L60 40 L40 30 L20 40 L25 25 L15 15 L30 15Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-primary-800/50">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
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
              {settings?.deskripsiSingkat || "Menjadi pusat ibadah dan peradaban umat yang rahmatan lil 'alamin di lingkungan Cempaka."}
            </p>
            {/* Quote */}
            <blockquote className="border-l-2 border-primary-600 pl-3 italic text-sm text-primary-400">
              "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ"
              <br />
              <span className="text-xs not-italic text-primary-500 mt-1 block">QS. Al-Anbiya: 107</span>
            </blockquote>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Halaman</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Profil & Sejarah", href: "/profil" },
                { label: "Galeri Kegiatan", href: "/galeri" },
                { label: "Galeri PHBI", href: "/phbi" },
                { label: "Kegiatan Remaja", href: "/irmas" },
                { label: "Infaq & Shodaqoh", href: "/donasi" },
                { label: "Papan Buletin", href: "/buletin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-300 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Kontak</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-primary-300">{settings?.alamat || "Perumahan Korpri Cempaka, Plumbon, Cirebon."}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-primary-300">{settings?.telepon || "+62 812-3456-7890"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-primary-300">{settings?.email || "info@masjidarrahman.com"}</span>
              </li>
            </ul>
            <TextSizeAdjuster />
          </div>

          {/* Tanggal & CTA */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Tanggal Hari Ini</h3>
            <HijriCalendarWidget />

            <Link
              href="/donasi"
              className="mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.02] text-sm"
            >
              <Heart className="w-4 h-4" />
              Infaq & Donasi
            </Link>

            <Link
              href="/admin"
              className="block text-center text-xs text-primary-600 hover:text-primary-400 transition-colors mt-2"
            >
              Login Admin
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-primary-500">
          <p>© {new Date().getFullYear()} DKM Masjid Jami' Ar-Rahman. Hak Cipta Dilindungi.</p>
          <p className="text-primary-600">Dikembangkan oleh Tim IT IRMAS Ar-Rahman 💚</p>
        </div>
      </div>
    </footer>
  );
}

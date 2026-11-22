import Link from "next/link";
import { Moon, MapPin, Phone, Mail, Heart, ArrowRight, MessageSquareQuote } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HijriCalendarWidget from "./HijriCalendarWidget";
import TextSizeAdjuster from "./TextSizeAdjuster";

export default async function Footer() {
  const settings = await prisma.settings.findFirst();

  return (
    <footer className="relative bg-primary-950 text-primary-100 overflow-hidden border-t border-primary-900 bg-islamic-pattern-dark">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* ── 1. BAGIAN ATAS: GRID 2 KOLOM (KONTAK & MAPS TERPADU) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10">
          
          {/* Kolom Kiri: Sekretariat & Kontak Dinamis */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <span>Sekretariat DKM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hubungi Kami
            </h2>
            <p className="text-sm text-primary-200/90 max-w-xl leading-relaxed">
              Layanan informasi, aspirasi jamaah, zakat infaq, dan kemitraan kegiatan Masjid Jami' Ar-Rahman.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Alamat */}
              <div className="bg-primary-900/40 border border-primary-800/60 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-2.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <strong className="block text-white text-xs font-bold uppercase tracking-wider mb-1">
                    Alamat
                  </strong>
                  <p className="text-xs text-primary-200/80 leading-relaxed">
                    {settings?.alamat || "Perumahan Korpri Cempaka, Plumbon, Cirebon, Jawa Barat."}
                  </p>
                </div>
              </div>

              {/* Telepon / WhatsApp */}
              <div className="bg-primary-900/40 border border-primary-800/60 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-2.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <strong className="block text-white text-xs font-bold uppercase tracking-wider mb-1">
                    Telepon / WhatsApp
                  </strong>
                  <p className="text-xs text-primary-200/80 leading-relaxed">
                    {settings?.telepon || "+62 812-3456-7890 (Pengurus DKM)"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-primary-900/40 border border-primary-800/60 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-2.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <strong className="block text-white text-xs font-bold uppercase tracking-wider mb-1">
                    Email Resmi
                  </strong>
                  <p className="text-xs text-primary-200/80 leading-relaxed truncate">
                    {settings?.email || "info@masjidarrahman.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Google Maps Terpadu */}
          <div className="lg:col-span-5">
            <div className="h-[200px] w-full rounded-2xl overflow-hidden border border-primary-700/80 shadow-xl ring-1 ring-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15847.606208696881!2d108.4693498!3d-6.7498364!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1fc3f29ff4a3%3A0x80c84beab885f352!2sMASJID%20AR-RAHMAN!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Masjid Jami' Ar-Rahman"
              />
            </div>
          </div>

        </div>

        {/* ── GARIS PEMBATAS TIPIS ── */}
        <div className="border-t border-primary-800/70 my-8" />

        {/* ── 2. BAGIAN TENGAH: GRID 4 KOLOM UTAMA ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-primary-800/50">

          {/* Kolom 1 (Identitas & Ayat Al-Qur'an) */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              {settings?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoUrl}
                  alt="Logo Masjid"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
                  <Moon className="w-5 h-5 text-amber-300" />
                </div>
              )}
              <div>
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary-200 transition-colors block leading-tight">
                  Masjid Ar-Rahman
                </span>
                <span className="text-[10px] text-emerald-300/80 tracking-wider uppercase block">
                  Perumahan Korpri Cempaka
                </span>
              </div>
            </Link>

            <p className="text-xs text-primary-300 leading-relaxed">
              {settings?.deskripsiSingkat ||
                "Menjadi pusat ibadah, dakwah, dan pembinaan umat yang ramah, modern, dan rahmatan lil 'alamin di Perumahan Korpri Cempaka."}
            </p>

            {/* Kutipan QS. Al-Anbiya: 107 */}
            <blockquote className="border-l-2 border-amber-400 pl-3 py-1 text-xs text-primary-300/90 font-serif bg-primary-900/30 rounded-r-xl">
              <span className="text-sm text-amber-300 block mb-1 font-arabic" dir="rtl">
                وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
              </span>
              <span className="text-[11px] text-primary-300 block italic leading-snug">
                "Dan Kami tidak mengutus engkau melainkan untuk (menjadi) rahmat bagi semesta alam."
              </span>
              <span className="text-[10px] font-semibold text-amber-400/90 block mt-1 uppercase tracking-wide">
                (QS. Al-Anbiya: 107)
              </span>
            </blockquote>
          </div>

          {/* Kolom 2 (Navigasi Halaman - Tanpa Infaq & Donasi Duplikat) */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
              <span>Navigasi Halaman</span>
            </h3>
            <ul className="grid grid-cols-1 gap-2">
              {[
                { label: "Beranda", href: "/" },
                { label: "Profil & Sejarah", href: "/profil" },
                { label: "Jadwal Kajian", href: "/kajian" },
                { label: "Papan Buletin", href: "/buletin" },
                { label: "Galeri Kegiatan", href: "/galeri" },
                { label: "Galeri PHBI", href: "/galeri?kategori=PHBI" },
                { label: "Kegiatan IRMAS", href: "/irmas" },
                { label: "Unit Kegiatan (UKM)", href: "/ukm" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-primary-200/80 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 (Penanggalan Hari Ini: Realtime Clock, Hijri & Masehi) */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest text-amber-300">
              Penanggalan Hari Ini
            </h3>
            <HijriCalendarWidget />
          </div>

          {/* Kolom 4 (Layanan Jamaah) */}
          <div className="space-y-3.5 flex flex-col justify-start">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest text-amber-300">
              Layanan Jamaah
            </h3>
            <p className="text-xs text-primary-300 leading-relaxed">
              Salurkan kebaikan dan pantau kegiatan resmi DKM Masjid Jami' Ar-Rahman:
            </p>

            {/* Tombol Utama Kuning Kas & Donasi */}
            <Link
              href="/donasi"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] text-xs uppercase tracking-wider"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Kas &amp; Donasi</span>
            </Link>

            {/* Tombol Saluran Resmi DKM */}
            <Link
              href="https://whatsapp.com/channel/0029Vb8sbhPFcow73hKMgG3e"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-900/80 hover:bg-primary-800 text-white font-semibold rounded-xl border border-primary-700/80 transition-all text-xs"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-[#25D366] flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>Saluran Resmi DKM</span>
            </Link>
          </div>

        </div>

        {/* ── 3. BAGIAN PALING BAWAH (BOTTOM BAR & AKSES CRUD) ── */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-300">
          {/* Kiri: Copyright & Pengelola */}
          <div className="text-center md:text-left">
            <p className="font-medium text-white/90">
              © {new Date().getFullYear()} DKM Masjid Jami' Ar-Rahman Cempaka &amp; IRMAS Ar-Rahman.
            </p>
            <p className="text-[11px] text-primary-400 mt-0.5">
              Seluruh hak cipta dilindungi undang-undang.
            </p>
          </div>

          {/* Tengah: Penyesuaian Ukuran Layar */}
          <div className="flex items-center justify-center">
            <TextSizeAdjuster />
          </div>

          {/* Kanan: Portal Login Admin (CRUD) */}
          <div className="text-center md:text-right">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-900/60 hover:bg-primary-800 text-amber-300 hover:text-amber-200 border border-primary-700/60 transition-colors font-semibold"
            >
              <span>Portal Login Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

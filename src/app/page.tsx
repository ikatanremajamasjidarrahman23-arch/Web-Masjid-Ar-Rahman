import PrayerTimes from "@/components/PrayerTimes";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  Megaphone,
  Clock,
  User,
  BookOpen,
  Image as ImageIcon,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BulletinBoard from "@/components/BulletinBoard";
import FiturCepat from "@/components/FiturCepat";
import SelayangPandang from "@/components/SelayangPandang";
import AgendaKajianHome from "@/components/AgendaKajianHome";
import HeroSlideshow from "@/components/HeroSlideshow";

export const revalidate = 60;

export default async function Home() {
  const heroImages = await prisma.heroImage.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const selayangPandangPhotos = await prisma.gallery.findMany({
    where: { category: "Selayang Pandang" },
    orderBy: { createdAt: "asc" },
    take: 5,
  });

  const schedules = await prisma.studySchedule.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const activeBulletins = await prisma.bulletin.findMany({
    where: {
      isActive: true,
      expiryDate: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  const settings = await prisma.settings.findFirst();
  const runningText =
    settings?.runningText ||
    "Selamat datang di Website Resmi Masjid Jami' Ar-Rahman Cempaka, Plumbon. | Mari ramaikan kajian bakda Subuh setiap hari Ahad. | Salurkan infaq dan shodaqoh terbaik Anda melalui QRIS resmi masjid.";

  return (
    <div className="flex flex-col min-h-screen">

      {/* Running Text */}
      <div className="bg-primary-950 text-primary-100 py-2.5 overflow-hidden flex items-center border-b border-primary-800/60 relative z-30 mt-16 sm:mt-[72px] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center gap-3">
          <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
            <Megaphone className="w-3.5 h-3.5" />
            WARTA
          </span>
          <div className="relative flex overflow-x-hidden w-full whitespace-nowrap">
            <div
              className="animate-marquee text-xs sm:text-sm font-medium tracking-wide"
              style={{ animationDuration: `${settings?.runningTextSpeed || 30}s` }}
            >
              <span className="mr-12">{runningText}</span>
              <span className="mr-12">{runningText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden">
        {/* Background Slideshow */}
        <HeroSlideshow images={heroImages} />

        {/* Content */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: Text */}
            <div className="flex-1 space-y-7 text-center lg:text-left">
              {/* Bismillah Arabic */}
              <div className="animate-fade-in">
                <span className="text-2xl md:text-3xl font-light text-white/70 tracking-widest" style={{ fontFamily: "serif" }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>

              {/* Location badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium animate-fade-in backdrop-blur-sm"
                style={{ animationDelay: "0.1s" }}
              >
                <MapPin className="w-4 h-4 text-primary-300" />
                Perumahan Korpri Cempaka, Plumbon
              </div>

              {/* Title */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in leading-tight"
                style={{ animationDelay: "0.15s" }}
              >
                <span className="text-white drop-shadow-lg">Masjid Jami'</span>
                <br />
                <span className="bg-gradient-to-r from-primary-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Ar-Rahman
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-lg md:text-xl text-white/75 max-w-xl mx-auto lg:mx-0 animate-fade-in leading-relaxed"
                style={{ animationDelay: "0.2s" }}
              >
                Pusat ibadah, pendidikan, dan peradaban umat yang ramah, modern, dan menebarkan rahmat bagi seluruh alam.
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in"
                style={{ animationDelay: "0.25s" }}
              >
                <Link
                  href="/profil"
                  className="group px-7 py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-400 text-white font-semibold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-400/40 hover:scale-105 flex items-center gap-2 text-sm"
                >
                  Kenali Kami
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/kajian"
                  className="group px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold transition-all backdrop-blur-sm flex items-center gap-2 text-sm"
                >
                  <CalendarDays className="w-4 h-4" />
                  Lihat Agenda
                </Link>
              </div>

              {/* WhatsApp Channel */}
              <div
                className="flex items-center justify-center lg:justify-start animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <Link
                  href="https://whatsapp.com/channel/0029Vb8sbhPFcow73hKMgG3e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-[#25D366]/90 hover:bg-[#25D366] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm text-sm font-semibold"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Ikuti Saluran Resmi DKM Ar-Rahman
                </Link>
              </div>
            </div>

            {/* Right: Prayer Times Widget */}
            <div
              className="w-full max-w-sm lg:w-[400px] animate-fade-in flex-shrink-0"
              style={{ animationDelay: "0.4s" }}
            >
              <PrayerTimes />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-primary-800 py-5 border-y border-primary-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "1990", label: "Tahun Berdiri" },
              { value: "500+", label: "Jemaah Aktif" },
              { value: "12+", label: "Program Rutin" },
              { value: "4", label: "Unit Kegiatan" },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <p className="text-2xl md:text-3xl font-extrabold text-primary-200">{stat.value}</p>
                <p className="text-xs text-primary-400 mt-0.5 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bulletin Board */}
      {activeBulletins.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BulletinBoard bulletins={activeBulletins} />
          </div>
        </section>
      )}

      {/* Fitur Cepat */}
      <FiturCepat />

      {/* Agenda Kajian */}
      <AgendaKajianHome schedules={schedules} />

      {/* Selayang Pandang */}
      <SelayangPandang
        photos={selayangPandangPhotos}
        title={settings?.selayangPandangTitle || "Selayang Pandang"}
        description={
          settings?.selayangPandangDescription ||
          "Menengok sekilas keindahan arsitektur dan suasana nyaman di Masjid Jami' Ar-Rahman. Tempat ibadah yang menenangkan jiwa."
        }
      />

      {/* Hubungi Kami */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="w-full md:w-1/2 max-w-[480px] space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                  Hubungi Kami
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full mb-5" />
                <p className="text-gray-500 leading-relaxed">
                  Layanan informasi, aspirasi jamaah, dan kemitraan program Masjid Jami' Ar-Rahman.
                </p>
              </div>
              <ul className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: "Alamat",
                    value: settings?.alamat || "Perumahan Korpri Cempaka, Plumbon, Cirebon, Jawa Barat.",
                  },
                  {
                    icon: Phone,
                    label: "Telepon / WhatsApp",
                    value: settings?.telepon || "+62 812-3456-7890 (Pengurus DKM)",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: settings?.email || "info@masjidarrahman.com",
                  },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-gray-900 font-semibold text-sm mb-0.5">{item.label}</strong>
                      <span className="text-gray-600 text-sm">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="w-full md:w-1/2 max-w-[520px]">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15847.606208696881!2d108.4693498!3d-6.7498364!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1fc3f29ff4a3%3A0x80c84beab885f352!2sMASJID%20AR-RAHMAN!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

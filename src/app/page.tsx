import PrayerTimes from "@/components/PrayerTimes";
import { ArrowRight, MapPin, CalendarDays, Megaphone, Clock, User, BookOpen, Image as ImageIcon, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BulletinBoard from "@/components/BulletinBoard";
import FiturCepat from "@/components/FiturCepat";
import SelayangPandang from "@/components/SelayangPandang";
import AgendaKajianHome from "@/components/AgendaKajianHome";

export const revalidate = 60;

export default async function Home() {


  const selayangPandangPhotos = await prisma.gallery.findMany({
    where: { category: "Selayang Pandang" },
    orderBy: { createdAt: "asc" },
    take: 5
  });

  const schedules = await prisma.studySchedule.findMany({
    orderBy: { createdAt: "desc" },
    take: 3
  });

  const activeBulletins = await prisma.bulletin.findMany({
    where: {
      isActive: true,
      expiryDate: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" }
  });
  const settings = await prisma.settings.findFirst();
  const runningText = settings?.runningText || "Selamat datang di Website Resmi Masjid Jami' Ar-Rahman Cempaka, Plumbon. | Mari ramaikan kajian bakda Subuh setiap hari Ahad. | Salurkan infaq dan shodaqoh terbaik Anda melalui QRIS resmi masjid.";

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Running Text / Announcement */}
      <div className="bg-primary-900 text-primary-100 py-2 overflow-hidden flex items-center border-b border-primary-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center gap-3">
          <Megaphone className="w-5 h-5 flex-shrink-0 text-primary-400" />
          <div className="relative flex overflow-x-hidden w-full whitespace-nowrap">
            <div 
              className="animate-marquee inline-block text-sm font-medium" 
              style={{ animationDuration: `${settings?.runningTextSpeed || 25}s` }}
            >
              {runningText}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden py-20 lg:py-32 bg-[url('/masjid-bg.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-primary-950/85 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/5 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-700/50 text-primary-200 text-sm font-medium animate-fade-in backdrop-blur-sm">
              <MapPin className="w-4 h-4" />
              Perumahan Korpri Cempaka, Plumbon
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Masjid Jami' <span className="text-primary-400 block mt-2">Ar-Rahman</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Pusat ibadah, pendidikan, dan peradaban umat yang ramah, modern, dan menebarkan rahmat bagi seluruh alam.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link href="/profil" className="px-8 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold transition-all shadow-lg hover:shadow-primary-500/30 flex items-center gap-2">
                Kenali Kami
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/kajian" className="px-8 py-3 rounded-xl bg-transparent hover:bg-primary-900/50 border border-primary-500 text-primary-200 font-semibold transition-colors flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Agenda
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start pt-2 pb-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link
                href="https://whatsapp.com/channel/0029Vb8sbhPFcow73hKMgG3e"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-[#25D366]/30 hover:bg-[#20bd59] transition-all duration-300 group border border-[#25D366]/50"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-30 group-hover:animate-ping"></span>
                  <svg 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 relative z-10" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span className="font-semibold text-sm md:text-base tracking-wide">
                  Klik Ikuti Saluran Resmi DKM Ar Rahman
                </span>
              </Link>
            </div>
          </div>

          {/* Right Widget (Prayer Times) */}
          <div className="w-full max-w-md lg:w-[450px] animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <PrayerTimes />
          </div>
          
        </div>
      </section>

      {/* Quick Access Grid / Bulletin */}
      {activeBulletins.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BulletinBoard bulletins={activeBulletins} />
          </div>
        </section>
      )}
      {/* Fitur Cepat Section */}
      <FiturCepat />

      {/* Agenda Kajian Section */}
      <AgendaKajianHome schedules={schedules} />

      {/* Selayang Pandang Section */}
      <SelayangPandang 
        photos={selayangPandangPhotos} 
        title={settings?.selayangPandangTitle || "Selayang Pandang"}
        description={settings?.selayangPandangDescription || "Menengok sekilas keindahan arsitektur dan suasana nyaman di Masjid Jami' Ar-Rahman. Tempat ibadah yang menenangkan jiwa."}
      />

      {/* Hubungi Kami Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16">
            {/* Informasi Kontak */}
            <div className="w-full md:w-1/2 max-w-[450px] space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Hubungi Kami</h2>
                <div className="w-20 h-1.5 bg-primary-600 rounded-full mb-6"></div>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  Layanan informasi, aspirasi jamaah, dan kemitraan program Masjid Jami' Ar-Rahman. Hubungi kami melalui telepon, WhatsApp, atau email resmi DKM.
                </p>
              </div>
              
              <ul className="space-y-6 text-gray-700 pt-2">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-semibold mb-1">Alamat</strong>
                    <span>{settings?.alamat || "Perumahan Korpri Cempaka, Plumbon, Cirebon, Jawa Barat."}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-semibold mb-1">Telepon / WhatsApp</strong>
                    <span>{settings?.telepon || "+62 812-3456-7890 (Pengurus DKM)"}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-semibold mb-1">Email</strong>
                    <span>{settings?.email || "info@masjidarrahman.com"}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="w-full md:w-1/2 max-w-[500px] aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15847.606208696881!2d108.4693498!3d-6.7498364!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1fc3f29ff4a3%3A0x80c84beab885f352!2sMASJID%20AR-RAHMAN!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}

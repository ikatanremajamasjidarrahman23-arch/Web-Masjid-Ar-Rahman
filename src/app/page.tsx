import PrayerTimes from "@/components/PrayerTimes";
import { ArrowRight, MapPin, CalendarDays, Megaphone, Clock, User, BookOpen, Image as ImageIcon, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BulletinBoard from "@/components/BulletinBoard";
import FiturCepat from "@/components/FiturCepat";

export const revalidate = 60;

export default async function Home() {


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
          </div>

          {/* Right Widget (Prayer Times) */}
          <div className="w-full max-w-md lg:w-[450px] animate-fade-in" style={{ animationDelay: "0.4s" }}>
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



      {/* Hubungi Kami Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16">
            {/* Informasi Kontak */}
            <div className="w-full md:w-1/2 max-w-[450px] space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Hubungi Kami</h2>
                <div className="w-20 h-1.5 bg-primary-600 rounded-full mb-6"></div>
                <p className="text-gray-600 leading-relaxed">
                  Punya pertanyaan, masukan, atau ingin mengetahui lebih lanjut mengenai kegiatan di Masjid Jami' Ar-Rahman? Jangan ragu untuk menghubungi kami.
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

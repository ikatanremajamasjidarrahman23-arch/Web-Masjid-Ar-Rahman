import PrayerTimes from "@/components/PrayerTimes";
import { ArrowRight, MapPin, CalendarDays, Megaphone, Clock, User, BookOpen, Image as ImageIcon, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import KajianCard from "@/components/KajianCard";
import BulletinBoard from "@/components/BulletinBoard";

export const revalidate = 60;

export default async function Home() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    take: 4
  });

  const kajianList = await prisma.studySchedule.findMany({
    orderBy: { createdAt: "asc" },
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
          </div>

          {/* Right Widget (Prayer Times) */}
          <div className="w-full max-w-md lg:w-[450px] animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <PrayerTimes />
          </div>
          
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BulletinBoard bulletins={activeBulletins} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Galeri PHBI</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Jelajahi momen berkesan dan dokumentasi visual seputar Peringatan Hari Besar Islam serta berbagai kegiatan keagamaan
              </p>
              <Link href="/phbi" className="text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700 transition-colors">
                Lihat Galeri <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ikatan Remaja Masjid</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Berita kegiatan IRMAS, dari kajian rutin, kerja bakti, hingga formulir pendaftaran anggota baru untuk pemuda-pemudi.
              </p>
              <Link href="/irmas" className="text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700 transition-colors">
                Info IRMAS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kas & Donasi</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Laporan keuangan yang transparan untuk kas masuk dan keluar. Mari salurkan infaq terbaik Anda dengan mudah.
              </p>
              <Link href="/donasi" className="text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700 transition-colors">
                Laporan & QRIS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Jadwal Kajian / Kegiatan Terdekat */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Agenda Kegiatan</h2>
              <p className="text-gray-600 max-w-2xl">
                Informasi lengkap mengenai jadwal kajian, acara keagamaan, dan kegiatan rutin yang akan datang
              </p>
            </div>
            <Link href="/kajian" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
              Lihat Seluruh Agenda <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kajianList.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                Belum ada agenda kegiatan yang ditambahkan.
              </div>
            ) : (
              kajianList.map((kajian, index) => (
                <KajianCard key={kajian.id} kajian={kajian} variant="home" index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Cuplikan Galeri Terbaru */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-800/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-primary-900/40 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-4 text-primary-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Galeri Kegiatan</h2>
            <p className="text-gray-400">
              Momen-momen berharga dari berbagai kegiatan ibadah, sosial, dan perayaan hari besar Islam di Masjid Jami' Ar-Rahman.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {galleries.length === 0 ? (
              <div className="col-span-4 text-center py-10 text-gray-400">Belum ada foto galeri.</div>
            ) : (
              galleries.map((item, index) => {
                const isLarge = index === 0;
                const isWide = index === 3;
                const isSmall = index === 1 || index === 2;

                let containerClass = "relative group rounded-2xl overflow-hidden ";
                if (isLarge) containerClass += "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto";
                else if (isWide) containerClass += "col-span-2 aspect-[2/1] md:aspect-auto";
                else containerClass += "aspect-square";

                let gradientClass = "absolute inset-0 flex flex-col justify-end ";
                if (isLarge || isWide) gradientClass += "bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent p-" + (isLarge ? "6" : "5");
                else gradientClass += "bg-gradient-to-t from-gray-900/90 via-transparent to-transparent p-4";

                return (
                  <div key={item.id} className={containerClass}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className={gradientClass}>
                      {isLarge && <span className="text-primary-400 text-sm font-semibold mb-1">{item.category}</span>}
                      <h3 className={`${isLarge ? 'text-xl' : isWide ? 'text-lg' : 'text-sm'} font-bold text-white`}>{item.title}</h3>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-center">
            <Link href="/galeri" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors border border-gray-700">
              Lihat Galeri Lengkap <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

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

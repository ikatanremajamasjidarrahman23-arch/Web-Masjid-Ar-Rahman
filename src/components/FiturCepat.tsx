import { BookOpen, Compass, Tv, ExternalLink, BookMarked } from "lucide-react";
import Link from "next/link";

export default function FiturCepat() {
  const features = [
    {
      title: "Al-Qur'an Online",
      description: "Teks, Terjemahan & Audio Resmi Kemenag",
      href: "https://quran.kemenag.go.id/",
      icon: BookOpen,
      color: "bg-emerald-100 text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      title: "Kompas Kiblat",
      description: "Penunjuk Arah Kiblat Berbasis GPS",
      href: "https://www.al-habib.info/arah-kiblat/",
      icon: Compass,
      color: "bg-teal-100 text-teal-600",
      borderColor: "border-teal-200",
    },
    {
      title: "Live Mekkah",
      description: "Siaran Langsung Tanah Suci 24 Jam",
      href: "https://makkahlive.net/makkahlive.aspx",
      icon: Tv,
      color: "bg-primary-100 text-primary-600",
      borderColor: "border-primary-200",
    },
    {
      title: "Kitab Maulid",
      description: "Bacaan Diba', Simtuddurar & Barzanji",
      href: "https://quran.nu.or.id/maulid",
      icon: BookMarked,
      color: "bg-yellow-100 text-yellow-600", // Aksen Gold/Yellow
      borderColor: "border-yellow-200",
    },
  ];

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fitur Cepat</h2>
          <div className="w-16 h-1 bg-primary-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <a
                key={index}
                href={feature.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group bg-white p-5 md:p-6 rounded-2xl border ${feature.borderColor} shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col justify-between`}
              >
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-primary-500 transition-colors">
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

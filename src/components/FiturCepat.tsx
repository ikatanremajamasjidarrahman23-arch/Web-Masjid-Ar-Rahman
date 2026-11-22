import { BookOpen, Compass, Tv, ExternalLink, BookMarked } from "lucide-react";

const features = [
  {
    title: "Al-Qur'an Online",
    description: "Teks, Terjemahan & Audio Resmi Kemenag",
    href: "https://quran.kemenag.go.id/",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-emerald-500/30",
  },
  {
    title: "Kompas Kiblat",
    description: "Penunjuk Arah Kiblat Berbasis GPS",
    href: "https://www.al-habib.info/arah-kiblat/",
    icon: Compass,
    gradient: "from-cyan-500 to-blue-600",
    glow: "group-hover:shadow-cyan-500/30",
  },
  {
    title: "Live Mekkah",
    description: "Siaran Langsung Tanah Suci 24 Jam",
    href: "https://makkahlive.net/makkahlive.aspx",
    icon: Tv,
    gradient: "from-primary-500 to-primary-700",
    glow: "group-hover:shadow-primary-500/30",
  },
  {
    title: "Kitab Maulid",
    description: "Bacaan Diba', Simtuddurar & Barzanji",
    href: "https://quran.nu.or.id/maulid",
    icon: BookMarked,
    gradient: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-amber-500/30",
  },
];

export default function FiturCepat() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23064e3b'%3E%3Cpath d='M30 0 L38 12 L50 12 L42 20 L46 32 L30 24 L14 32 L18 20 L10 12 L22 12Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-primary-600 tracking-widest uppercase mb-3 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100">
            Layanan Digital
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Fitur Cepat Islami
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Akses cepat ke berbagai layanan islami pilihan untuk kelancaran ibadah Anda sehari-hari.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <a
                key={index}
                href={feature.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative bg-white rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-xl ${feature.glow} border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-1 flex flex-col`}
              >
                {/* External icon */}
                <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-tight group-hover:text-primary-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Kunjungi
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

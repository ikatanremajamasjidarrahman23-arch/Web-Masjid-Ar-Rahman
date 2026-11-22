import Link from "next/link";
import { BookOpen, Calendar, Heart, ShieldAlert, Sparkles, Video, Users, ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "Jadwal Kajian",
    desc: "Informasi jadwal majelis taklim dan kajian rutin mingguan.",
    href: "/kajian",
    icon: Calendar,
    color: "from-emerald-500 to-teal-600",
    badge: "Rutin",
  },
  {
    title: "Infaq & Donasi",
    desc: "Salurkan infaq pembangunan dan operasional masjid via QRIS resmi.",
    href: "/donasi",
    icon: Heart,
    color: "from-amber-500 to-orange-500",
    badge: "Berkah",
  },
  {
    title: "Galeri & PHBI",
    desc: "Dokumentasi perayaan hari besar islam dan kegiatan jamaah.",
    href: "/phbi",
    icon: Video,
    color: "from-sky-500 to-blue-600",
    badge: "Dokumentasi",
  },
  {
    title: "Remaja Masjid (IRMAS)",
    desc: "Wadah kepemudaan dan kreativitas generasi muda Ar-Rahman.",
    href: "/irmas",
    icon: Users,
    color: "from-purple-500 to-indigo-600",
    badge: "Pemuda",
  },
  {
    title: "Unit Kegiatan (UKM)",
    desc: "Lembaga otonom, TPA/TPQ, dan unit kemaslahatan umat.",
    href: "/ukm",
    icon: BookOpen,
    color: "from-rose-500 to-pink-600",
    badge: "Pendidikan",
  },
  {
    title: "Papan Buletin",
    desc: "Pengumuman resmi, warta jumat, dan laporan terkini DKM.",
    href: "/buletin",
    icon: ShieldAlert,
    color: "from-primary-600 to-emerald-700",
    badge: "Warta",
  },
];

export default function FiturCepat() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-primary-700 tracking-widest uppercase mb-3 bg-primary-100/70 px-4 py-1.5 rounded-full border border-primary-200">
            Layanan Jamaah
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Fitur & Layanan Utama
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
            Akses cepat ke berbagai informasi kegiatan dan layanan umat di Masjid Jami' Ar-Rahman.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative bg-white rounded-3xl p-7 border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                  <span>Buka Halaman</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

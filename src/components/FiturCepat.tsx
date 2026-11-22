import Link from "next/link";
import { BookOpen, Calendar, Heart, ShieldAlert, Video, Users, ArrowUpRight, BookMarked, Moon, Star, Mic2, Globe } from "lucide-react";

const features = [
  {
    title: "Jadwal Kajian",
    desc: "Informasi jadwal majelis taklim dan kajian rutin mingguan.",
    href: "/kajian",
    icon: Calendar,
    color: "from-emerald-500 to-teal-600",
    badge: "Rutin",
    external: false,
  },
  {
    title: "Infaq & Donasi",
    desc: "Salurkan infaq pembangunan dan operasional masjid via QRIS resmi.",
    href: "/donasi",
    icon: Heart,
    color: "from-amber-500 to-orange-500",
    badge: "Berkah",
    external: false,
  },
  {
    title: "Galeri & PHBI",
    desc: "Dokumentasi perayaan hari besar islam dan kegiatan jamaah.",
    href: "/phbi",
    icon: Video,
    color: "from-sky-500 to-blue-600",
    badge: "Dokumentasi",
    external: false,
  },
  {
    title: "Remaja Masjid (IRMAS)",
    desc: "Wadah kepemudaan dan kreativitas generasi muda Ar-Rahman.",
    href: "/irmas",
    icon: Users,
    color: "from-purple-500 to-indigo-600",
    badge: "Pemuda",
    external: false,
  },
  {
    title: "Unit Kegiatan (UKM)",
    desc: "Lembaga otonom, TPA/TPQ, dan unit kemaslahatan umat.",
    href: "/ukm",
    icon: BookOpen,
    color: "from-rose-500 to-pink-600",
    badge: "Pendidikan",
    external: false,
  },
  {
    title: "Papan Buletin",
    desc: "Pengumuman resmi, warta jumat, dan laporan terkini DKM.",
    href: "/buletin",
    icon: ShieldAlert,
    color: "from-primary-600 to-emerald-700",
    badge: "Warta",
    external: false,
  },
];

const islamicResources = [
  {
    title: "Al-Qur'an Kemenag RI",
    desc: "Baca Al-Qur'an digital resmi Kementerian Agama RI dengan terjemahan dan tafsir.",
    href: "https://quran.kemenag.go.id",
    icon: BookMarked,
    color: "from-green-600 to-emerald-700",
    badge: "Resmi Kemenag",
  },
  {
    title: "Kitab Maulid Berzanji",
    desc: "Baca dan pelajari Kitab Maulid Al-Barzanji secara digital — riwayat Nabi ﷺ dalam bait-bait indah.",
    href: "https://islamicbook.ws/id/al-barzanji",
    icon: Star,
    color: "from-yellow-500 to-amber-600",
    badge: "Sirah Nabawi",
  },
  {
    title: "Jadwal Sholat Online",
    desc: "Waktu sholat akurat untuk seluruh wilayah Indonesia dari Kemenag RI.",
    href: "https://bimasislam.kemenag.go.id/jadwalsholat",
    icon: Moon,
    color: "from-indigo-500 to-purple-600",
    badge: "Kemenag",
  },
  {
    title: "Khutbah & Ceramah",
    desc: "Koleksi khutbah Jumat dan ceramah islamiah dari ulama terpercaya.",
    href: "https://bimasislam.kemenag.go.id/khutbah",
    icon: Mic2,
    color: "from-teal-500 to-cyan-600",
    badge: "Ceramah",
  },
  {
    title: "Portal Islam Indonesia",
    desc: "Referensi islami terpercaya: fatwa, artikel, berita, dan informasi keislaman.",
    href: "https://mui.or.id",
    icon: Globe,
    color: "from-primary-600 to-teal-700",
    badge: "MUI",
  },
];

export default function FiturCepat() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── LAYANAN MASJID ── */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-primary-700 tracking-widest uppercase mb-3 bg-primary-100/70 px-4 py-1.5 rounded-full border border-primary-200">
            Layanan Jamaah
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Fitur &amp; Layanan Utama
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

        {/* ── SUMBER ISLAM TERPERCAYA ── */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-amber-700 tracking-widest uppercase mb-3 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
              Sumber Islami
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Referensi &amp; Fitur Islam
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
              Tautan langsung ke sumber-sumber Islam terpercaya — Al-Qur'an Kemenag, kitab maulid, jadwal sholat, dan lainnya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {islamicResources.map((res) => {
              const Icon = res.icon;
              return (
                <a
                  key={res.title}
                  href={res.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex gap-4 items-start"
                >
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-tr ${res.color} flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors leading-tight">
                        {res.title}
                      </h3>
                      <span className="flex-shrink-0 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        {res.badge}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {res.desc}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                      <span>Kunjungi</span>
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

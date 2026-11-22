"use client";

import { useState } from "react";
import { Radio, Tv2, Wifi, ExternalLink, Info, Volume2 } from "lucide-react";

const streams = [
  {
    id: "makkah",
    label: "Masjidil Haram – Makkah Al-Mukarramah",
    labelShort: "Live Makkah",
    flag: "🕋",
    description: "Siaran langsung 24 jam dari Masjidil Haram, Makkah Al-Mukarramah — Pusat Kiblat Umat Islam Dunia.",
    // Resmi dari Saudi TV / Makkah Live YouTube channel
    youtubeId: "jfKfPfyJRdk",
    color: "from-emerald-700 to-teal-800",
    badge: "24 Jam Live",
  },
  {
    id: "madinah",
    label: "Masjid Nabawi – Madinah Al-Munawwarah",
    labelShort: "Live Madinah",
    flag: "🌹",
    description: "Siaran langsung dari Masjid Nabawi, Madinah Al-Munawwarah — Kota Cahaya tempat makam Rasulullah ﷺ.",
    youtubeId: "3MlzNHRNNnk",
    color: "from-green-700 to-emerald-800",
    badge: "24 Jam Live",
  },
  {
    id: "quran",
    label: "Radio Al-Qur'an — Mekkah",
    labelShort: "Radio Qur'an",
    flag: "📻",
    description: "Siaran radio tilawah Al-Qur'an al-Karim 24 jam dari Makkah Al-Mukarramah.",
    youtubeId: "REo5PCXpyF0",
    color: "from-amber-600 to-orange-700",
    badge: "Radio Tilawah",
  },
];

export default function LiveMakkahClient() {
  const [active, setActive] = useState(streams[0]);

  return (
    <div className="bg-gray-950 min-h-screen pt-28 sm:pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
            Siaran Langsung
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Live Streaming <span className="text-emerald-400">Tanah Suci</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            Saksikan siaran langsung 24 jam dari Masjidil Haram Makkah Al-Mukarramah
            dan Masjid Nabawi Madinah Al-Munawwarah. Semoga mendekatkan hati kita kepada Allah ﷻ.
          </p>
        </div>

        {/* Channel Selector */}
        <div className="flex flex-wrap justify-center gap-3">
          {streams.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 border cursor-pointer ${
                active.id === s.id
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/50 scale-105"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{s.flag}</span>
              <span>{s.labelShort}</span>
              {active.id === s.id && (
                <span className="flex items-center gap-1 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold ml-1">
                  <Wifi className="w-2.5 h-2.5" /> LIVE
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Video Player */}
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
          {/* Channel Info Bar */}
          <div className={`bg-gradient-to-r ${active.color} px-5 py-3 flex items-center justify-between gap-4`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                LIVE
              </div>
              <span className="text-white font-bold text-sm truncate">{active.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline text-emerald-200 text-xs font-medium bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                {active.badge}
              </span>
              <Tv2 className="w-5 h-5 text-white/60" />
            </div>
          </div>

          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              key={active.id}
              src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&iv_load_policy=3`}
              title={active.label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Description Bar */}
          <div className="bg-gray-900 px-5 py-4 flex items-start gap-3 border-t border-white/5">
            <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs leading-relaxed">{active.description}</p>
            <a
              href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Volume2,
              title: "Suara Tidak Keluar?",
              desc: "Klik tombol unmute (🔊) di pojok kiri bawah video atau aktifkan suara di perangkat Anda.",
            },
            {
              icon: Wifi,
              title: "Video Buffering?",
              desc: "Pastikan koneksi internet stabil. Coba turunkan kualitas video di pengaturan ⚙️ YouTube.",
            },
            {
              icon: Radio,
              title: "Stream Offline?",
              desc: "Jika siaran terputus, coba refresh halaman atau pilih channel lain. Stream berjalan 24/7.",
            },
          ].map((tip) => {
            const Icon = tip.icon;
            return (
              <div key={tip.title} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm font-semibold">{tip.title}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Doa */}
        <div className="text-center py-6 border-t border-white/5">
          <p className="text-gray-500 text-xs mb-1">
            اللَّهُمَّ بَلِّغْنَا رَمَضَانَ وَالْبَيْتَ الْحَرَامَ
          </p>
          <p className="text-gray-600 text-xs italic">
            "Ya Allah, sampaikanlah kami ke Ramadhan dan Baitul Haram."
          </p>
        </div>

      </div>
    </div>
  );
}


import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import KajianCard from "./KajianCard";

interface AgendaKajianHomeProps {
  schedules: any[];
}

export default function AgendaKajianHome({ schedules }: AgendaKajianHomeProps) {
  if (!schedules || schedules.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-primary-950 to-primary-900 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="animate-fade-in">
            <span className="inline-block text-xs font-bold text-amber-300 tracking-widest uppercase mb-3 bg-primary-800/80 px-4 py-1.5 rounded-full border border-primary-700/60">
              Program Rutin
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              Agenda Kegiatan
            </h2>
            <p className="text-primary-200/90 max-w-xl text-sm leading-relaxed">
              Jadwal kajian rutin, majelis taklim, dan kegiatan keagamaan Masjid Jami' Ar-Rahman.
            </p>
          </div>

          <Link
            href="/kajian"
            className="group flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all backdrop-blur-sm shadow-sm"
          >
            <span>Semua Agenda</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule, idx) => (
            <KajianCard key={schedule.id} kajian={schedule} variant="home" index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

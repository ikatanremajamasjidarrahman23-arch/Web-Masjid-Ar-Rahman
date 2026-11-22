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
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M40 0 L50 15 L65 15 L55 25 L60 40 L40 30 L20 40 L25 25 L15 15 L30 15Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="animate-fade-in">
            <span className="inline-block text-xs font-bold text-primary-300 tracking-widest uppercase mb-3 bg-primary-800/60 px-4 py-1.5 rounded-full border border-primary-700/50">
              Program Rutin
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              Agenda Kegiatan
            </h2>
            <p className="text-primary-300 max-w-xl">
              Jadwal kajian, majelis taklim, dan kegiatan rutin Masjid Jami' Ar-Rahman.
            </p>
          </div>
          <Link
            href="/kajian"
            className="group flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all"
          >
            Semua Agenda
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {schedules.map((schedule) => (
            <KajianCard key={schedule.id} kajian={schedule} variant="home" />
          ))}
        </div>
      </div>
    </section>
  );
}

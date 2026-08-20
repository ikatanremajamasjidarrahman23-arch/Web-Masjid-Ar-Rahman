import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import KajianCard from "./KajianCard";

interface AgendaKajianHomeProps {
  schedules: any[];
}

export default function AgendaKajianHome({ schedules }: AgendaKajianHomeProps) {
  if (!schedules || schedules.length === 0) return null;

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="animate-fade-in text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Agenda Kegiatan
            </h2>
            <div className="w-20 h-1.5 bg-primary-600 rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl">
              Informasi jadwal kajian, majelis taklim, dan kegiatan rutin yang akan diselenggarakan di Masjid Jami' Ar-Rahman.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {schedules.map((schedule) => (
            <KajianCard key={schedule.id} kajian={schedule} variant="home" />
          ))}
        </div>
      </div>
    </section>
  );
}

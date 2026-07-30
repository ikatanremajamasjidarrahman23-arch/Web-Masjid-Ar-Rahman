import { prisma } from "@/lib/prisma";
import { BookOpen } from "lucide-react";
import KajianCard from "@/components/KajianCard";
export const revalidate = 60; // Cache for 60 seconds

export default async function KajianPage() {
  const schedules = await prisma.studySchedule.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 text-primary-600 shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Agenda Kegiatan</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Informasi lengkap mengenai jadwal kajian, acara keagamaan, dan kegiatan rutin yang akan datang
          </p>
        </div>

        {/* Schedule List */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {schedules.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg">Belum ada agenda kegiatan yang ditambahkan.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {schedules.map((schedule) => (
                <KajianCard key={schedule.id} kajian={schedule} variant="page" />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

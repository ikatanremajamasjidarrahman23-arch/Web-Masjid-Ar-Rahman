"use client";

import { Megaphone, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useState } from "react";

type Bulletin = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  expiryDate: Date;
  createdAt: Date;
  imagePosition?: string;
};

export default function BulletinBoard({ bulletins }: { bulletins: Bulletin[] }) {
  const [activeBulletin, setActiveBulletin] = useState<Bulletin | null>(null);

  if (!bulletins || bulletins.length === 0) return null;

  return (
    <>
      <div className="rounded-3xl overflow-hidden border border-primary-100/50 shadow-sm bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Papan Buletin</h2>
            <p className="text-xs text-primary-200">Informasi dan pengumuman terkini dari DKM</p>
          </div>
          <span className="ml-auto px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/20">
            {bulletins.length} Aktif
          </span>
        </div>

        {/* Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bulletins.map((bulletin) => (
              <div
                key={bulletin.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => setActiveBulletin(bulletin)}
              >
                {bulletin.imageUrl && (
                  <div className="h-44 w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bulletin.imageUrl}
                      alt={bulletin.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: bulletin.imagePosition || "center" }}
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary-600 mb-2.5">
                    <CalendarIcon size={12} />
                    {format(new Date(bulletin.createdAt), "dd MMM yyyy", { locale: idLocale })}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors leading-snug">
                    {bulletin.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                    {bulletin.description}
                  </p>
                  <div className="mt-3 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Baca selengkapnya →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {activeBulletin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveBulletin(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-3xl">
              <span className="flex items-center gap-2 text-sm font-semibold text-primary-700">
                <Megaphone className="w-4 h-4" /> Buletin
              </span>
              <button
                onClick={() => setActiveBulletin(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {activeBulletin.imageUrl && (
              <div className="w-full bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeBulletin.imageUrl}
                  alt={activeBulletin.title}
                  className="w-full max-h-[400px] object-contain"
                  style={{ objectPosition: activeBulletin.imagePosition || "center" }}
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CalendarIcon size={12} />
                {format(new Date(activeBulletin.createdAt), "EEEE, dd MMMM yyyy", { locale: idLocale })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{activeBulletin.title}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{activeBulletin.description}</p>
              <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
                Berlaku hingga: {format(new Date(activeBulletin.expiryDate), "dd MMMM yyyy", { locale: idLocale })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

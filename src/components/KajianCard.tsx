"use client";

import { useState } from "react";
import { Clock, User, BookOpen, MapPin, X, Calendar, ChevronRight } from "lucide-react";
import { StudySchedule } from "@prisma/client";

interface KajianCardProps {
  kajian: StudySchedule;
  variant?: "home" | "page";
  index?: number;
}

export default function KajianCard({ kajian, variant = "page", index = 0 }: KajianCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const Modal = () => {
    if (!isOpen) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 rounded-t-3xl">
            <h3 className="text-lg font-bold text-gray-900">Detail Kajian</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {kajian.imageUrl && (
            <div className="w-full bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={kajian.imageUrl} alt={kajian.title} className="w-full max-h-[400px] object-contain" />
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100 mb-3">
                Kajian Rutin
              </span>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{kajian.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pemateri</p>
                  <p className="font-semibold text-gray-900 text-sm">{kajian.speaker}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Waktu</p>
                  <p className="font-semibold text-gray-900 text-sm">{kajian.schedule}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <p className="font-semibold text-gray-900 text-sm">{kajian.location}</p>
                </div>
              </div>
            </div>

            {kajian.description && (
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-2">Deskripsi Kajian</h4>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{kajian.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (variant === "home") {
    return (
      <>
        <div
          onClick={() => setIsOpen(true)}
          className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-[320px] hover:-translate-y-1"
        >
          {kajian.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={kajian.imageUrl}
              alt={kajian.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900">
              <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white/10" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
            <span className="self-start px-3 py-1 text-xs font-bold rounded-full bg-primary-500/80 backdrop-blur-sm text-white border border-primary-400/30 mb-3">
              Kajian Rutin
            </span>
            <h4 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary-200 transition-colors line-clamp-2 leading-tight">
              {kajian.title}
            </h4>
            <div className="space-y-1 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary-300 shrink-0" />
                <span className="line-clamp-1">{kajian.speaker}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary-300 shrink-0" />
                <span className="line-clamp-1">{kajian.schedule}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-200 opacity-0 group-hover:opacity-100 transition-opacity">
              Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
        <Modal />
      </>
    );
  }

  // Page variant
  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 group overflow-hidden flex flex-col cursor-pointer h-full hover:-translate-y-1"
      >
        {kajian.imageUrl ? (
          <div className="overflow-hidden h-48 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={kajian.imageUrl} alt={kajian.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
        ) : (
          <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-400 w-full" />
        )}

        <div className="p-6 flex-1 flex flex-col">
          <span className="self-start px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100 mb-3">
            {kajian.schedule}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
            {kajian.title}
          </h3>

          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium line-clamp-1">{kajian.speaker}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="line-clamp-1">{kajian.location}</span>
            </div>
          </div>

          {kajian.description ? (
            <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{kajian.description}</p>
          ) : (
            <div className="flex-1" />
          )}

          <div className="pt-4 border-t border-gray-50 flex items-center justify-center gap-1 text-primary-600 text-sm font-semibold group-hover:gap-2 transition-all">
            Lihat Detail
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
}

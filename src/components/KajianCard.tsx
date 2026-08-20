"use client";

import { useState } from "react";
import { Clock, User, BookOpen, MapPin, X, Calendar } from "lucide-react";
import { StudySchedule } from "@prisma/client";

interface KajianCardProps {
  kajian: StudySchedule;
  variant?: "home" | "page";
  index?: number;
}

export default function KajianCard({ kajian, variant = "page", index = 0 }: KajianCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Modal Component
  const Modal = () => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
            <h3 className="text-xl font-bold text-gray-900">Detail Kajian</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {kajian.imageUrl && (
            <div className="w-full bg-gray-100 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={kajian.imageUrl} alt={kajian.title} className="w-full max-h-[500px] object-contain" />
            </div>
          )}
          
          <div className="p-6 space-y-6">
            <div>
              <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100 mb-3">
                Kajian Rutin
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{kajian.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                   <User className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-500">Pemateri</p>
                   <p className="font-semibold text-gray-900">{kajian.speaker}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                   <Calendar className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-500">Waktu</p>
                   <p className="font-semibold text-gray-900">{kajian.schedule}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 md:col-span-2">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                   <MapPin className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-500">Lokasi</p>
                   <p className="font-semibold text-gray-900">{kajian.location}</p>
                 </div>
               </div>
            </div>

            {kajian.description && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Deskripsi Kajian</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {kajian.description}
                </div>
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
          className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col h-[320px]"
        >
          {kajian.imageUrl ? (
            <img src={kajian.imageUrl} alt={kajian.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/20" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent transition-opacity duration-300" />
          
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
            <div className="flex justify-between items-start mb-3">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-500/80 backdrop-blur-md text-white border border-primary-400/30">
                Kajian Rutin
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary-300 transition-colors line-clamp-2 leading-tight drop-shadow-md">
              {kajian.title}
            </h4>
            <div className="space-y-1.5 text-sm text-gray-200 mt-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary-400 shrink-0" /> <span className="line-clamp-1">{kajian.speaker}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400 shrink-0" /> <span className="line-clamp-1">{kajian.schedule}</span>
              </div>
            </div>
          </div>
        </div>
        <Modal />
      </>
    );
  }

  // default variant (page)
  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group overflow-hidden flex flex-col cursor-pointer h-full"
      >
        {kajian.imageUrl ? (
          <div className="overflow-hidden h-48 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={kajian.imageUrl} alt={kajian.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
        ) : (
          <div className="h-2 bg-primary-500 w-full" />
        )}
        <div className="p-6 flex-1 flex flex-col bg-white relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100">
              {kajian.schedule}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2">
            {kajian.title}
          </h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium line-clamp-1">{kajian.speaker}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="line-clamp-1">{kajian.location}</span>
            </div>
          </div>

          {kajian.description ? (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
              {kajian.description}
            </p>
          ) : (
            <div className="flex-1" />
          )}
          
          <div className="pt-4 border-t border-gray-50 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all text-center mt-auto transform translate-y-2 group-hover:translate-y-0">
            Lihat detail kajian
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
}

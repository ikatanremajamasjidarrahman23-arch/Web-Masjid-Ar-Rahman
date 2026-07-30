"use client";

import { Megaphone, X, Calendar as CalendarIcon, Clock } from "lucide-react";
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
};

export default function BulletinBoard({ bulletins }: { bulletins: Bulletin[] }) {
  const [activeBulletin, setActiveBulletin] = useState<Bulletin | null>(null);

  if (!bulletins || bulletins.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-12">
        <div className="bg-orange-50 border-b border-orange-100 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Papan Buletin</h2>
            <p className="text-sm text-gray-600">Informasi dan berita terkini dari DKM Masjid Ar-Rahman.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bulletins.map((bulletin) => (
              <div 
                key={bulletin.id} 
                className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all cursor-pointer hover:shadow-md"
                onClick={() => setActiveBulletin(bulletin)}
              >
                {bulletin.imageUrl && (
                  <div className="h-48 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={bulletin.imageUrl} 
                      alt={bulletin.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-orange-600 mb-3">
                    <CalendarIcon size={14} />
                    {format(new Date(bulletin.createdAt), "dd MMM yyyy", { locale: idLocale })}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {bulletin.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {bulletin.description}
                  </p>
                  
                  <div className="inline-flex items-center text-sm font-semibold text-primary-600">
                    Baca selengkapnya
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Detail Buletin */}
      {activeBulletin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveBulletin(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveBulletin(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto overflow-x-hidden flex-1 p-0">
              {activeBulletin.imageUrl && (
                <div className="w-full h-64 sm:h-80 relative bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeBulletin.imageUrl} alt={activeBulletin.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-orange-500" />
                    Dipublikasi: {format(new Date(activeBulletin.createdAt), "dd MMMM yyyy", { locale: idLocale })}
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  {activeBulletin.title}
                </h2>
                
                <div className="prose prose-orange max-w-none">
                  {activeBulletin.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Informasi ini berlaku hingga {format(new Date(activeBulletin.expiryDate), "dd MMMM yyyy, HH:mm", { locale: idLocale })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

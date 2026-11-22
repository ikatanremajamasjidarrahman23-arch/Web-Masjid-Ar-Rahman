import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

interface SelayangPandangProps {
  photos?: any[];
  title?: string;
  description?: string;
}

export default function SelayangPandang({ photos = [], title, description }: SelayangPandangProps) {
  const defaultPhotos = [
    { id: "1", title: "Tampak Depan Masjid", imageUrl: "/masjid-bg.jpg", imagePosition: "center", className: "col-span-1 md:col-span-2 row-span-2 h-72 md:h-96" },
    { id: "2", title: "Ruang Utama Sholat", imageUrl: "/masjid-bg.jpg", imagePosition: "center", className: "col-span-1 h-44 md:h-48" },
    { id: "3", title: "Kegiatan Pengajian Rutin", imageUrl: "/masjid-bg.jpg", imagePosition: "center", className: "col-span-1 h-44 md:h-48" },
    { id: "4", title: "Area Wudhu & Selasar", imageUrl: "/masjid-bg.jpg", imagePosition: "center", className: "col-span-1 md:col-span-2 h-44 md:h-48" },
  ];

  const displayPhotos =
    photos.length > 0
      ? photos.map((p, i) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
          imagePosition: p.imagePosition,
          className: defaultPhotos[i % defaultPhotos.length].className,
        }))
      : defaultPhotos;

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-xs font-bold text-primary-700 tracking-widest uppercase mb-3 bg-primary-100/70 px-4 py-1.5 rounded-full border border-primary-200">
              Dokumentasi Visual
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              {title || "Selayang Pandang"}
            </h2>
            <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
              {description ||
                "Menengok sekilas keindahan arsitektur dan suasana nyaman di Masjid Jami' Ar-Rahman. Tempat ibadah yang menenangkan jiwa."}
            </p>
          </div>

          <Link
            href="/galeri"
            className="group flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-primary-50 text-primary-700 font-semibold text-sm border border-gray-200 shadow-sm transition-all"
          >
            <span>Semua Foto</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayPhotos.map((photo, index) => (
            <div
              key={photo.id || index}
              className={`group relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${photo.className}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: photo.imagePosition || "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <span className="text-xs text-primary-300 font-medium block mb-1">Masjid Jami' Ar-Rahman</span>
                  <p className="text-white font-bold text-base md:text-lg leading-tight">{photo.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

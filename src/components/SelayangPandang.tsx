import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";

type Photo = { id: string; title: string; imageUrl: string; imagePosition?: string };

type Props = {
  photos?: Photo[];
  title?: string;
  description?: string;
};

export default function SelayangPandang({ photos: dbPhotos, title, description }: Props) {
  const defaultPhotos = [
    { src: "/masjid-bg.jpg", className: "col-span-2 row-span-2 md:col-span-1 md:row-span-2" },
    { src: "https://images.unsplash.com/photo-1564683214964-15de16ce9b1f?q=80&w=800&auto=format&fit=crop", className: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop", className: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1591462002166-51f7bb0d2919?q=80&w=800&auto=format&fit=crop", className: "col-span-2 md:col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop", className: "col-span-2 md:col-span-1 row-span-1" },
  ];

  const photos =
    dbPhotos && dbPhotos.length > 0
      ? dbPhotos.map((p, i) => ({
          src: p.imageUrl,
          imagePosition: p.imagePosition,
          className: defaultPhotos[i % defaultPhotos.length].className,
        }))
      : defaultPhotos;

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23064e3b'%3E%3Cpath d='M30 0 L38 12 L50 12 L42 20 L46 32 L30 24 L14 32 L18 20 L10 12 L22 12Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-xs font-bold text-primary-600 tracking-widest uppercase mb-3 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100">
              Galeri Masjid
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              {title || "Selayang Pandang"}
            </h2>
            <p className="text-gray-500 max-w-xl">
              {description || "Menengok sekilas keindahan arsitektur dan suasana nyaman di Masjid Jami' Ar-Rahman."}
            </p>
          </div>
          <Link
            href="/galeri"
            className="group flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-md shadow-primary-500/20"
          >
            <Images className="w-4 h-4" />
            Lihat Semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl group shadow-sm hover:shadow-xl transition-all duration-500 ${photo.className}`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

              <img
                src={photo.src}
                alt="Galeri Masjid"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                style={{ objectPosition: (photo as any).imagePosition || "center" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { prisma } from "@/lib/prisma";
import { Camera } from "lucide-react";
import GalleryClient, { GalleryItem } from "./GalleryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi - Masjid Jami' Ar-Rahman",
  description: "Dokumentasi visual terpadu kegiatan ibadah harian serta perayaan Hari Besar Islam (PHBI) di Masjid Jami' Ar-Rahman Cempaka.",
};

export const revalidate = 60; // Cache 60 detik

export default async function GalleryPublicPage() {
  // 1. Ambil data galeri umum
  const rawGalleries = await prisma.gallery.findMany({
    where: {
      category: {
        not: "Selayang Pandang",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Ambil data event PHBI beserta seluruh medianya
  const rawPhbiEvents = await prisma.phbiEvent.findMany({
    include: {
      media: true,
    },
    orderBy: { date: "desc" },
  });

  // 3. Normalisasi data galeri umum
  const galleryItems: GalleryItem[] = rawGalleries.map((g) => {
    const isPhbi = g.category.toUpperCase().includes("PHBI");
    return {
      id: g.id,
      title: g.title === "-" || !g.title ? "Dokumentasi Kegiatan" : g.title,
      imageUrl: g.imageUrl,
      category: isPhbi ? "PHBI" : g.category || "Kegiatan Masjid",
      badge: isPhbi ? "PHBI" : "Kegiatan Masjid",
      date: g.createdAt.toISOString(),
      imagePosition: g.imagePosition || "center",
      linkGdrive: g.linkGdrive || null,
    };
  });

  // 4. Normalisasi media PHBI menjadi item galeri
  const phbiItems: GalleryItem[] = [];
  rawPhbiEvents.forEach((event) => {
    event.media.forEach((m, idx) => {
      if (m.type === "IMAGE" || !m.type) {
        phbiItems.push({
          id: m.id,
          title: event.title,
          imageUrl: m.url,
          category: "PHBI",
          badge: "PHBI",
          date: event.date ? event.date.toISOString() : null,
          description: event.description,
          // Sematkan link GDrive pada setiap foto acara ini (khususnya foto pertama)
          linkGdrive: event.linkMore || null,
        });
      }
    });
  });

  // 5. Gabungkan seluruh foto dan urutkan
  const allItems = [...phbiItems, ...galleryItems];

  return (
    <div className="bg-gray-50 min-h-screen pt-28 sm:pt-32 pb-16 relative overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-200/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header Title */}
        <div className="text-center animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-5 text-primary-600 border border-gray-100 shadow-xs">
            <Camera className="w-8 h-8" />
          </div>
          <span className="inline-block text-xs font-bold text-primary-700 tracking-widest uppercase mb-2 bg-primary-100/70 px-4 py-1.5 rounded-full border border-primary-200">
            Arsip Dokumentasi Terpadu
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Galeri Masjid &amp; PHBI
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kumpulan momen berkesan dari berbagai kegiatan ibadah, kajian, sosial, dan Peringatan Hari Besar Islam (PHBI) di Masjid Jami' Ar-Rahman.
          </p>
        </div>

        {/* Client Component dengan Tab Filter, Lightbox & Download */}
        <GalleryClient initialItems={allItems} />

      </div>
    </div>
  );
}

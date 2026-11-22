"use client";

import { useState, useEffect, useCallback } from "react";

type HeroImage = {
  id: string;
  imageUrl: string;
  caption?: string | null;
};

const FALLBACK_IMAGES = [
  { id: "fallback-1", imageUrl: "/masjid-bg.jpg", caption: null },
];

const KEN_BURNS_CLASSES = [
  "scale-105 translate-x-1 translate-y-0.5",
  "scale-105 -translate-x-1 translate-y-1",
  "scale-105 translate-x-0.5 -translate-y-0.5",
  "scale-105 -translate-x-0.5 translate-y-0.5",
];

export default function HeroSlideshow({ images }: { images: HeroImage[] }) {
  const slides = images.length > 0 ? images : FALLBACK_IMAGES;
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (transitioning || idx === current) return;
      setTransitioning(true);
      setPrev(current);
      setCurrent(idx);
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 1200);
    },
    [current, transitioning]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, slides.length, goTo]);

  return (
    <>
      {/* Slide layers - Foto Bersih & Tajam (Tanpa Efek Bintang/Pola Aneh) */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          const isPrev = idx === prev;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                isActive ? "opacity-100 z-10" : isPrev ? "opacity-0 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.caption || "Masjid Jami' Ar-Rahman"}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                  isActive ? KEN_BURNS_CLASSES[idx % KEN_BURNS_CLASSES.length] : "scale-100"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Gradien Gelap Alami & Bersih (Menjaga teks terbaca sempurna, tanpa pola/bintang) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30 z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent z-20" />

      {/* Indikator Titik Slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === current
                  ? "w-7 h-2 bg-amber-400"
                  : "w-2 h-2 bg-white/40 hover:bg-white/80"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

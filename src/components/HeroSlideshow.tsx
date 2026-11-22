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
  "scale-110 translate-x-2 translate-y-1",
  "scale-110 -translate-x-2 translate-y-2",
  "scale-105 translate-x-1 -translate-y-1",
  "scale-110 -translate-x-1 translate-y-1",
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
      }, 1500);
    },
    [current, transitioning]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [current, slides.length, goTo]);

  return (
    <>
      {/* Slide layers */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          const isPrev = idx === prev;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                isActive ? "opacity-100 z-10" : isPrev ? "opacity-0 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.caption || "Masjid Ar-Rahman"}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${
                  isActive ? KEN_BURNS_CLASSES[idx % KEN_BURNS_CLASSES.length] : "scale-100"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-20" />

      {/* Islamic geometric pattern overlay */}
      <div
        className="absolute inset-0 z-20 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M40 0 L50 15 L65 15 L55 25 L60 40 L40 30 L20 40 L25 25 L15 15 L30 15Z'/%3E%3Cpath d='M0 40 L10 55 L0 70 L15 65 L20 80 L30 65 L40 70 L30 55 L40 40 L25 45 L20 30Z'/%3E%3Cpath d='M80 40 L70 55 L80 70 L65 65 L60 80 L50 65 L40 70 L50 55 L40 40 L55 45 L60 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Dots indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}


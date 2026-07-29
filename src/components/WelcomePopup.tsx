"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface WelcomePopupProps {
  imageUrl: string | null;
  isActive: boolean;
  duration: number; // in seconds
}

export default function WelcomePopup({ imageUrl, isActive, duration }: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Check if popup should be shown
    if (!isActive || !imageUrl) return;
    
    // Check session storage so it only shows once per session
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
    if (hasSeenPopup) return;

    // Show popup
    setIsOpen(true);
    setIsRendered(true);
    sessionStorage.setItem("hasSeenPopup", "true");

    // Auto-close after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        closePopup();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, imageUrl, duration]);

  const closePopup = () => {
    setIsOpen(false);
    // Wait for fade out animation before unmounting
    setTimeout(() => {
      setIsRendered(false);
    }, 300);
  };

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closePopup}
      />
      
      {/* Popup Content */}
      <div 
        className={`relative z-10 max-w-3xl w-full flex flex-col items-center justify-center transition-all duration-300 ease-out ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"}`}
      >
        <button 
          onClick={closePopup}
          className="absolute -top-12 right-0 md:-right-12 md:top-0 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-colors"
          aria-label="Tutup Pengumuman"
        >
          <X className="w-8 h-8" />
        </button>
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl!} 
          alt="Pengumuman Masjid" 
          className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
        />
      </div>
    </div>
  );
}

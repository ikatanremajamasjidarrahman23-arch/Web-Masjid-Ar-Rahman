"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PlayCircle, Image as ImageIcon, X, Download } from "lucide-react";

export default function PhbiGalleryClient({ media }: { media: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = async (url: string) => {
    try {
      // Create a blob from the URL to force download instead of navigating
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      // Get filename from URL or use a default
      const filename = url.split('/').pop() || "dokumentasi-phbi.jpg";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (e) {
      // Fallback if fetch fails (e.g., CORS issues from Cloudinary, although Cloudinary usually allows it)
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-200 aspect-video">
            {item.type === "IMAGE" ? (
              <div 
                className="w-full h-full cursor-pointer"
                onClick={() => setSelectedImage(item.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.url} 
                  alt="Dokumentasi PHBI" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-lg text-white backdrop-blur-sm group-hover:bg-primary-600 transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              </div>
            ) : (
              <div className="w-full h-full relative">
                <iframe 
                  src={`https://www.youtube.com/embed/${item.url}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
                <div className="absolute top-2 right-2 bg-red-600/90 p-1.5 rounded-lg text-white backdrop-blur-sm pointer-events-none">
                  <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full h-[100vh] flex flex-col items-center justify-center p-4">
            {/* Top Bar with Close and Download */}
            <div className="absolute top-0 right-0 w-full flex justify-end gap-3 p-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
              <button 
                onClick={() => handleDownload(selectedImage)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors flex items-center gap-2 px-4"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">Unduh</span>
              </button>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Image */}
            <div className="relative w-full h-[85vh] flex items-center justify-center mt-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImage} 
                alt="Zoomed Photo" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          {/* Backdrop click to close */}
          <div className="absolute inset-0 z-[-1]" onClick={() => setSelectedImage(null)} />
        </div>,
        document.body
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function TextSizeAdjuster() {
  const [scale, setScale] = useState(100); // percentage

  useEffect(() => {
    // load saved scale on mount
    const savedScale = localStorage.getItem("site-text-scale");
    if (savedScale) {
      const numScale = parseInt(savedScale, 10);
      setScale(numScale);
      document.documentElement.style.fontSize = `${numScale}%`;
    }
  }, []);

  const changeScale = (amount: number) => {
    let newScale = scale + amount;
    // limit scale between 70% and 150%
    if (newScale < 70) newScale = 70;
    if (newScale > 150) newScale = 150;
    
    setScale(newScale);
    document.documentElement.style.fontSize = `${newScale}%`;
    localStorage.setItem("site-text-scale", newScale.toString());
  };

  const resetScale = () => {
    setScale(100);
    document.documentElement.style.fontSize = ""; // reset to browser default
    localStorage.setItem("site-text-scale", "100");
  };

  return (
    <div className="mt-4 pt-4 border-t border-primary-800 flex flex-col gap-2">
      <span className="text-xs text-primary-300 font-medium">Penyesuaian Ukuran Layar</span>
      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => changeScale(-10)} 
          className="p-1.5 bg-primary-900 border border-primary-700 text-primary-200 rounded-md hover:bg-primary-800 transition-colors"
          title="Perkecil Ukuran"
          aria-label="Perkecil Ukuran"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={resetScale} 
          className="px-2 py-1.5 bg-primary-900 border border-primary-700 text-primary-200 rounded-md hover:bg-primary-800 transition-colors text-xs font-semibold w-12 text-center flex justify-center items-center gap-1"
          title="Reset Ukuran"
          aria-label="Reset Ukuran"
        >
          {scale === 100 ? <RotateCcw className="w-3.5 h-3.5" /> : `${scale}%`}
        </button>
        <button 
          onClick={() => changeScale(10)} 
          className="p-1.5 bg-primary-900 border border-primary-700 text-primary-200 rounded-md hover:bg-primary-800 transition-colors"
          title="Perbesar Ukuran"
          aria-label="Perbesar Ukuran"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function NavbarDateWidget() {
  const [hijriDate, setHijriDate] = useState("");
  const [masehiDate, setMasehiDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const today = new Date();
      // Koreksi waktu: dikurangi 10 menit
      today.setMinutes(today.getMinutes() - 10);
    
    // Format Hijri Date
    try {
      const hijriFormatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      const formattedHijri = hijriFormatter.format(today);
      setHijriDate(formattedHijri.endsWith("H") || formattedHijri.endsWith("AH") ? formattedHijri : formattedHijri + " H");
    } catch (e) {
      setHijriDate("");
    }

    // Format Masehi Date
    const masehiFormatter = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    setMasehiDate(masehiFormatter.format(today));

    // Format Time
    const timeFormatter = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setCurrentTime(timeFormatter.format(today).replace(/\./g, ":"));
  };

  updateTime();
  const interval = setInterval(updateTime, 1000);
  return () => clearInterval(interval);
}, []);

  if (!hijriDate || !masehiDate) {
    return <div className="animate-pulse w-48 h-10 bg-primary-800 rounded-lg hidden md:block"></div>;
  }

  return (
    <div className="flex items-center gap-3 text-right bg-primary-800/50 p-2 pr-3 rounded-xl border border-primary-600/30">
      <div className="hidden md:block">
        <p className="text-sm font-bold text-white leading-tight">{hijriDate}</p>
        <div className="flex items-center justify-end gap-2 text-xs">
          <span className="font-mono text-primary-200">{currentTime}</span>
          <span className="text-primary-300">&bull;</span>
          <span className="text-primary-200">{masehiDate}</span>
        </div>
      </div>
      <div className="p-2 bg-primary-700 rounded-lg text-primary-200 shadow-inner">
        <Calendar className="w-5 h-5" />
      </div>
    </div>
  );
}

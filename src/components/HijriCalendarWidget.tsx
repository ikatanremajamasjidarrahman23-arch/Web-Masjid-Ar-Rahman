"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function HijriCalendarWidget() {
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
    return <div className="animate-pulse h-16 bg-primary-900 rounded-xl"></div>;
  }

  return (
    <div className="bg-primary-900/50 rounded-2xl p-5 border border-primary-800/50 shadow-inner">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-800 rounded-xl text-primary-300">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm text-primary-300 font-medium">Penanggalan Hari Ini</h4>
            <span className="font-mono text-sm font-medium text-primary-400 bg-primary-950/50 px-2 py-0.5 rounded">{currentTime}</span>
          </div>
          <p className="text-xl font-bold text-white mb-1">{hijriDate}</p>
          <p className="text-sm text-primary-200">{masehiDate}</p>
        </div>
      </div>
    </div>
  );
}

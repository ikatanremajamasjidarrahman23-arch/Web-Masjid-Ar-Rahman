"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";

export default function NavbarDateWidget() {
  const [hijriDate, setHijriDate] = useState("");
  const [masehiDate, setMasehiDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const timeOffsetRef = useRef<number>(0);

  useEffect(() => {
    const syncTime = async () => {
      try {
        const t1 = Date.now();
        const res = await axios.get("/api/time");
        const t2 = Date.now();
        const serverTime = res.data.time || Date.now();
        const networkDelay = (t2 - t1) / 2;
        timeOffsetRef.current = (serverTime + networkDelay) - Date.now();
      } catch (err) {
        console.error("Gagal sinkronisasi waktu:", err);
      }
    };
    syncTime();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const today = new Date(Date.now() + timeOffsetRef.current);
      
      const hijriDateObj = new Date(today);
      if (hijriDateObj.getHours() >= 18) {
        hijriDateObj.setDate(hijriDateObj.getDate() + 1);
      }
    
    // Format Hijri Date
    try {
      const hijriFormatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
      });
      const parts = hijriFormatter.formatToParts(hijriDateObj);
      const day = parts.find(p => p.type === 'day')?.value || "1";
      const monthNum = parts.find(p => p.type === 'month')?.value || "1";
      const year = parts.find(p => p.type === 'year')?.value || "1445";

      const islamicMonths = [
        "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir",
        "Jumadil Awal", "Jumadil Akhir", "Rajab", "Syaban",
        "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
      ];

      const monthId = islamicMonths[parseInt(monthNum) - 1] || "Muharram";
      setHijriDate(`${day} ${monthId} ${year} H`);
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

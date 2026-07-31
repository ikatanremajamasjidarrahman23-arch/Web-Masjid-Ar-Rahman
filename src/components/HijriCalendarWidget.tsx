"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function HijriCalendarWidget() {
  const [hijriDate, setHijriDate] = useState("");
  const [masehiDate, setMasehiDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [timeOffset, setTimeOffset] = useState(0);

  // Sync with BMKG
  useEffect(() => {
    fetch('/api/time')
      .then(res => res.json())
      .then(data => {
        if (data.time) {
          const localTime = Date.now();
          setTimeOffset(data.time - localTime);
        }
      })
      .catch(err => console.error("Failed to sync BMKG time:", err));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      // Use local time + offset from BMKG
      const today = new Date(Date.now() + timeOffset);
      
      // Pergantian hari Hijriah (setelah Maghrib, perkiraan pukul 18:00)
      const hijriDateObj = new Date(today);
      if (hijriDateObj.getHours() >= 18) {
        hijriDateObj.setDate(hijriDateObj.getDate() + 1);
      }
      
      // Format Hijri Date
      try {
        const hijriFormatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
        const parts = hijriFormatter.formatToParts(hijriDateObj);
        const day = parts.find(p => p.type === 'day')?.value || "1";
        const monthEng = parts.find(p => p.type === 'month')?.value || "";
        const year = parts.find(p => p.type === 'year')?.value || "1445";

        const monthMap: Record<string, string> = {
          "Muharram": "Muharram",
          "Safar": "Safar",
          "Rabiʻ I": "Rabiul Awal",
          "Rabiʻ II": "Rabiul Akhir",
          "Jumada I": "Jumadil Awal",
          "Jumada II": "Jumadil Akhir",
          "Rajab": "Rajab",
          "Shaʻban": "Syaban",
          "Ramadan": "Ramadhan",
          "Shawwal": "Syawal",
          "Dhuʻl-Qiʻdah": "Dzulqa'dah",
          "Dhuʻl-Hijjah": "Dzulhijjah"
        };

        const monthId = monthMap[monthEng] || monthEng;
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
  }, [timeOffset]);

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

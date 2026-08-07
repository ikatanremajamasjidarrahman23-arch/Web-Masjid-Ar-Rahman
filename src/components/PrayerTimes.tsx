"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

interface Timings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function PrayerTimes() {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diffMs: number } | null>(null);
  const [countdown, setCountdown] = useState<string>("Memuat...");
  const [hijriDate, setHijriDate] = useState<string>("");
  const [masehiDate, setMasehiDate] = useState<string>("");

  // Coordinate for Plumbon, Cirebon
  const latitude = -6.6975;
  const longitude = 108.4735;
  
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

  const getRealTime = () => {
    return new Date(Date.now() + timeOffsetRef.current);
  };

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const date = getRealTime();
        // Menggunakan method=20 (Kemenag RI) untuk standar Indonesia
        const response = await axios.get(
          `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=20`
        );
        const data = response.data.data;
        const timingsData = data.timings;
        const hijri = data.date.hijri;

        setTimings({
          Fajr: timingsData.Fajr,
          Dhuhr: timingsData.Dhuhr,
          Asr: timingsData.Asr,
          Maghrib: timingsData.Maghrib,
          Isha: timingsData.Isha,
        });

        // Format Hijri
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} H`);
        
        // Format Masehi
        const masehiOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        setMasehiDate(date.toLocaleDateString('id-ID', masehiOptions));
      } catch (error) {
        console.error("Gagal mengambil jadwal sholat", error);
      }
    };
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (!timings) return;

    const calculateNextPrayer = () => {
      const now = getRealTime();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      const prayers = [
        { name: "Subuh", time: timings.Fajr },
        { name: "Dzuhur", time: timings.Dhuhr },
        { name: "Ashar", time: timings.Asr },
        { name: "Maghrib", time: timings.Maghrib },
        { name: "Isya", time: timings.Isha },
      ];

      let foundNext = false;

      for (const prayer of prayers) {
        const [pHours, pMinutes] = prayer.time.split(":").map(Number);
        const pTotalMinutes = pHours * 60 + pMinutes;

        if (pTotalMinutes > currentTotalMinutes) {
          const prayerTimeDate = getRealTime();
          prayerTimeDate.setHours(pHours, pMinutes, 0, 0);
          setNextPrayer({ name: prayer.name, time: prayer.time, diffMs: prayerTimeDate.getTime() - now.getTime() });
          foundNext = true;
          break;
        }
      }

      // Jika waktu sekarang melewati Isya, next prayer adalah Subuh besok
      if (!foundNext) {
        const [pHours, pMinutes] = timings.Fajr.split(":").map(Number);
        const tomorrow = getRealTime();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(pHours, pMinutes, 0, 0);
        setNextPrayer({ name: "Subuh", time: timings.Fajr, diffMs: tomorrow.getTime() - now.getTime() });
      }
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000); // Check every minute to update next prayer if just passed

    return () => clearInterval(interval);
  }, [timings]);

  useEffect(() => {
    if (!nextPrayer) return;

    const targetTime = getRealTime().getTime() + nextPrayer.diffMs;

    const updateCountdown = () => {
      const now = getRealTime().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        setCountdown("Waktu sholat telah tiba!");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer]);

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-fade-in border border-gray-100">
      <div className="bg-primary-600 text-white p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Jadwal Sholat Hari Ini</h2>
        <p className="text-primary-100 text-sm mb-3">Plumbon, Cirebon & Sekitarnya</p>
        
        {masehiDate && hijriDate && (
          <div className="inline-flex flex-col items-center bg-primary-700/50 rounded-lg px-4 py-2 border border-primary-500/30">
            <span className="text-sm font-medium">{masehiDate}</span>
            <span className="text-xs text-primary-200">{hijriDate}</span>
          </div>
        )}
        
        <div className="mt-5 flex flex-col items-center justify-center bg-primary-700 rounded-xl p-4 shadow-inner">
          <span className="text-sm text-primary-200 mb-1">Menuju {nextPrayer?.name || "Sholat"}</span>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary-300" />
            <span className="text-3xl font-mono font-bold tracking-widest">{countdown}</span>
          </div>
        </div>
      </div>
      
      <div className="p-2 grid grid-cols-5 divide-x divide-gray-100">
        {[
          { name: "Subuh", time: timings?.Fajr },
          { name: "Dzuhur", time: timings?.Dhuhr },
          { name: "Ashar", time: timings?.Asr },
          { name: "Maghrib", time: timings?.Maghrib },
          { name: "Isya", time: timings?.Isha },
        ].map((prayer, idx) => (
          <div 
            key={idx} 
            className={`p-4 flex flex-col items-center justify-center transition-colors
              ${nextPrayer?.name === prayer.name ? "bg-primary-50 ring-2 ring-primary-500 rounded-lg" : "hover:bg-gray-50"}
            `}
          >
            <span className={`text-sm font-medium ${nextPrayer?.name === prayer.name ? "text-primary-700" : "text-gray-500"}`}>
              {prayer.name}
            </span>
            <span className={`text-lg font-bold mt-1 ${nextPrayer?.name === prayer.name ? "text-primary-900" : "text-gray-900"}`}>
              {prayer.time || "--:--"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

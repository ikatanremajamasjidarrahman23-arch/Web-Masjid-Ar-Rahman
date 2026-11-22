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
        timeOffsetRef.current = (serverTime + (t2 - t1) / 2) - Date.now();
      } catch {}
    };
    syncTime();
  }, []);

  const getRealTime = () => new Date(Date.now() + timeOffsetRef.current);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const date = getRealTime();
        const response = await axios.get(
          `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=20`
        );
        const data = response.data.data;
        const t = data.timings;
        const hijri = data.date.hijri;
        setTimings({ Fajr: t.Fajr, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha });
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} H`);
        setMasehiDate(date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
      } catch {}
    };
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (!timings) return;
    const calc = () => {
      const now = getRealTime();
      const cur = now.getHours() * 60 + now.getMinutes();
      const prayers = [
        { name: "Subuh", time: timings.Fajr },
        { name: "Dzuhur", time: timings.Dhuhr },
        { name: "Ashar", time: timings.Asr },
        { name: "Maghrib", time: timings.Maghrib },
        { name: "Isya", time: timings.Isha },
      ];
      let found = false;
      for (const p of prayers) {
        const [ph, pm] = p.time.split(":").map(Number);
        if (ph * 60 + pm > cur) {
          const target = getRealTime();
          target.setHours(ph, pm, 0, 0);
          setNextPrayer({ name: p.name, time: p.time, diffMs: target.getTime() - now.getTime() });
          found = true;
          break;
        }
      }
      if (!found) {
        const [ph, pm] = timings.Fajr.split(":").map(Number);
        const tom = getRealTime();
        tom.setDate(tom.getDate() + 1);
        tom.setHours(ph, pm, 0, 0);
        setNextPrayer({ name: "Subuh", time: timings.Fajr, diffMs: tom.getTime() - now.getTime() });
      }
    };
    calc();
    const iv = setInterval(calc, 60000);
    return () => clearInterval(iv);
  }, [timings]);

  useEffect(() => {
    if (!nextPrayer) return;
    const target = getRealTime().getTime() + nextPrayer.diffMs;
    const update = () => {
      const d = target - getRealTime().getTime();
      if (d < 0) { setCountdown("Waktu sholat tiba! 🕌"); return; }
      const h = Math.floor((d % 86400000) / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const s = Math.floor((d % 60000) / 1000);
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [nextPrayer]);

  const prayers = [
    { name: "Subuh", time: timings?.Fajr },
    { name: "Dzuhur", time: timings?.Dhuhr },
    { name: "Ashar", time: timings?.Asr },
    { name: "Maghrib", time: timings?.Maghrib },
    { name: "Isya", time: timings?.Isha },
  ];

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-primary-950/80 text-white">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4 text-center overflow-hidden">
        {/* Decorative arch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-l-2 border-r-2 border-white/10 rounded-t-full" />
        <h2 className="text-base font-bold text-white/90 mt-3">Jadwal Sholat</h2>
        <p className="text-primary-300 text-xs mt-0.5">Plumbon, Cirebon</p>

        {masehiDate && hijriDate && (
          <div className="mt-3 inline-flex flex-col items-center bg-white/5 rounded-2xl px-5 py-2.5 border border-white/10">
            <span className="text-xs font-medium text-white/80">{masehiDate}</span>
            <span className="text-xs text-primary-300 mt-0.5">{hijriDate}</span>
          </div>
        )}

        {/* Countdown */}
        <div className="mt-4 bg-gradient-to-r from-primary-800/80 to-primary-700/80 rounded-2xl p-4 border border-primary-600/30">
          <p className="text-xs text-primary-300 mb-1">Menuju {nextPrayer?.name || "Sholat"}</p>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-amber-300" />
            <span className="text-3xl font-mono font-bold tracking-widest text-amber-300">
              {countdown}
            </span>
          </div>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-5 border-t border-white/10">
        {prayers.map((prayer, idx) => {
          const isNext = nextPrayer?.name === prayer.name;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center py-4 px-1 transition-colors ${
                isNext
                  ? "bg-amber-400/15 border-t-2 border-amber-400"
                  : "hover:bg-white/5 border-t-2 border-transparent"
              } ${idx > 0 ? "border-l border-white/10" : ""}`}
            >
              <span className={`text-[10px] font-medium mb-1.5 ${isNext ? "text-amber-300" : "text-primary-300"}`}>
                {prayer.name}
              </span>
              <span className={`text-sm font-bold ${isNext ? "text-amber-200" : "text-white"}`}>
                {prayer.time || "--:--"}
              </span>
              {isNext && (
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

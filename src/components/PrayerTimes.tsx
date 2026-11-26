"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Clock, Volume2, VolumeX, Upload } from "lucide-react";

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
  const [currentTime, setCurrentTime] = useState<string>("-- : -- : --");
  const [countdown, setCountdown] = useState<string>("Memuat jadwal sholat...");
  const [hijriDate, setHijriDate] = useState<string>("");
  const [masehiDate, setMasehiDate] = useState<string>("");
  const [adzanEnabled, setAdzanEnabled] = useState<boolean>(false);
  const [adzanFileName, setAdzanFileName] = useState<string>("");
  const [adzanAudioSrc, setAdzanAudioSrc] = useState<string>("https://cdn.islamic.network/adhan/adhan-makkah.mp3");
  const lastTriggeredRef = useRef<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const savedSrc = localStorage.getItem("custom_adzan_audio");
      const savedName = localStorage.getItem("custom_adzan_name");
      if (savedSrc) setAdzanAudioSrc(savedSrc);
      if (savedName) setAdzanFileName(savedName);
    } catch {}
  }, []);

  const handleAdzanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdzanFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setAdzanAudioSrc(objectUrl);
    if (audioRef.current) {
      audioRef.current.src = objectUrl;
    }
    if (file.size <= 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          try {
            localStorage.setItem("custom_adzan_audio", reader.result);
            localStorage.setItem("custom_adzan_name", file.name);
          } catch {}
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    const updateClock = () => {
      const now = getRealTime();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${h} : ${m} : ${s}`);
    };
    updateClock();
    const iv = setInterval(updateClock, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const fetchPrayerTimes = async () => {
      const date = getRealTime();
      setMasehiDate(
        date.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );

      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=20`,
          { timeout: 8000 }
        );
        const data = response.data.data;
        const t = data.timings;
        const hijri = data.date.hijri;
        setTimings({ Fajr: t.Fajr, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha });
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} H`);
        return;
      } catch {}

      try {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        // Fallback: Kemenag / MyQuran API for Kab. Cirebon (1208)
        const res = await axios.get(
          `https://api.myquran.com/v2/sholat/jadwal/1208/${yyyy}/${mm}/${dd}`,
          { timeout: 8000 }
        );
        const j = res.data?.data?.jadwal;
        if (j) {
          setTimings({
            Fajr: j.subuh,
            Dhuhr: j.dzuhur,
            Asr: j.ashar,
            Maghrib: j.maghrib,
            Isha: j.isya,
          });
          return;
        }
      } catch {}

      retryTimer = setTimeout(fetchPrayerTimes, 5000);
    };
    fetchPrayerTimes();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
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
      if (d <= 0) { 
        setCountdown(`Waktu sholat ${nextPrayer.name} tiba!`);
        const key = `${nextPrayer.name}-${nextPrayer.time}`;
        if (lastTriggeredRef.current !== key) {
          lastTriggeredRef.current = key;
          if (adzanEnabled) {
            if (!audioRef.current) {
              audioRef.current = new Audio(adzanAudioSrc);
            } else if (audioRef.current.src !== adzanAudioSrc) {
              audioRef.current.src = adzanAudioSrc;
            }
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(`Waktu ${nextPrayer.name}' ${nextPrayer.time}`, {
              body: `Telah masuk waktu sholat ${nextPrayer.name} (${nextPrayer.time} WIB) untuk wilayah Plumbon, Cirebon.`,
              icon: "/favicon.ico",
            });
          }
        }
        return; 
      }
      const h = Math.floor((d % 86400000) / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const s = Math.floor((d % 60000) / 1000);
      if (h > 0) {
        setCountdown(`${h}j ${m}m ${s} detik menuju ${nextPrayer.name}`);
      } else if (m > 0) {
        setCountdown(`${m}m ${s} detik menuju ${nextPrayer.name}`);
      } else {
        setCountdown(`${s} detik menuju ${nextPrayer.name}`);
      }
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
    <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-primary-950/85 text-white">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4 text-center overflow-hidden">
        {/* Decorative arch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-l-2 border-r-2 border-white/10 rounded-t-full" />
        <h2 className="text-base font-bold text-white/95 mt-3">Jadwal Sholat</h2>
        <p className="text-primary-300 text-xs mt-0.5">Plumbon, Cirebon</p>

        {masehiDate && hijriDate && (
          <div className="mt-3 inline-flex flex-col items-center bg-white/5 rounded-2xl px-5 py-2.5 border border-white/10">
            <span className="text-xs font-medium text-white/90">{masehiDate}</span>
            <span className="text-xs text-primary-300 mt-0.5">{hijriDate}</span>
          </div>
        )}

        {/* Live Clock & Countdown */}
        <div className="mt-4 bg-gradient-to-r from-primary-900/90 to-primary-800/90 rounded-2xl px-4 py-3 border border-primary-700/40 shadow-inner">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-emerald-300">
              {currentTime}
            </span>
            <span className="text-xs font-bold text-emerald-400">WIB</span>
          </div>
          <div className="mt-2 inline-flex items-center justify-center gap-1.5 bg-amber-950/60 border border-amber-500/30 rounded-full px-3 py-1">
            <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-amber-400 whitespace-nowrap">
              {countdown}
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={async () => {
                const next = !adzanEnabled;
                setAdzanEnabled(next);
                if (next && typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
                  await Notification.requestPermission().catch(() => {});
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors border ${
                adzanEnabled
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                  : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
              }`}
            >
              {adzanEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {adzanEnabled ? "Suara Adzan Aktif" : "Aktifkan Suara Adzan"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAdzanFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors border bg-white/5 text-white/75 border-white/15 hover:bg-white/10"
              title={adzanFileName ? `File terpilih: ${adzanFileName}` : "Pilih file audio adzan (MP3/WAV)"}
            >
              <Upload className="w-3 h-3" />
              {adzanFileName ? (adzanFileName.length > 16 ? `${adzanFileName.slice(0, 14)}...` : adzanFileName) : "Pilih File Adzan"}
            </button>
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
                  ? "bg-amber-400/20 border-t-2 border-amber-400"
                  : "hover:bg-white/5 border-t-2 border-transparent"
              } ${idx > 0 ? "border-l border-white/10" : ""}`}
            >
              <span className={`text-[10px] font-medium mb-1.5 ${isNext ? "text-amber-300 font-bold" : "text-primary-300"}`}>
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

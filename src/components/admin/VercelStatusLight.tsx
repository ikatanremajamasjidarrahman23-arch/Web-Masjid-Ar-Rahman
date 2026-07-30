"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function VercelStatusLight() {
  const [status, setStatus] = useState<string>("LOADING");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get("/api/admin/vercel-status");
        setStatus(res.data.status);
      } catch (error) {
        setStatus("ERROR");
      }
    };

    checkStatus();
    // Poll every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Tentukan warna dan teks berdasarkan status
  let colorClass = "bg-gray-400";
  let pulseClass = "";
  let text = "Loading...";

  if (["INITIALIZING", "ANALYZING", "BUILDING", "DEPLOYING"].includes(status)) {
    colorClass = "bg-yellow-400";
    pulseClass = "animate-pulse";
    text = "Sedang Membangun...";
  } else if (status === "READY") {
    colorClass = "bg-green-500";
    text = "Sistem Aktif";
  } else if (["ERROR", "CANCELED"].includes(status)) {
    colorClass = "bg-red-500";
    text = "Error / Gagal";
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 shadow-sm mx-3 mb-2">
      <div className={`relative flex h-3 w-3`}>
        {pulseClass && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-3 w-3 ${colorClass}`}></span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-700">Status Server</span>
        <span className="text-[10px] text-gray-500 leading-tight">{text}</span>
      </div>
    </div>
  );
}

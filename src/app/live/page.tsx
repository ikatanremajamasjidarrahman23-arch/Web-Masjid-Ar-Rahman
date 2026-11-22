import { Metadata } from "next";
import LiveMakkahClient from "./LiveMakkahClient";

export const metadata: Metadata = {
  title: "Live Streaming Makkah & Madinah - Masjid Ar-Rahman",
  description: "Saksikan siaran langsung dari Masjidil Haram Makkah Al-Mukarramah dan Masjid Nabawi Madinah Al-Munawwarah.",
};

export default function LivePage() {
  return <LiveMakkahClient />;
}


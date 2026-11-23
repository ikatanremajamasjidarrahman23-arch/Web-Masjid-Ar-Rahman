import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 rounded-3xl bg-primary-50 border border-primary-100 text-primary-600 shadow-sm">
          <Compass className="w-12 h-12 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-primary-700 uppercase bg-primary-100/60 px-3 py-1 rounded-full">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Afwan, halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-700 hover:bg-primary-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/profil"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold border border-gray-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Profil Masjid</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


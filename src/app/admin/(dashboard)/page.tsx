import { prisma } from "@/lib/prisma";
import { Users, Calendar, Wallet, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let countPhbi = 0;
  let countIrmas = 0;
  let totalIn = 0;
  let totalOut = 0;
  let saldo = 0;

  try {
    countPhbi = await prisma.phbiEvent.count();
    countIrmas = await prisma.irmasActivity.count();
    
    const finances = await prisma.finance.findMany();
    totalIn = finances.filter(f => f.type === "IN").reduce((acc, curr) => acc + curr.amount, 0);
    totalOut = finances.filter(f => f.type === "OUT").reduce((acc, curr) => acc + curr.amount, 0);
    saldo = totalIn - totalOut;
  } catch (error) {
    console.warn("Database not available during AdminDashboard load");
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Selamat Datang, Admin!</h2>
        <p className="text-gray-600 mt-1">Ini adalah ringkasan sistem informasi Masjid Jami' Ar-Rahman hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kegiatan PHBI</p>
            <p className="text-2xl font-bold text-gray-900">{countPhbi}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Berita IRMAS</p>
            <p className="text-2xl font-bold text-gray-900">{countIrmas}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 xl:col-span-2">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Saldo Kas Masjid</p>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(saldo)}</p>
          </div>
        </div>

      </div>

      {/* Instruksi Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          Panduan Singkat
        </h3>
        <ul className="space-y-3 text-gray-600 text-sm list-disc list-inside">
          <li>Gunakan menu <b>Profil Masjid</b> untuk mengubah Visi, Misi, Sejarah, dan QRIS donasi.</li>
          <li>Gunakan menu <b>Dokumentasi PHBI</b> untuk mengunggah foto kegiatan atau menautkan video YouTube.</li>
          <li>Gunakan menu <b>Agenda Kegiatan</b> untuk menambah jadwal kajian rutin masjid.</li>
          <li>Gunakan menu <b>Kegiatan IRMAS</b> untuk mempublikasikan berita terbaru seputar remaja masjid.</li>
          <li>Gunakan menu <b>Galeri Foto</b> untuk mengelola dokumentasi kegiatan dan galeri PHBI.</li>
          <li>Gunakan menu <b>Kelembagaan (UKM)</b> untuk mengelola unit kegiatan masjid seperti Hadroh & Majelis Ta'lim.</li>
          <li>Gunakan menu <b>Kas & Donasi</b> untuk mencatat pemasukan dan pengeluaran secara rutin.</li>
        </ul>
      </div>

    </div>
  );
}

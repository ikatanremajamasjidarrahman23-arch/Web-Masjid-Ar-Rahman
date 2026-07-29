import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowDownCircle, ArrowUpCircle, Wallet, QrCode } from "lucide-react";

export const revalidate = 60;

export default async function DonasiPage() {
  const settings = await prisma.settings.findFirst();
  const qrisImage = settings?.qrisImage;

  const finances = await prisma.finance.findMany({
    orderBy: {
      date: 'desc'
    },
    take: 50 // Limit 50 transaksi terakhir
  });

  const totalIn = finances.filter(f => f.type === "IN").reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = finances.filter(f => f.type === "OUT").reduce((acc, curr) => acc + curr.amount, 0);
  const totalSaldo = totalIn - totalOut;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center animate-fade-in flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Kas & Donasi</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Transparansi laporan keuangan Masjid Jami' Ar-Rahman dan saluran infaq digital.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Laporan Kas Widget (Takes up 2 columns) */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            
            {/* Saldo Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <span className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-primary-600" /> Saldo Saat Ini
                </span>
                <span className="text-2xl font-bold text-gray-900">{formatRupiah(totalSaldo)}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-green-100 bg-green-50/30 shadow-sm flex flex-col">
                <span className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-2">
                  <ArrowDownCircle className="w-4 h-4 text-green-600" /> Total Pemasukan
                </span>
                <span className="text-2xl font-bold text-green-700">{formatRupiah(totalIn)}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-red-100 bg-red-50/30 shadow-sm flex flex-col">
                <span className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-2">
                  <ArrowUpCircle className="w-4 h-4 text-red-600" /> Total Pengeluaran
                </span>
                <span className="text-2xl font-bold text-red-700">{formatRupiah(totalOut)}</span>
              </div>
            </div>

            {/* Riwayat Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-lg">Riwayat Mutasi Kas Terakhir</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                      <th className="py-3 px-6 font-medium">Tanggal</th>
                      <th className="py-3 px-6 font-medium">Keterangan</th>
                      <th className="py-3 px-6 font-medium text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {finances.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500 italic">Belum ada data mutasi kas.</td>
                      </tr>
                    ) : (
                      finances.map((finance) => (
                        <tr key={finance.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                            {format(new Date(finance.date), "dd MMM yyyy", { locale: id })}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {finance.description}
                          </td>
                          <td className="py-4 px-6 text-sm text-right font-bold flex justify-end items-center gap-2">
                            {finance.type === "IN" ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <ArrowDownCircle className="w-4 h-4" /> + {formatRupiah(finance.amount)}
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <ArrowUpCircle className="w-4 h-4" /> - {formatRupiah(finance.amount)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>

          {/* Saluran Infaq (QRIS) */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-primary-900 text-white rounded-2xl p-8 shadow-lg sticky top-24 flex flex-col items-center text-center">
              <QrCode className="w-12 h-12 text-primary-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Salurkan Infaq</h3>
              <p className="text-primary-200 text-sm mb-8">
                Pindai (Scan) QRIS di bawah ini menggunakan aplikasi M-Banking atau e-Wallet Anda (Gopay, OVO, Dana, LinkAja).
              </p>
              
              <div className="bg-white p-4 rounded-xl w-full aspect-square flex items-center justify-center">
                {qrisImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={qrisImage} alt="QRIS Masjid Ar-Rahman" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <QrCode className="w-16 h-16 opacity-50 mb-2" />
                    <span className="text-sm">QRIS Belum Tersedia</span>
                  </div>
                )}
              </div>
              
              <p className="mt-6 text-xs text-primary-300">
                Semoga Allah SWT membalas kebaikan dan melipatgandakan rezeki Anda. Aamiin.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

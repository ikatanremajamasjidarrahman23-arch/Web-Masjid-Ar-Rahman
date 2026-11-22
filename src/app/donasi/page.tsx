import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  ArrowDownCircle, ArrowUpCircle, Wallet, QrCode, 
  Building2, Heart, ShieldCheck, CheckCircle2, ArrowRight,
  Sparkles, Home, CreditCard
} from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function DonasiPage() {
  // Flag konfigurasi status pengembangan fitur
  const isUnderDevelopment = true;

  const settings = await prisma.settings.findFirst();
  const qrisImage = settings?.qrisImage;

  const finances = await prisma.finance.findMany({
    orderBy: {
      date: 'desc'
    },
    take: 50
  });

  const totalIn = finances.filter(f => f.type === "IN").reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = finances.filter(f => f.type === "OUT").reduce((acc, curr) => acc + curr.amount, 0);
  const totalSaldo = totalIn - totalOut;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  const programs = [
    {
      title: "Operasional & Kebersihan",
      desc: "Menjaga kenyamanan ibadah, listrik, air, dan kebersihan masjid setiap hari.",
      target: "Rutin Bulanan",
      badge: "Operasional",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Santunan Yatim & Dhuafa",
      desc: "Penyaluran bantuan logistik dan beasiswa bagi warga yang membutuhkan di sekitar Cempaka.",
      target: "Berkala",
      badge: "Sosial Umat",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Kajian & Pembinaan Remaja",
      desc: "Fasilitasi konsumsi majelis taklim, sirah nabawiyah, dan kegiatan positif pemuda IRMAS.",
      target: "Mingguan",
      badge: "Dakwah",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <div className="relative min-h-screen bg-islamic-pattern-rich pt-24 sm:pt-28 pb-20 overflow-hidden">

      {/* ── KONTEN PRATINJAU KAYA (DI BALIK BLUR OVERLAY) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header Title & Badges */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Transparansi Dana Umat</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Kas &amp; Donasi Digital
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Pusat transparansi pelaporan arus kas, program kemaslahatan umat, serta saluran infaq dan sedekah resmi Masjid Jami' Ar-Rahman.
          </p>
        </div>

        {/* Ringkasan Saldo Cards (3 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-6 -mt-6 pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Saldo Kas Saat Ini
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {formatRupiah(totalSaldo)}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi perbendaharaan DKM
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-md">
                <ArrowDownCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Pemasukan
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-700 tracking-tight">
              {formatRupiah(totalIn)}
            </p>
            <p className="text-[11px] text-gray-500 mt-2">
              Akumulasi infaq kotak, transfer &amp; donatur
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Pengeluaran
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-700 tracking-tight">
              {formatRupiah(totalOut)}
            </p>
            <p className="text-[11px] text-gray-500 mt-2">
              Biaya operasional &amp; pemeliharaan masjid
            </p>
          </div>
        </div>

        {/* Program Donasi Unggulan */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Program Penyaluran Infaq</h2>
              <p className="text-xs sm:text-sm text-gray-500">Pilihan pos kebaikan untuk jamaah dan donatur.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {programs.map((prog) => (
              <div key={prog.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      {prog.badge}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{prog.target}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1.5">{prog.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{prog.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Salurkan Donasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Laporan Mutasi Kas & QRIS */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Tabel Riwayat Arus Kas (2 Kolom) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Riwayat Mutasi Kas Terakhir</h3>
                  <p className="text-xs text-gray-500">Pencatatan real-time dari pengurus keuangan DKM</p>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-200">
                  {finances.length} Catatan
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="py-3 px-6 font-semibold">Tanggal</th>
                      <th className="py-3 px-6 font-semibold">Keterangan</th>
                      <th className="py-3 px-6 font-semibold text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {finances.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-400 italic">
                          Belum ada data mutasi kas tercatat.
                        </td>
                      </tr>
                    ) : (
                      finances.map((f) => (
                        <tr key={f.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-6 text-gray-600 whitespace-nowrap text-xs">
                            {format(new Date(f.date), "dd MMM yyyy", { locale: id })}
                          </td>
                          <td className="py-3.5 px-6 text-gray-900 font-medium">
                            {f.description}
                          </td>
                          <td className="py-3.5 px-6 text-right font-bold whitespace-nowrap">
                            {f.type === "IN" ? (
                              <span className="text-green-600 inline-flex items-center gap-1">
                                <ArrowDownCircle className="w-3.5 h-3.5" /> +{formatRupiah(f.amount)}
                              </span>
                            ) : (
                              <span className="text-rose-600 inline-flex items-center gap-1">
                                <ArrowUpCircle className="w-3.5 h-3.5" /> -{formatRupiah(f.amount)}
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

          {/* Saluran Infaq: Rekening & QRIS Mockup */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-emerald-950 text-white rounded-3xl p-7 shadow-xl border border-primary-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">QRIS Standar Nasional</h3>
                  <span className="text-[10px] text-emerald-300">Bebas Biaya Admin</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl aspect-square flex items-center justify-center shadow-inner my-4">
                {qrisImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrisImage} alt="QRIS Masjid Ar-Rahman" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center justify-center text-center p-4">
                    <QrCode className="w-16 h-16 opacity-40 mb-2" />
                    <span className="text-xs font-semibold text-gray-600">QRIS Resmi DKM</span>
                    <span className="text-[10px] text-gray-400 mt-1">Scan via GoPay, OVO, Dana, BCA, Mandiri, BSI</span>
                  </div>
                )}
              </div>

              {/* Rekening Bank DKM */}
              <div className="mt-5 pt-4 border-t border-primary-800/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  <span>Rekening Kas DKM</span>
                </div>
                <div className="bg-primary-900/80 rounded-xl p-3 border border-primary-800">
                  <p className="text-xs text-primary-300">Bank Syariah Indonesia (BSI)</p>
                  <p className="text-base font-mono font-bold text-white tracking-wider mt-0.5">
                    712 345 6789
                  </p>
                  <p className="text-[10px] text-primary-400 mt-0.5">a.n. DKM Masjid Jami' Ar-Rahman</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── 2. FROSTED GLASS OVERLAY (MASIH DALAM PENGEMBANGAN) ── */}
      {isUnderDevelopment && (
        <div className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/80 max-w-lg w-full p-7 sm:p-9 text-center space-y-6 relative overflow-hidden animate-scale-in">
            {/* Hiasan Aksen Islami Atas */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-500" />

            {/* Icon Tengah */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-400/30 text-slate-950">
              <QrCode className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            {/* Status & Judul */}
            <div className="space-y-2">
              <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300 uppercase tracking-widest">
                🚧 Layanan Digital DKM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Masih Dalam Pengembangan
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Fitur Kas &amp; Donasi Digital (integrasi QRIS dinamis, pembayaran virtual account, dan mutasi arus kas real-time otomatis) saat ini sedang dipersiapkan untuk kenyamanan serta kemudahan seluruh jamaah.
              </p>
            </div>

            {/* Kotak Informasi Penyaluran Sementara */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-left space-y-1.5">
              <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Penyaluran Infaq Sementara:
              </p>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                Salurkan infaq dan sedekah Anda secara langsung melalui <strong>Kotak Amal Utama Masjid</strong> atau konfirmasi langsung dengan <strong>Sekretariat Pengurus DKM Ar-Rahman</strong>.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

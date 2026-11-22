"use client";

import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  Plus, Trash2, Wallet, ArrowDownCircle, ArrowUpCircle, 
  TrendingUp, TrendingDown, Save, X, Calendar
} from "lucide-react";

type Finance = {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export default function DonasiAdminClient({
  initialFinances,
  totalIn,
  totalOut,
  saldo,
}: {
  initialFinances: Finance[];
  totalIn: number;
  totalOut: number;
  saldo: number;
}) {
  const [finances, setFinances] = useState<Finance[]>(initialFinances);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTotalIn, setCurrentTotalIn] = useState(totalIn);
  const [currentTotalOut, setCurrentTotalOut] = useState(totalOut);
  const [currentSaldo, setCurrentSaldo] = useState(saldo);

  const [formData, setFormData] = useState({
    type: "IN",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    setLoading(true);

    try {
      const payload = {
        type: formData.type,
        amount: parseFloat(formData.amount.replace(/[^0-9]/g, "")),
        description: formData.description,
        date: formData.date,
      };

      const res = await axios.post("/api/admin/finance", payload);
      const newItem = res.data;

      setFinances(prev => [newItem, ...prev]);

      // Update totals locally
      if (payload.type === "IN") {
        setCurrentTotalIn(prev => prev + payload.amount);
        setCurrentSaldo(prev => prev + payload.amount);
      } else {
        setCurrentTotalOut(prev => prev + payload.amount);
        setCurrentSaldo(prev => prev - payload.amount);
      }

      setFormData({ type: "IN", amount: "", description: "", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Gagal menyimpan transaksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: Finance) => {
    if (!confirm(`Hapus catatan "${item.description}"?`)) return;
    try {
      await axios.delete(`/api/admin/finance?id=${item.id}`);
      setFinances(prev => prev.filter(f => f.id !== item.id));

      // Update totals
      if (item.type === "IN") {
        setCurrentTotalIn(prev => prev - item.amount);
        setCurrentSaldo(prev => prev - item.amount);
      } else {
        setCurrentTotalOut(prev => prev - item.amount);
        setCurrentSaldo(prev => prev + item.amount);
      }
    } catch {
      alert("Gagal menghapus catatan.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kas & Donasi Masjid</h2>
          <p className="text-gray-600 mt-1">Catat pemasukan dan pengeluaran kas masjid secara transparan.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Batal" : "Catat Transaksi Baru"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Kas</p>
            <p className="text-xl font-extrabold text-gray-900">{formatRupiah(currentSaldo)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pemasukan</p>
            <p className="text-xl font-extrabold text-green-700">{formatRupiah(currentTotalIn)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pengeluaran</p>
            <p className="text-xl font-extrabold text-rose-700">{formatRupiah(currentTotalOut)}</p>
          </div>
        </div>
      </div>

      {/* Form Transaksi */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-500" />
            Catat Transaksi Baru
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jenis */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Transaksi *</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "IN" })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                      formData.type === "IN"
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4" /> Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "OUT" })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                      formData.type === "OUT"
                        ? "bg-rose-50 border-rose-500 text-rose-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" /> Pengeluaran
                  </button>
                </div>
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal (Rp) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Contoh: 500000"
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keterangan / Sumber *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Cth: Infaq Jumat / Pembelian Tikar"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                {loading ? "Menyimpan..." : "Simpan Catatan Kas"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Riwayat */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Riwayat Mutasi Kas</h3>
            <p className="text-xs text-gray-500 mt-0.5">{finances.length} catatan transaksi</p>
          </div>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-6 font-semibold">Tanggal</th>
                <th className="py-3 px-6 font-semibold">Keterangan</th>
                <th className="py-3 px-6 font-semibold text-center">Jenis</th>
                <th className="py-3 px-6 font-semibold text-right">Nominal</th>
                <th className="py-3 px-6 font-semibold text-right w-20">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {finances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 italic">
                    Belum ada catatan transaksi. Klik "Catat Transaksi Baru" untuk mulai.
                  </td>
                </tr>
              ) : (
                finances.map(finance => (
                  <tr key={finance.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3.5 px-6 text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(finance.date), "dd MMM yyyy", { locale: id })}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-900 font-medium">{finance.description}</td>
                    <td className="py-3.5 px-6 text-center">
                      {finance.type === "IN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          <ArrowDownCircle className="w-3 h-3" /> Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                          <ArrowUpCircle className="w-3 h-3" /> Keluar
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-sm font-bold text-right">
                      <span className={finance.type === "IN" ? "text-green-700" : "text-rose-700"}>
                        {finance.type === "IN" ? "+" : "-"}{formatRupiah(finance.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleDelete(finance)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus catatan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function IrmasDaftarPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await axios.post("/api/irmas/daftar", formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({ name: "", phone: "", address: "", reason: "" });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href="/irmas" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman IRMAS
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Formulir Pendaftaran IRMAS</h1>
            <p className="mt-2 text-gray-600">
              Mari bergabung dan berkontribusi bersama Ikatan Remaja Masjid Jami' Ar-Rahman.
            </p>
          </div>

          {success && (
            <div className="mb-8 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="font-bold">Pendaftaran Berhasil!</h3>
                <p className="text-sm mt-1">Terima kasih telah mendaftar. Pengurus IRMAS akan segera menghubungi Anda melalui WhatsApp.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                placeholder="Contoh: 081234567890"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap *</label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none resize-none"
                placeholder="Masukkan alamat domisili Anda"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">Alasan Bergabung (Opsional)</label>
              <textarea
                id="reason"
                name="reason"
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none resize-none"
                placeholder="Ceritakan motivasi Anda bergabung dengan IRMAS..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 px-6 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : (
                  <>
                    Kirim Pendaftaran <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

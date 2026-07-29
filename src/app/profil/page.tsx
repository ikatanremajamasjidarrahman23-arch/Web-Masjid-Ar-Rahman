import { prisma } from "@/lib/prisma";
import { BookOpen, Target, Users } from "lucide-react";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProfilPage() {
  // Ambil pengaturan profil dari database (jika belum ada, akan dirender teks dummy)
  const settings = await prisma.settings.findFirst();

  const dummyVisi = "Menjadi pusat ibadah, pendidikan, dan peradaban umat yang ramah, modern, dan menebarkan rahmat bagi seluruh alam (Rahmatan Lil 'Alamin) di lingkungan Perumahan Korpri Cempaka.";
  
  const dummyMisi = `1. Menyelenggarakan ibadah rawatib dan salat Jumat yang khusyuk dan nyaman.
2. Mengembangkan pendidikan agama yang berkualitas untuk semua kelompok umur, mulai dari TPA hingga kajian keislaman untuk dewasa.
3. Menumbuhkan ukhuwah islamiyah dan kepedulian sosial melalui kegiatan pemberdayaan masyarakat.
4. Mewujudkan pengelolaan masjid yang profesional, transparan, dan akuntabel berbasis teknologi informasi.`;

  const dummySejarah = `Masjid Jami' Ar-Rahman didirikan atas dasar semangat gotong royong warga Perumahan Korpri Cempaka, Plumbon. Awalnya merupakan musala kecil yang kemudian, seiring bertambahnya jumlah warga dan kebutuhan akan tempat ibadah yang lebih representatif, direnovasi dan diperluas menjadi Masjid Jami' pada tahun 2010. Pembangunan masjid ini didanai oleh swadaya murni masyarakat sekitar dan para donatur. Hingga kini, Masjid Ar-Rahman terus berkembang tidak hanya sebagai tempat salat, melainkan juga pusat kegiatan sosial dan pendidikan warga.`;

  const visi = settings?.visi || dummyVisi;
  const misi = settings?.misi || dummyMisi;
  const sejarah = settings?.sejarah || dummySejarah;

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center animate-fade-in flex flex-col items-center">
          {settings?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt="Logo Masjid" className="h-24 md:h-32 w-auto object-contain mb-6 drop-shadow-sm" />
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Profil Masjid</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Mengenal lebih dekat sejarah, visi, dan misi Masjid Jami' Ar-Rahman Cempaka.
          </p>
        </div>

        {/* Visi & Misi Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {visi}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {misi}
            </div>
          </div>
        </div>

        {/* Sejarah Section */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sejarah Singkat</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
            {sejarah}
          </p>
        </div>

      </div>
    </div>
  );
}

import Link from "next/link";
import { Moon, MapPin, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const settings = await prisma.settings.findFirst();

  return (
    <footer className="bg-primary-950 text-primary-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {settings?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logoUrl} alt="Logo Masjid" className="h-10 w-auto object-contain brightness-0 invert" />
              ) : (
                <Moon className="w-8 h-8 text-primary-400" />
              )}
              <span className="font-bold text-xl tracking-tight text-white">Masjid Ar-Rahman</span>
            </Link>
            <p className="text-sm text-primary-200">
              {settings?.deskripsiSingkat || "Menjadi pusat ibadah dan peradaban umat yang rahmatan lil 'alamin di lingkungan Cempaka."}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-lg border-b border-primary-800 pb-2 inline-block">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>{settings?.alamat || "Perumahan Korpri Cempaka, Plumbon, Cirebon, Jawa Barat."}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>{settings?.telepon || "+62 812-3456-7890 (Pengurus DKM)"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>{settings?.email || "info@masjidarrahman.com"}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-lg border-b border-primary-800 pb-2 inline-block">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm flex flex-col">
              <Link href="/profil" className="hover:text-white transition-colors hover:underline w-fit">Profil & Sejarah</Link>
              <Link href="/phbi" className="hover:text-white transition-colors hover:underline w-fit">Galeri PHBI</Link>
              <Link href="/irmas" className="hover:text-white transition-colors hover:underline w-fit">Kegiatan Remaja</Link>
              <Link href="/donasi" className="hover:text-white transition-colors hover:underline w-fit">Infaq & Shodaqoh</Link>
              <Link href="/admin" className="hover:text-primary-400 transition-colors hover:underline mt-4 w-fit text-xs opacity-70">Login Admin</Link>
            </ul>
          </div>

        </div>

        <div className="border-t border-primary-900 mt-12 pt-8 text-center text-sm text-primary-300/60">
          <p>&copy; {new Date().getFullYear()} DKM Masjid Jami&apos; Ar-Rahman Cempaka. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

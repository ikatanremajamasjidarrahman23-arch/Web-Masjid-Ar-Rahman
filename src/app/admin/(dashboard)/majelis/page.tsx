import { prisma } from "@/lib/prisma";
import MajelisUploadClient from "./MajelisUploadClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Foto Majelis Ta'lim - Masjid Jami' Ar-Rahman",
  description: "Halaman khusus ibu-ibu pengurus Majelis Ta'lim untuk mengunggah dokumentasi foto kegiatan.",
};

export const revalidate = 0;

export default async function MajelisAdminPage() {
  const majelis = await prisma.ukm.findFirst({
    where: {
      OR: [
        { id: "cmt2ed0j80001kz04hyyhehkw" },
        { namaUkm: { contains: "Majelis", mode: "insensitive" } },
        { namaUkm: { contains: "Jumhuriyah", mode: "insensitive" } },
      ],
    },
  });

  return (
    <MajelisUploadClient 
      initialPhotos={majelis?.galleryImages || []} 
      majelisId={majelis?.id || "cmt2ed0j80001kz04hyyhehkw"}
      majelisName={majelis?.namaUkm || "Majelis Ta'lim Jumhuriyah"}
    />
  );
}

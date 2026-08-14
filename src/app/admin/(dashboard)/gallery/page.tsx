import { prisma } from "@/lib/prisma";
import GalleryDashboardClient from "./GalleryDashboardClient";

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const galleries = await prisma.gallery.findMany({
    where: {
      category: {
        not: "Selayang Pandang"
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <GalleryDashboardClient initialGalleries={galleries} />
  );
}

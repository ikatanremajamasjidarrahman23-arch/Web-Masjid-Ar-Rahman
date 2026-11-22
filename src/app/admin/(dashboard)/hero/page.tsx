import { prisma } from "@/lib/prisma";
import HeroImageClient from "./HeroImageClient";

export const dynamic = "force-dynamic";

export default async function HeroAdminPage() {
  const heroImages = await prisma.heroImage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <HeroImageClient initialImages={heroImages} />
    </div>
  );
}


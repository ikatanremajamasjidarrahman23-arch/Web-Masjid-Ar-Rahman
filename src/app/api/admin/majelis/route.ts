import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Helper untuk menemukan UKM Majelis Ta'lim
async function getMajelisUkm() {
  return await prisma.ukm.findFirst({
    where: {
      OR: [
        { id: "cmt2ed0j80001kz04hyyhehkw" },
        { namaUkm: { contains: "Majelis", mode: "insensitive" } },
        { namaUkm: { contains: "Jumhuriyah", mode: "insensitive" } },
      ],
    },
  });
}

// GET: Ambil daftar foto kegiatan Majelis Ta'lim
export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session.valid) {
      return NextResponse.json({ error: "Sesi tidak valid, silakan login kembali." }, { status: 401 });
    }

    const majelis = await getMajelisUkm();
    if (!majelis) {
      return NextResponse.json({ error: "Data Majelis Ta'lim belum terdaftar di sistem." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: majelis.id,
        namaUkm: majelis.namaUkm,
        pembina: majelis.pembina,
        photos: majelis.galleryImages || [],
      },
    });
  } catch (error: any) {
    console.error("GET Majelis Photos Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat memuat foto." }, { status: 500 });
  }
}

// POST: Tambahkan foto-foto kegiatan baru ke Majelis Ta'lim & Galeri Masjid
export async function POST(request: Request) {
  try {
    const session = await verifyAdminSession();
    if (!session.valid) {
      return NextResponse.json({ error: "Sesi tidak valid, silakan login kembali." }, { status: 401 });
    }

    const body = await request.json();
    const { images, title } = body;

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Pilih minimal 1 foto kegiatan untuk diunggah." }, { status: 400 });
    }

    const majelis = await getMajelisUkm();
    if (!majelis) {
      return NextResponse.json({ error: "Data Majelis Ta'lim tidak ditemukan." }, { status: 404 });
    }

    // 1. Tambahkan foto ke array galleryImages UKM Majelis Ta'lim (tanpa duplikat)
    const currentImages = majelis.galleryImages || [];
    const validNewImages = images.filter((img) => typeof img === "string" && img.startsWith("http"));
    
    // Gabungkan dengan urutan foto baru di paling depan (terbaru)
    const updatedImages = Array.from(new Set([...validNewImages, ...currentImages]));

    await prisma.ukm.update({
      where: { id: majelis.id },
      data: { galleryImages: updatedImages },
    });

    // 2. Sekaligus masukkan ke Galeri Utama Masjid dengan kategori Majelis Ta'lim
    const photoTitle = title && title.trim() ? title.trim() : "Dokumentasi Kegiatan Majelis Ta'lim Jumhuriyah";
    for (const url of validNewImages) {
      try {
        await prisma.gallery.create({
          data: {
            title: photoTitle,
            category: "Majelis Ta'lim",
            imageUrl: url,
            imagePosition: "center",
          },
        });
      } catch (err) {
        console.error("Gagal memasukkan foto ke galeri umum:", err);
      }
    }

    // 3. Revalidasi halaman terkait agar langsung terupdate
    revalidatePath("/ukm");
    revalidatePath(`/ukm/${majelis.id}`);
    revalidatePath("/galeri");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: `Alhamdulillah! ${validNewImages.length} foto kegiatan berhasil diunggah.`,
      photos: updatedImages,
    });
  } catch (error: any) {
    console.error("POST Majelis Photos Error:", error);
    return NextResponse.json({ error: error.message || "Gagal menyimpan foto kegiatan." }, { status: 500 });
  }
}

// DELETE: Hapus foto dari kegiatan Majelis Ta'lim
export async function DELETE(request: Request) {
  try {
    const session = await verifyAdminSession();
    if (!session.valid) {
      return NextResponse.json({ error: "Sesi tidak valid, silakan login kembali." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return NextResponse.json({ error: "URL foto wajib disertakan." }, { status: 400 });
    }

    const majelis = await getMajelisUkm();
    if (!majelis) {
      return NextResponse.json({ error: "Data Majelis Ta'lim tidak ditemukan." }, { status: 404 });
    }

    // 1. Hapus dari galleryImages Majelis Ta'lim
    const updatedImages = (majelis.galleryImages || []).filter((img) => img !== imageUrl);

    await prisma.ukm.update({
      where: { id: majelis.id },
      data: { galleryImages: updatedImages },
    });

    // 2. Hapus juga dari Gallery utama jika ada
    try {
      await prisma.gallery.deleteMany({
        where: { imageUrl },
      });
    } catch (err) {
      console.error("Gagal menghapus dari galeri umum:", err);
    }

    // 3. Revalidasi cache publik
    revalidatePath("/ukm");
    revalidatePath(`/ukm/${majelis.id}`);
    revalidatePath("/galeri");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Foto berhasil dihapus.",
      photos: updatedImages,
    });
  } catch (error: any) {
    console.error("DELETE Majelis Photo Error:", error);
    return NextResponse.json({ error: "Gagal menghapus foto." }, { status: 500 });
  }
}

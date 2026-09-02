import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah." }, { status: 400 });
    }

    // Ambil konfigurasi dari database
    const settings = await prisma.settings.findFirst();

    const cloudName = settings?.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = settings?.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = settings?.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ 
        error: "Sistem belum siap: Kunci rahasia Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) belum disetting di Environment Variables Vercel." 
      }, { status: 500 });
    }

    // Gunakan konfigurasi dari database jika ada, jika tidak fallback ke .env
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isBanner = formData.get("isBanner") === "true";

    const uploadOptions: any = {
      folder: "masjid-ar-rahman",
    };

    if (isBanner) {
      uploadOptions.quality = "auto:best";
    } else {
      uploadOptions.format = "webp";
      uploadOptions.quality = "auto:best"; // Increased quality to prevent blurriness
      // removed width limitation to rely on client-side compression (1920px)
      uploadOptions.crop = "limit";
    }

    // Proses upload ke Cloudinary dengan optimasi memori
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah gambar ke server." }, { status: 500 });
  }
}

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

    // Gunakan konfigurasi dari database jika ada, jika tidak fallback ke .env
    cloudinary.config({
      cloud_name: settings?.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME,
      api_key: settings?.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY,
      api_secret: settings?.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Proses upload ke Cloudinary dengan optimasi memori
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "masjid-ar-rahman",
          format: "webp", // Ubah ke WEBP agar ukurannya sangat kecil
          quality: "auto", // Kompresi otomatis terbaik
          width: 1200, // Batasi lebar maksimal untuk menghemat kuota
          crop: "limit" // Jangan perbesar jika gambar aslinya kecil
        },
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

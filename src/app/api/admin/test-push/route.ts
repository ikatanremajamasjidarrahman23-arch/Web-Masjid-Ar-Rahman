import { NextResponse } from "next/server";
import { sendNotificationToAll } from "@/lib/push";

export async function POST(request: Request) {
  try {
    // We await it here because we want to know immediately if it succeeded
    await sendNotificationToAll(
      "Test dari Admin Masjid",
      "Jika Anda menerima ini, berarti fitur Push Notification berjalan dengan sempurna! 🎉",
      "/"
    );
    
    return NextResponse.json({ success: true, message: "Notifikasi tes berhasil dikirim" });
  } catch (error: any) {
    console.error("Test Push Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim notifikasi tes: " + error.message },
      { status: 500 }
    );
  }
}

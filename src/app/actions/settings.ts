"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
  const visi = formData.get("visi") as string;
  const misi = formData.get("misi") as string;
  const sejarah = formData.get("sejarah") as string;
  const qrisImage = formData.get("qrisImage") as string;
  const runningText = formData.get("runningText") as string;
  const deskripsiSingkat = formData.get("deskripsiSingkat") as string;
  const alamat = formData.get("alamat") as string;
  const telepon = formData.get("telepon") as string;
  const email = formData.get("email") as string;
  const logoUrl = formData.get("logoUrl") as string;

  const settingsCount = await prisma.settings.count();

  const dataPayload = {
    visi,
    misi,
    sejarah,
    qrisImage: qrisImage || null,
    runningText: runningText || null,
    deskripsiSingkat: deskripsiSingkat || null,
    alamat: alamat || null,
    telepon: telepon || null,
    email: email || null,
    logoUrl: logoUrl || null,
  };

  if (settingsCount === 0) {
    await prisma.settings.create({
      data: dataPayload,
    });
  } else {
    const setting = await prisma.settings.findFirst();
    await prisma.settings.update({
      where: { id: setting!.id },
      data: dataPayload,
    });
  }

  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath("/donasi");
  revalidatePath("/admin/profil");
  return { success: true };
}

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
  const fontFamily = formData.get("fontFamily") as string;
  const themeColor = formData.get("themeColor") as string;
  const runningTextSpeed = parseInt(formData.get("runningTextSpeed") as string) || 25;
  const irmasLogoUrl = formData.get("irmasLogoUrl") as string;
  const logoSizeNavbar = parseInt(formData.get("logoSizeNavbar") as string) || 48;
  const logoSizeProfil = parseInt(formData.get("logoSizeProfil") as string) || 80;
  const logoSizeIrmas = parseInt(formData.get("logoSizeIrmas") as string) || 80;
  
  const cloudinaryCloudName = formData.get("cloudinaryCloudName") as string;
  const cloudinaryApiKey = formData.get("cloudinaryApiKey") as string;
  const cloudinaryApiSecret = formData.get("cloudinaryApiSecret") as string;
  
  const adArtContent = formData.get("adArtContent") as string;
  const adArtFileUrl = formData.get("adArtFileUrl") as string;

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
    fontFamily: fontFamily || "inter",
    themeColor: themeColor || "emerald",
    runningTextSpeed: runningTextSpeed,
    irmasLogoUrl: irmasLogoUrl || null,
    logoSizeNavbar,
    logoSizeProfil,
    logoSizeIrmas,
    cloudinaryCloudName: cloudinaryCloudName || null,
    cloudinaryApiKey: cloudinaryApiKey || null,
    cloudinaryApiSecret: cloudinaryApiSecret || null,
    adArtContent: adArtContent || null,
    adArtFileUrl: adArtFileUrl || null,
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

  revalidatePath("/", "layout");
  revalidatePath("/profil");
  revalidatePath("/donasi");
  revalidatePath("/admin/profil");
  return { success: true };
}

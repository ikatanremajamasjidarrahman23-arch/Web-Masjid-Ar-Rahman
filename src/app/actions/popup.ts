"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePopupSettings(formData: FormData) {
  const popupImage = formData.get("popupImage") as string;
  const popupIsActive = formData.get("popupIsActive") === "true";
  const popupDuration = parseInt(formData.get("popupDuration") as string) || 10;

  const settingsCount = await prisma.settings.count();

  if (settingsCount === 0) {
    await prisma.settings.create({
      data: {
        popupImage: popupImage || null,
        popupIsActive,
        popupDuration,
      },
    });
  } else {
    const setting = await prisma.settings.findFirst();
    await prisma.settings.update({
      where: { id: setting!.id },
      data: {
        popupImage: popupImage || null,
        popupIsActive,
        popupDuration,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/popup");
  return { success: true };
}

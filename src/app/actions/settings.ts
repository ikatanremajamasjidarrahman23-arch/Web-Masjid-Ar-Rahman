"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
  const settingsCount = await prisma.settings.count();
  
  // Build data payload dynamically based on what's provided in formData
  // This allows partial updates from multiple smaller forms
  const dataPayload: any = {};
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      // For number fields, parse them
      if (key === "runningTextSpeed" || key === "logoSizeNavbar" || key === "logoSizeProfil" || key === "logoSizeIrmas") {
        dataPayload[key] = parseInt(value) || (key === "runningTextSpeed" ? 25 : key === "logoSizeNavbar" ? 48 : 80);
      } else {
        // For string fields, keep the string (even if empty, which might mean the user cleared it)
        // Wait, if it's an empty string, maybe we want to save it as empty string or null depending on schema
        dataPayload[key] = value;
      }
    }
  }

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

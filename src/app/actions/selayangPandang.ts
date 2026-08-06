"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSelayangPandangSettings(formData: FormData) {
  const selayangPandangTitle = formData.get("selayangPandangTitle") as string;
  const selayangPandangDescription = formData.get("selayangPandangDescription") as string;
  
  const settingsCount = await prisma.settings.count();

  if (settingsCount > 0) {
    const setting = await prisma.settings.findFirst();
    await prisma.settings.update({
      where: { id: setting!.id },
      data: {
        selayangPandangTitle,
        selayangPandangDescription,
      },
    });
  } else {
    await prisma.settings.create({
      data: {
        selayangPandangTitle,
        selayangPandangDescription,
      },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/selayang-pandang");
  return { success: true };
}

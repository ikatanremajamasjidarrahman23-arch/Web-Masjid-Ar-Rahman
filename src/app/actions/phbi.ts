"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPhbiEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);
  const linkMore = formData.get("linkMore") as string;

  const event = await prisma.phbiEvent.create({
    data: {
      title,
      description,
      date,
      linkMore: linkMore || null,
    },
  });

  revalidatePath("/admin/phbi");
  revalidatePath("/phbi");
  return { success: true, id: event.id };
}

export async function updatePhbiEvent(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);
  const linkMore = formData.get("linkMore") as string;

  await prisma.phbiEvent.update({
    where: { id },
    data: {
      title,
      description,
      date,
      linkMore: linkMore || null,
    },
  });

  revalidatePath("/admin/phbi");
  revalidatePath("/phbi");
  return { success: true };
}

export async function deletePhbiEvent(id: string) {
  await prisma.phbiEvent.delete({
    where: { id }
  });
  revalidatePath("/phbi");
  revalidatePath("/admin/phbi");
  return { success: true };
}

export async function addPhbiMedia(formData: FormData) {
  const phbiEventId = formData.get("phbiEventId") as string;
  const type = formData.get("type") as "IMAGE" | "VIDEO";
  const url = formData.get("url") as string;

  await prisma.phbiMedia.create({
    data: {
      eventId: phbiEventId,
      type,
      url
    }
  });

  revalidatePath("/phbi");
  revalidatePath("/admin/phbi");
  return { success: true };
}

export async function deletePhbiMedia(id: string) {
  await prisma.phbiMedia.delete({
    where: { id }
  });
  revalidatePath("/phbi");
  revalidatePath("/admin/phbi");
  return { success: true };
}

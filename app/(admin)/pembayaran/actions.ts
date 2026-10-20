"use server";

import { prisma } from "@/lib/prisma";
import { StatusPembayaran } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function catatPembayaran(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const pembayaran = await prisma.pembayaran.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!pembayaran) throw new Error("Tagihan tidak ditemukan.");
  if (pembayaran.status === StatusPembayaran.LUNAS) throw new Error("Tagihan sudah lunas.");
  await prisma.pembayaran.update({ where: { id }, data: { status: StatusPembayaran.LUNAS, tanggalBayar: new Date() } });
  revalidatePath("/pembayaran");
}

"use server";

import { prisma } from "@/lib/prisma";
import { StatusPembayaran, StatusPenghuni } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function buatTagihanBulanIni() {
  const now = new Date();
  const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);
  const awalBulanDepan = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const hariIni = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const penghuni = await prisma.penghuni.findMany({
    where: { status: StatusPenghuni.AKTIF },
    include: { kamar: true },
  });

  for (const orang of penghuni) {
    const tanggalJatuhTempo = Math.min(orang.tanggalMasuk.getDate(), new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
    const jatuhTempo = new Date(now.getFullYear(), now.getMonth(), tanggalJatuhTempo);
    const sudahAda = await prisma.pembayaran.findFirst({
      where: { penghuniId: orang.id, jatuhTempo: { gte: awalBulan, lt: awalBulanDepan } },
      select: { id: true },
    });
    if (!sudahAda) {
      await prisma.pembayaran.create({
        data: { penghuniId: orang.id, jumlah: orang.kamar.harga, jatuhTempo, status: jatuhTempo < hariIni ? StatusPembayaran.MENUNGGAK : StatusPembayaran.BELUM_BAYAR },
      });
    }
  }
  revalidatePath("/pembayaran");
}

export async function catatPembayaran(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const pembayaran = await prisma.pembayaran.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!pembayaran) throw new Error("Tagihan tidak ditemukan.");
  if (pembayaran.status === StatusPembayaran.LUNAS) throw new Error("Tagihan sudah lunas.");
  await prisma.pembayaran.update({ where: { id }, data: { status: StatusPembayaran.LUNAS, tanggalBayar: new Date() } });
  revalidatePath("/pembayaran");
}

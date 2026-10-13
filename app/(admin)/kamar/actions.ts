"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StatusKamar } from "@prisma/client";

// Action untuk menambah kamar baru
export async function createKamar(formData: FormData) {
  const nomorKamar = formData.get("nomorKamar") as string;
  const harga = parseInt(formData.get("harga") as string, 10);
  const status = StatusKamar.KOSONG;

  if (!nomorKamar || isNaN(harga)) {
    throw new Error("Nomor kamar dan harga wajib diisi.");
  }

  // Cek apakah nomor kamar sudah terdaftar
  const existingKamar = await prisma.kamar.findUnique({
    where: { nomorKamar },
  });

  if (existingKamar) {
    throw new Error(`Kamar nomor ${nomorKamar} sudah ada.`);
  }

  // Simpan ke PostgreSQL via Prisma
  await prisma.kamar.create({
    data: {
      nomorKamar,
      harga,
      status,
    },
  });

  // Segarkan cache halaman kamar agar data terbaru langsung tampil
  revalidatePath("/kamar");
  redirect("/kamar");
}

// Action untuk memperbarui kamar
export async function updateKamar(id: string, formData: FormData) {
  const nomorKamar = formData.get("nomorKamar") as string;
  const harga = parseInt(formData.get("harga") as string, 10);
  const status = formData.get("status") === StatusKamar.TERISI ? StatusKamar.TERISI : StatusKamar.KOSONG;

  if (!nomorKamar || isNaN(harga)) {
    throw new Error("Nomor kamar dan harga wajib diisi.");
  }

  // Periksa apakah nomor kamar bentrok dengan kamar lain
  const existingKamar = await prisma.kamar.findUnique({
    where: { nomorKamar },
  });

  if (existingKamar && existingKamar.id !== id) {
    throw new Error(`Kamar nomor ${nomorKamar} sudah digunakan kamar lain.`);
  }

  if (status === StatusKamar.TERISI) {
    const penghuniAktif = await prisma.penghuni.findFirst({ where: { kamarId: id, status: "AKTIF" } });
    if (!penghuniAktif) throw new Error("Status TERISI hanya bisa dipilih jika kamar memiliki penghuni aktif.");
  } else {
    const penghuniAktif = await prisma.penghuni.findFirst({ where: { kamarId: id, status: "AKTIF" } });
    if (penghuniAktif) throw new Error("Kamar masih ditempati penghuni aktif. Ubah status penghuni terlebih dahulu.");
  }

  await prisma.kamar.update({
    where: { id },
    data: {
      nomorKamar,
      harga,
      status,
    },
  });

  revalidatePath("/kamar");
  redirect("/kamar");
}

// Action untuk menghapus kamar
export async function deleteKamar(id: string) {
  // Cek apakah kamar masih ditempati oleh penghuni aktif
  const kamar = await prisma.kamar.findUnique({
    where: { id },
    include: { penghuni: true },
  });

  if (kamar && kamar.penghuni.length > 0) {
    throw new Error("Kamar tidak bisa dihapus karena masih memiliki data riwayat penghuni.");
  }

  await prisma.kamar.delete({
    where: { id },
  });

  revalidatePath("/kamar");
}

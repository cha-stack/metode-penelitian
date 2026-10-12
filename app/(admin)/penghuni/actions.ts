"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StatusKamar, StatusPenghuni } from "@prisma/client";

// Action untuk menambah penghuni baru
export async function createPenghuni(formData: FormData) {
  const nama = formData.get("nama") as string;
  const noHp = formData.get("noHp") as string;
  const alamat = formData.get("alamat") as string;
  const kamarId = formData.get("kamarId") as string;
  const tanggalMasukStr = formData.get("tanggalMasuk") as string;
  const status = (formData.get("status") as StatusPenghuni) || StatusPenghuni.AKTIF;

  if (!nama || !noHp || !alamat || !kamarId || !tanggalMasukStr) {
    throw new Error("Semua data wajib diisi.");
  }

  const tanggalMasuk = new Date(tanggalMasukStr);

  // Jalankan transaksi database:
  // 1. Simpan data penghuni baru
  // 2. Jika penghuni berstatus AKTIF, otomatis ubah status kamar tersebut menjadi TERISI
  await prisma.$transaction(async (tx) => {
    await tx.penghuni.create({
      data: {
        nama,
        noHp,
        alamat,
        kamarId,
        tanggalMasuk,
        status,
      },
    });

    if (status === StatusPenghuni.AKTIF) {
      await tx.kamar.update({
        where: { id: kamarId },
        data: { status: StatusKamar.TERISI },
      });
    }
  });

  // Revalidate halaman penghuni & kamar agar data sinkron seketika
  revalidatePath("/penghuni");
  revalidatePath("/kamar");
  redirect("/penghuni");
}

// Action untuk mengedit data penghuni
export async function updatePenghuni(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  const noHp = formData.get("noHp") as string;
  const alamat = formData.get("alamat") as string;
  const kamarIdBaru = formData.get("kamarId") as string;
  const tanggalMasukStr = formData.get("tanggalMasuk") as string;
  const tanggalKeluarStr = formData.get("tanggalKeluar") as string;
  const status = formData.get("status") as StatusPenghuni;

  if (!nama || !noHp || !alamat || !kamarIdBaru || !tanggalMasukStr) {
    throw new Error("Data wajib tidak boleh kosong.");
  }

  const tanggalMasuk = new Date(tanggalMasukStr);
  const tanggalKeluar = tanggalKeluarStr ? new Date(tanggalKeluarStr) : null;

  // Ambil data penghuni sebelumnya untuk cek riwayat kamar
  const penghuniLama = await prisma.penghuni.findUnique({
    where: { id },
  });

  if (!penghuniLama) {
    throw new Error("Penghuni tidak ditemukan.");
  }

  const kamarLamaId = penghuniLama.kamarId;

  await prisma.$transaction(async (tx) => {
    // 1. Update data penghuni
    await tx.penghuni.update({
      where: { id },
      data: {
        nama,
        noHp,
        alamat,
        kamarId: kamarIdBaru,
        tanggalMasuk,
        tanggalKeluar,
        status,
      },
    });

    // 2. Jika kamar berpindah atau status berubah
    if (kamarLamaId !== kamarIdBaru) {
      // Kamar lama: cek apakah masih ada penghuni aktif lain
      const penghuniLainDiKamarLama = await tx.penghuni.findFirst({
        where: {
          kamarId: kamarLamaId,
          status: StatusPenghuni.AKTIF,
          id: { not: id },
        },
      });

      if (!penghuniLainDiKamarLama) {
        await tx.kamar.update({
          where: { id: kamarLamaId },
          data: { status: StatusKamar.KOSONG },
        });
      }

      // Kamar baru: jika status AKTIF, tandai TERISI
      if (status === StatusPenghuni.AKTIF) {
        await tx.kamar.update({
          where: { id: kamarIdBaru },
          data: { status: StatusKamar.TERISI },
        });
      }
    } else {
      // Kamar tetap sama, tapi cek jika status berubah ke NONAKTIF
      if (status === StatusPenghuni.NONAKTIF) {
        const penghuniAktifLain = await tx.penghuni.findFirst({
          where: {
            kamarId: kamarIdBaru,
            status: StatusPenghuni.AKTIF,
            id: { not: id },
          },
        });

        if (!penghuniAktifLain) {
          await tx.kamar.update({
            where: { id: kamarIdBaru },
            data: { status: StatusKamar.KOSONG },
          });
        }
      } else if (status === StatusPenghuni.AKTIF) {
        await tx.kamar.update({
          where: { id: kamarIdBaru },
          data: { status: StatusKamar.TERISI },
        });
      }
    }
  });

  revalidatePath("/penghuni");
  revalidatePath("/kamar");
  redirect("/penghuni");
}

// Action untuk menghapus penghuni
export async function deletePenghuni(id: string) {
  const penghuni = await prisma.penghuni.findUnique({
    where: { id },
    include: { pembayaran: true },
  });

  if (!penghuni) {
    throw new Error("Data penghuni tidak ditemukan.");
  }

  // Pengaman: Jika sudah memiliki transaksi pembayaran, sebaiknya status di-NONAKTIF-kan daripada dihapus permanen
  if (penghuni.pembayaran.length > 0) {
    throw new Error(
      "Penghuni ini memiliki riwayat pembayaran. Untuk menjaga catatan keuangan, ubah status menjadi NONAKTIF alih-alih menghapus."
    );
  }

  const kamarId = penghuni.kamarId;

  await prisma.$transaction(async (tx) => {
    await tx.penghuni.delete({
      where: { id },
    });

    // Cek apakah ada penghuni aktif lain di kamar ini
    const penghuniAktifLain = await tx.penghuni.findFirst({
      where: {
        kamarId,
        status: StatusPenghuni.AKTIF,
      },
    });

    if (!penghuniAktifLain) {
      await tx.kamar.update({
        where: { id: kamarId },
        data: { status: StatusKamar.KOSONG },
      });
    }
  });

  revalidatePath("/penghuni");
  revalidatePath("/kamar");
}

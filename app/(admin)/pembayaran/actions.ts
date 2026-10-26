"use server";

import { prisma } from "@/lib/prisma";
import { StatusPembayaran } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSession } from "@/lib/auth";

export async function catatPembayaran(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const pembayaran = await prisma.pembayaran.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!pembayaran) throw new Error("Tagihan tidak ditemukan.");
  if (pembayaran.status === StatusPembayaran.LUNAS) throw new Error("Tagihan sudah lunas.");
  await prisma.pembayaran.update({ where: { id }, data: { status: StatusPembayaran.LUNAS, tanggalBayar: new Date() } });
  revalidatePath("/pembayaran");
}

export async function kirimPesanTagihan(formData: FormData) {
  if (!(await hasSession())) redirect("/login");

  const id = String(formData.get("id") ?? "").trim();
  const token = process.env.FONNTE_TOKEN?.trim();
  if (!token) redirect("/pembayaran?error=fonnte_setup");

  const pembayaran = await prisma.pembayaran.findUnique({
    where: { id },
    include: { penghuni: { include: { kamar: true } } },
  });
  if (!pembayaran) redirect("/pembayaran?error=invoice_missing");
  if (pembayaran.status === StatusPembayaran.LUNAS) redirect("/pembayaran?error=invoice_paid");

  const digits = pembayaran.penghuni.noHp.replace(/\D/g, "");
  const target = digits.startsWith("62") ? `0${digits.slice(2)}` : digits.startsWith("0") ? digits : `0${digits}`;
  const rupiah = (nilai: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(nilai);
  const tanggal = (nilai: Date) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(nilai);
  const message = `Halo ${pembayaran.penghuni.nama}, kami ingin mengingatkan tagihan kost kamar ${pembayaran.penghuni.kamar.nomorKamar} sebesar ${rupiah(pembayaran.jumlah)} yang jatuh tempo pada ${tanggal(pembayaran.jatuhTempo)}. Mohon segera melakukan pembayaran. Terima kasih.`;
  const body = new URLSearchParams({ target, message, countryCode: "62" });

  let sent = false;
  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const result = await response.json() as { status?: boolean; Status?: boolean };
    sent = response.ok && (result.status === true || result.Status === true);
  } catch {
    sent = false;
  }

  if (!sent) redirect("/pembayaran?error=fonnte_send");
  revalidatePath("/pembayaran");
  redirect("/pembayaran?sent=1");
}

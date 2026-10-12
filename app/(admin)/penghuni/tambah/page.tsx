import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { createPenghuni } from "../actions";
import { StatusKamar, StatusPenghuni } from "@prisma/client";

// Format mata uang Rupiah
function formatRupiah(nominal: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
}

export default async function TambahPenghuniPage() {
  // Ambil kamar yang saat ini kosong agar bisa dipilih
  const kamarTersedia = await prisma.kamar.findMany({
    where: { status: StatusKamar.KOSONG },
    orderBy: { nomorKamar: "asc" },
  });

  // Default tanggal masuk hari ini (format YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 max-w-2xl">
      <Navbar title="Tambah Penghuni Baru" />

      {/* Breadcrumb / Kembali */}
      <div>
        <Link
          href="/penghuni"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar Penghuni
        </Link>
      </div>

      {/* Form Tambah Penghuni */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Biodata Penghuni Baru</h3>
        <p className="text-xs text-slate-500 mb-6">
          Masukkan informasi penyewa dan pilih kamar yang akan ditempati.
        </p>

        {kamarTersedia.length === 0 ? (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-6">
            <p className="font-semibold">Perhatian: Tidak ada kamar kosong saat ini!</p>
            <p className="text-xs mt-1 text-amber-700">
              Semua kamar yang terdaftar berstatus TERISI. Silakan tambahkan kamar baru terlebih dahulu di menu{" "}
              <Link href="/kamar/tambah" className="underline font-bold">
                Data Kamar
              </Link>
              .
            </p>
          </div>
        ) : null}

        <form action={createPenghuni} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-slate-700 mb-1">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              required
              placeholder="Contoh: Muhammad Farhan"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* No HP / WhatsApp */}
          <div>
            <label htmlFor="noHp" className="block text-sm font-medium text-slate-700 mb-1">
              Nomor WhatsApp / HP <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="noHp"
              name="noHp"
              required
              placeholder="Contoh: 081234567890"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Alamat Asal */}
          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-slate-700 mb-1">
              Alamat Asal / KTP <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="alamat"
              name="alamat"
              required
              rows={2}
              placeholder="Contoh: Jl. Merdeka No. 45, Bandung, Jawa Barat"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Pilihan Kamar */}
          <div>
            <label htmlFor="kamarId" className="block text-sm font-medium text-slate-700 mb-1">
              Pilih Kamar yang Ditempati <span className="text-rose-500">*</span>
            </label>
            <select
              id="kamarId"
              name="kamarId"
              required
              disabled={kamarTersedia.length === 0}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white disabled:bg-slate-100"
            >
              <option value="">-- Pilih Kamar Kosong --</option>
              {kamarTersedia.map((kamar) => (
                <option key={kamar.id} value={kamar.id}>
                  Kamar {kamar.nomorKamar} ({formatRupiah(kamar.harga)}/bulan)
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Kamar yang dipilih akan otomatis berubah status menjadi <strong>TERISI</strong>.
            </p>
          </div>

          {/* Tanggal Masuk */}
          <div>
            <label htmlFor="tanggalMasuk" className="block text-sm font-medium text-slate-700 mb-1">
              Tanggal Masuk <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalMasuk"
              name="tanggalMasuk"
              required
              defaultValue={todayStr}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Status Awal */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Status Penghuni
            </label>
            <select
              id="status"
              name="status"
              defaultValue={StatusPenghuni.AKTIF}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value={StatusPenghuni.AKTIF}>AKTIF (Menempati kos saat ini)</option>
              <option value={StatusPenghuni.NONAKTIF}>NONAKTIF</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              href="/penghuni"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={kamarTersedia.length === 0}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm transition-colors"
            >
              Simpan Penghuni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

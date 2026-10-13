import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createKamar } from "../actions";

export default function TambahKamarPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Navbar title="Tambah Kamar Baru" />

      {/* Breadcrumb / Kembali */}
      <div>
        <Link
          href="/kamar"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar Kamar
        </Link>
      </div>

      {/* Form Tambah Kamar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Informasi Kamar</h3>
        <p className="text-xs text-slate-500 mb-6">
          Masukkan nomor kamar dan harga sewa per bulan.
        </p>

        <form action={createKamar} className="space-y-4">
          {/* Nomor Kamar */}
          <div>
            <label htmlFor="nomorKamar" className="block text-sm font-medium text-slate-700 mb-1">
              Nomor Kamar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="nomorKamar"
              name="nomorKamar"
              required
              placeholder="Contoh: 10, 11, atau A-01"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Harga Kamar */}
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-slate-700 mb-1">
              Harga Sewa per Bulan (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              id="harga"
              name="harga"
              required
              min="0"
              step="50000"
              placeholder="Contoh: 850000"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Status Awal */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Status Awal Kamar
            </label>
            <select
              id="status"
              name="status"
              defaultValue="KOSONG"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value={StatusKamar.KOSONG}>KOSONG (Belum ada penghuni)</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Biasanya kamar baru berstatus KOSONG sampai penghuni didaftarkan.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              href="/kamar"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              Simpan Kamar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

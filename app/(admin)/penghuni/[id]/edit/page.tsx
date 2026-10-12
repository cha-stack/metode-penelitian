import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { updatePenghuni } from "../../actions";
import { StatusKamar, StatusPenghuni } from "@prisma/client";

// Format mata uang Rupiah
function formatRupiah(nominal: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
}

// Format date object ke format string input type="date" (YYYY-MM-DD)
function toInputDateValue(date: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

interface EditPenghuniPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPenghuniPage({ params }: EditPenghuniPageProps) {
  const { id } = await params;

  // Ambil data penghuni
  const penghuni = await prisma.penghuni.findUnique({
    where: { id },
    include: { kamar: true },
  });

  if (!penghuni) {
    notFound();
  }

  // Ambil kamar yang KOSONG ditambah kamar yang sedang ia tempati saat ini
  const kamarPilihan = await prisma.kamar.findMany({
    where: {
      OR: [
        { status: StatusKamar.KOSONG },
        { id: penghuni.kamarId },
      ],
    },
    orderBy: { nomorKamar: "asc" },
  });

  const updatePenghuniWithId = updatePenghuni.bind(null, penghuni.id);

  return (
    <div className="space-y-6 max-w-2xl">
      <Navbar title={`Edit Penghuni: ${penghuni.nama}`} />

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

      {/* Form Edit Penghuni */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Perbarui Data Penghuni</h3>
        <p className="text-xs text-slate-500 mb-6">
          Ubah biodata, pindah kamar, atau catat tanggal keluar penghuni.
        </p>

        <form action={updatePenghuniWithId} className="space-y-4">
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
              defaultValue={penghuni.nama}
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
              defaultValue={penghuni.noHp}
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
              defaultValue={penghuni.alamat}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Pilihan Kamar */}
          <div>
            <label htmlFor="kamarId" className="block text-sm font-medium text-slate-700 mb-1">
              Kamar yang Ditempati <span className="text-rose-500">*</span>
            </label>
            <select
              id="kamarId"
              name="kamarId"
              required
              defaultValue={penghuni.kamarId}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {kamarPilihan.map((kamar) => (
                <option key={kamar.id} value={kamar.id}>
                  Kamar {kamar.nomorKamar} ({formatRupiah(kamar.harga)}/bulan) {kamar.id === penghuni.kamarId ? "(Saat Ini)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Tanggal Masuk & Keluar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tanggalMasuk" className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal Masuk <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="tanggalMasuk"
                name="tanggalMasuk"
                required
                defaultValue={toInputDateValue(penghuni.tanggalMasuk)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>

            <div>
              <label htmlFor="tanggalKeluar" className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal Keluar (Opsional)
              </label>
              <input
                type="date"
                id="tanggalKeluar"
                name="tanggalKeluar"
                defaultValue={toInputDateValue(penghuni.tanggalKeluar)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Status Penghuni */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Status Penghuni
            </label>
            <select
              id="status"
              name="status"
              defaultValue={penghuni.status}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value={StatusPenghuni.AKTIF}>AKTIF (Masih ngekos)</option>
              <option value={StatusPenghuni.NONAKTIF}>NONAKTIF (Sudah keluar/checkout)</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Jika status diubah ke NONAKTIF, kamar akan otomatis kembali <strong>KOSONG</strong>.
            </p>
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
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

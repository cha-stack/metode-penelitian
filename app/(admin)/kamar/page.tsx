import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import DeleteKamarButton from "./DeleteButton";
import { StatusKamar } from "@prisma/client";

// Format angka ke format mata uang Rupiah
function formatRupiah(nominal: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
}

export default async function KamarPage() {
  // Ambil data seluruh kamar langsung dari PostgreSQL Neon
  const listKamar = await prisma.kamar.findMany({
    include: {
      penghuni: {
        where: { status: "AKTIF" },
      },
    },
    orderBy: {
      nomorKamar: "asc",
    },
  });

  // Hitung ringkasan status kamar
  const totalKamar = listKamar.length;
  const kamarTerisi = listKamar.filter((k) => k.status === StatusKamar.TERISI).length;
  const kamarKosong = listKamar.filter((k) => k.status === StatusKamar.KOSONG).length;

  return (
    <div className="space-y-6">
      <Navbar title="Manajemen Data Kamar" />

      {/* Ringkasan & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Total Kamar</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{totalKamar}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-emerald-600 font-medium">Kamar Terisi</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">{kamarTerisi}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-amber-600 font-medium">Kamar Kosong</p>
            <p className="text-xl font-bold text-amber-700 mt-1">{kamarKosong}</p>
          </div>
        </div>

        <div>
          <Link
            href="/kamar/tambah"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Kamar Baru
          </Link>
        </div>
      </div>

      {/* Tabel Data Kamar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Daftar Seluruh Kamar</h3>
          <span className="text-xs text-slate-400">Total {totalKamar} kamar terdaftar</span>
        </div>

        {totalKamar === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-700">Belum ada data kamar</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Silakan tambahkan data kamar pertama Anda untuk mulai mengelola kos.
            </p>
            <Link
              href="/kamar/tambah"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + Tambah Kamar Sekarang
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-6">Nomor Kamar</th>
                  <th className="py-3 px-6">Harga / Bulan</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Penghuni Aktif</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listKamar.map((kamar) => {
                  const penghuniAktif = kamar.penghuni[0];
                  return (
                    <tr key={kamar.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        Kamar {kamar.nomorKamar}
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {formatRupiah(kamar.harga)}
                      </td>
                      <td className="py-4 px-6">
                        {kamar.status === StatusKamar.TERISI ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            TERISI
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            KOSONG
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {penghuniAktif ? (
                          <span className="font-medium text-slate-800">{penghuniAktif.nama}</span>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/kamar/${kamar.id}/edit`}
                            className="text-xs font-medium text-slate-600 hover:text-emerald-700 p-1.5 hover:bg-slate-100 rounded transition-colors"
                          >
                            Edit
                          </Link>
                          <span className="text-slate-200">|</span>
                          <DeleteKamarButton id={kamar.id} nomorKamar={kamar.nomorKamar} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

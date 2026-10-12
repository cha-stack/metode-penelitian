import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import DeletePenghuniButton from "./DeleteButton";
import { StatusPenghuni } from "@prisma/client";

// Format tanggal ke format Indonesia (contoh: 15 Jan 2026)
function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// Format mata uang Rupiah
function formatRupiah(nominal: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
}

export default async function PenghuniPage() {
  // Query data seluruh penghuni beserta info kamarnya dari Neon PostgreSQL
  const listPenghuni = await prisma.penghuni.findMany({
    include: {
      kamar: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPenghuni = listPenghuni.length;
  const penghuniAktif = listPenghuni.filter((p) => p.status === StatusPenghuni.AKTIF).length;
  const penghuniNonaktif = listPenghuni.filter((p) => p.status === StatusPenghuni.NONAKTIF).length;

  return (
    <div className="space-y-6">
      <Navbar title="Manajemen Data Penghuni" />

      {/* Ringkasan & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 w-full sm:w-auto">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Total Terdata</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{totalPenghuni}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-emerald-600 font-medium">Penghuni Aktif</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">{penghuniAktif}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Nonaktif (Keluar)</p>
            <p className="text-xl font-bold text-slate-700 mt-1">{penghuniNonaktif}</p>
          </div>
        </div>

        <div>
          <Link
            href="/penghuni/tambah"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Penghuni Baru
          </Link>
        </div>
      </div>

      {/* Tabel Data Penghuni */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Daftar Penghuni Kos</h3>
          <span className="text-xs text-slate-400">Total {totalPenghuni} orang tercatat</span>
        </div>

        {totalPenghuni === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-700">Belum ada data penghuni</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Daftarkan penghuni yang menempati kamar kos Anda sekarang.
            </p>
            <Link
              href="/penghuni/tambah"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + Tambah Penghuni Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-6">Nama Penghuni</th>
                  <th className="py-3 px-6">Kamar</th>
                  <th className="py-3 px-6">No. WhatsApp / HP</th>
                  <th className="py-3 px-6">Alamat Asal</th>
                  <th className="py-3 px-6">Tgl Masuk</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listPenghuni.map((penghuni) => {
                  const cleanPhone = penghuni.noHp.replace(/\D/g, "");
                  const waNumber = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;

                  return (
                    <tr key={penghuni.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {penghuni.nama}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800">Kamar {penghuni.kamar.nomorKamar}</span>
                        <span className="block text-xs text-slate-500">
                          {formatRupiah(penghuni.kamar.harga)}/bln
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1.5"
                          title="Hubungi via WhatsApp"
                        >
                          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 1.743 1.942 2.062.193.167.356.183.498.106.142-.077.608-.707.769-.949.161-.242.322-.202.54-.121.217.081 1.378.65 1.616.769.238.119.397.177.455.275.058.098.058.568-.086.973z" />
                          </svg>
                          {penghuni.noHp}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-slate-600 max-w-xs truncate" title={penghuni.alamat}>
                        {penghuni.alamat}
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {formatTanggal(penghuni.tanggalMasuk)}
                      </td>
                      <td className="py-4 px-6">
                        {penghuni.status === StatusPenghuni.AKTIF ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            AKTIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                            NONAKTIF
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/penghuni/${penghuni.id}/edit`}
                            className="text-xs font-medium text-slate-600 hover:text-emerald-700 p-1.5 hover:bg-slate-100 rounded transition-colors"
                          >
                            Edit
                          </Link>
                          <span className="text-slate-200">|</span>
                          <DeletePenghuniButton id={penghuni.id} nama={penghuni.nama} />
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

import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { StatusPembayaran } from "@prisma/client";

const rupiah = (nilai: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(nilai);
const tanggal = (nilai: Date) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(nilai);

export default async function LaporanPage({ searchParams }: { searchParams: Promise<{ bulan?: string }> }) {
  const { bulan } = await searchParams;
  const today = new Date();
  const validBulan = bulan && /^\d{4}-\d{2}$/.test(bulan) ? bulan : `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [tahun, month] = validBulan.split("-").map(Number);
  const awal = new Date(tahun, month - 1, 1);
  const akhir = new Date(tahun, month, 1);
  const rows = await prisma.pembayaran.findMany({ where: { jatuhTempo: { gte: awal, lt: akhir } }, include: { penghuni: { include: { kamar: true } } }, orderBy: { jatuhTempo: "asc" } });
  const sudahDibayar = rows.filter((row) => row.status === StatusPembayaran.LUNAS);
  const belum = rows.filter((row) => row.status !== StatusPembayaran.LUNAS);
  const totalMasuk = sudahDibayar.reduce((sum, row) => sum + row.jumlah, 0);
  const sisa = belum.reduce((sum, row) => sum + row.jumlah, 0);
  const csv = ["Penghuni,Kamar,Jatuh Tempo,Jumlah,Status,Tanggal Bayar", ...rows.map((row) => [row.penghuni.nama, row.penghuni.kamar.nomorKamar, row.jatuhTempo.toISOString().slice(0, 10), row.jumlah, row.status, row.tanggalBayar?.toISOString().slice(0, 10) ?? ""].map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))].join("\n");
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent("\uFEFF" + csv)}`;
  return <div className="space-y-6"><Navbar title="Laporan Keuangan" /><form className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5"><label className="text-sm text-slate-600">Bulan laporan<input type="month" name="bulan" defaultValue={validBulan} className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" /></label><button className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white">Tampilkan</button><a href={csvHref} download={`laporan-kos-${validBulan}.csv`} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">Unduh CSV</a></form><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-white p-4"><p className="text-xs text-slate-500">Tagihan periode ini</p><p className="mt-1 text-xl font-bold">{rupiah(rows.reduce((sum, row) => sum + row.jumlah, 0))}</p><p className="text-xs text-slate-500">{rows.length} tagihan</p></div><div className="rounded-xl border bg-white p-4"><p className="text-xs text-emerald-700">Pembayaran diterima</p><p className="mt-1 text-xl font-bold text-emerald-700">{rupiah(totalMasuk)}</p><p className="text-xs text-slate-500">{sudahDibayar.length} tagihan lunas</p></div><div className="rounded-xl border bg-white p-4"><p className="text-xs text-amber-700">Belum diterima</p><p className="mt-1 text-xl font-bold text-amber-700">{rupiah(sisa)}</p><p className="text-xs text-slate-500">{belum.length} tagihan belum lunas</p></div></div><section className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Penghuni</th><th className="px-5 py-3">Kamar</th><th className="px-5 py-3">Jatuh tempo</th><th className="px-5 py-3">Jumlah</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="px-5 py-4">{row.penghuni.nama}</td><td className="px-5 py-4">{row.penghuni.kamar.nomorKamar}</td><td className="px-5 py-4">{tanggal(row.jatuhTempo)}</td><td className="px-5 py-4">{rupiah(row.jumlah)}</td><td className="px-5 py-4">{row.status === StatusPembayaran.LUNAS ? "LUNAS" : row.jatuhTempo < new Date() ? "MENUNGGAK" : "BELUM BAYAR"}</td></tr>)}</tbody></table>{!rows.length && <p className="p-10 text-center text-sm text-slate-500">Belum ada tagihan di periode ini.</p>}</section></div>;
}

import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { StatusPembayaran } from "@prisma/client";
import { catatPembayaran } from "./actions";
import { pastikanTagihanBulanIni } from "@/lib/tagihan";
import Link from "next/link";

const rupiah = (nilai: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(nilai);
const tanggal = (nilai: Date) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(nilai);

export default async function PembayaranPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status: filter } = await searchParams;
  await pastikanTagihanBulanIni();
  const now = new Date();
  const rows = await prisma.pembayaran.findMany({
    include: { penghuni: { include: { kamar: true } } },
    orderBy: [{ jatuhTempo: "asc" }, { createdAt: "desc" }],
  });
  const tagihan = rows.map((row) => ({ ...row, statusTampil: row.status === StatusPembayaran.LUNAS ? StatusPembayaran.LUNAS : row.jatuhTempo < new Date(now.getFullYear(), now.getMonth(), now.getDate()) ? StatusPembayaran.MENUNGGAK : StatusPembayaran.BELUM_BAYAR }));
  const tampil = filter === "MENUNGGAK" ? tagihan.filter((row) => row.statusTampil === StatusPembayaran.MENUNGGAK) : filter === "BELUM_BAYAR" ? tagihan.filter((row) => row.statusTampil !== StatusPembayaran.LUNAS) : tagihan;
  const lunas = tagihan.filter((row) => row.statusTampil === StatusPembayaran.LUNAS).length;
  const tunggakan = tagihan.filter((row) => row.statusTampil === StatusPembayaran.MENUNGGAK).length;
  const belumBayar = tagihan.filter((row) => row.statusTampil !== StatusPembayaran.LUNAS).length;
  const label = (value: string) => value === "MENUNGGAK" ? "Menunggak" : value === "BELUM_BAYAR" ? "Belum lunas" : "Semua tagihan";

  return <div className="space-y-6"><Navbar title="Tagihan & Pembayaran" />
    <p className="text-sm text-slate-700">Tagihan penghuni aktif dibuat otomatis setiap bulan berdasarkan tanggal masuk masing-masing.</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-white p-4"><p className="text-xs text-slate-500">Belum lunas</p><p className="mt-1 text-xl font-bold text-slate-800">{belumBayar}</p></div><div className="rounded-xl border bg-white p-4"><p className="text-xs text-amber-600">Menunggak</p><p className="mt-1 text-xl font-bold text-amber-700">{tunggakan}</p></div><div className="rounded-xl border bg-white p-4"><p className="text-xs text-emerald-600">Lunas</p><p className="mt-1 text-xl font-bold text-emerald-700">{lunas}</p></div></div>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h2 className="font-semibold text-slate-800">Daftar Tagihan</h2><p className="mt-1 text-xs text-slate-700">Tampilan: {label(filter ?? "SEMUA")}</p></div><nav className="flex gap-2 text-xs">{[["/pembayaran", "Semua"], ["/pembayaran?status=BELUM_BAYAR", "Belum lunas"], ["/pembayaran?status=MENUNGGAK", "Menunggak"]].map(([href, text]) => <Link key={href} href={href} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">{text}</Link>)}</nav></div>
      {!tampil.length ? <div className="p-12 text-center text-sm text-slate-700">Belum ada tagihan untuk filter ini.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-700"><tr><th className="px-5 py-3">Penghuni / Kamar</th><th className="px-5 py-3">Jumlah</th><th className="px-5 py-3">Jatuh tempo</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Tanggal bayar</th><th className="px-5 py-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{tampil.map((row) => <tr key={row.id}><td className="px-5 py-4"><strong>{row.penghuni.nama}</strong><span className="block text-xs text-slate-700">Kamar {row.penghuni.kamar.nomorKamar}</span></td><td className="px-5 py-4 font-medium">{rupiah(row.jumlah)}</td><td className="px-5 py-4">{tanggal(row.jatuhTempo)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.statusTampil === StatusPembayaran.LUNAS ? "bg-emerald-100 text-emerald-800" : row.statusTampil === StatusPembayaran.MENUNGGAK ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>{row.statusTampil === StatusPembayaran.LUNAS ? "LUNAS" : row.statusTampil === StatusPembayaran.MENUNGGAK ? "MENUNGGAK" : "BELUM BAYAR"}</span></td><td className="px-5 py-4">{row.tanggalBayar ? tanggal(row.tanggalBayar) : "—"}</td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-2">{row.statusTampil !== StatusPembayaran.LUNAS && <><a href={`https://wa.me/${row.penghuni.noHp.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(`Halo ${row.penghuni.nama}, kami ingin mengingatkan tagihan kost kamar ${row.penghuni.kamar.nomorKamar} sebesar ${rupiah(row.jumlah)} yang jatuh tempo pada ${tanggal(row.jatuhTempo)}. Mohon segera melakukan pembayaran. Terima kasih.`)}`} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-600 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">Kirim pesan</a><form action={catatPembayaran} className="inline"><input type="hidden" name="id" value={row.id} /><button className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">Catat lunas</button></form></>}</div></td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}

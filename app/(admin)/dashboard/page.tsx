import Link from "next/link";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { StatusPembayaran, StatusPenghuni, StatusKamar } from "@prisma/client";

const rupiah = (nilai: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(nilai);

export default async function DashboardPage() {
  const now = new Date();
  const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);
  const awalBulanDepan = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [kamar, penghuniAktif, pembayaranBulanIni, semuaTagihan] = await Promise.all([
    prisma.kamar.findMany({ select: { status: true } }),
    prisma.penghuni.count({ where: { status: StatusPenghuni.AKTIF } }),
    prisma.pembayaran.findMany({ where: { jatuhTempo: { gte: awalBulan, lt: awalBulanDepan } }, select: { jumlah: true, status: true, jatuhTempo: true } }),
    prisma.pembayaran.findMany({ where: { status: { not: StatusPembayaran.LUNAS } }, select: { jumlah: true, jatuhTempo: true } }),
  ]);
  const lunas = pembayaranBulanIni.filter((row) => row.status === StatusPembayaran.LUNAS);
  const tunggakan = semuaTagihan.filter((row) => row.jatuhTempo < new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const kamarTerisi = kamar.filter((row) => row.status === StatusKamar.TERISI).length;
  const kamarKosong = kamar.length - kamarTerisi;
  const totalTagihanBulanIni = pembayaranBulanIni.length;
  const belumLunas = totalTagihanBulanIni - lunas.length;
  const kartu = [
    ["Total kamar", kamar.length, `${kamar.filter((row) => row.status === StatusKamar.TERISI).length} terisi`],
    ["Penghuni aktif", penghuniAktif, "Penghuni terdaftar"],
    ["Pembayaran bulan ini", rupiah(lunas.reduce((total, row) => total + row.jumlah, 0)), `${lunas.length} tagihan lunas`],
    ["Total tunggakan", rupiah(tunggakan.reduce((total, row) => total + row.jumlah, 0)), `${tunggakan.length} tagihan lewat tempo`],
  ];
  return <div className="space-y-6"><Navbar title="Dashboard" /><p className="text-sm text-slate-500">Ringkasan pengelolaan kos untuk {new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(now)}.</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kartu.map(([title, value, note]) => <div key={String(title)} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold text-slate-800">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>)}</div><section className="grid gap-4 lg:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold text-slate-800">Ketersediaan kamar</h2><div className="mt-5 flex h-5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${kamarTerisi} kamar terisi, ${kamarKosong} kamar kosong`}>{kamarTerisi > 0 && <div className="bg-emerald-500" style={{ width: `${(kamarTerisi / Math.max(kamar.length, 1)) * 100}%` }} />}{kamarKosong > 0 && <div className="bg-amber-300" style={{ width: `${(kamarKosong / Math.max(kamar.length, 1)) * 100}%` }} />}</div><div className="mt-3 flex justify-between text-sm"><span className="text-emerald-700">● Terisi {kamarTerisi}</span><span className="text-amber-700">● Kosong {kamarKosong}</span></div></div><div className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold text-slate-800">Tagihan bulan ini</h2><div className="mt-5 flex h-5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${lunas.length} lunas, ${belumLunas} belum lunas`}>{lunas.length > 0 && <div className="bg-emerald-500" style={{ width: `${(lunas.length / Math.max(totalTagihanBulanIni, 1)) * 100}%` }} />}{belumLunas > 0 && <div className="bg-rose-300" style={{ width: `${(belumLunas / Math.max(totalTagihanBulanIni, 1)) * 100}%` }} />}</div><div className="mt-3 flex justify-between text-sm"><span className="text-emerald-700">● Lunas {lunas.length}</span><span className="text-rose-700">● Belum lunas {belumLunas}</span></div></div></section><div className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold text-slate-800">Akses cepat</h2><div className="mt-4 flex flex-wrap gap-3"><Link className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white" href="/pembayaran">Buka tagihan & pembayaran</Link><Link className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700" href="/penghuni">Kelola penghuni</Link><Link className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700" href="/kamar">Kelola kamar</Link></div></div></div>;
}

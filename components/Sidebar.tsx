"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/logout/actions";

// Daftar menu navigasi admin
const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Data Kamar",
    href: "/kamar",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    name: "Data Penghuni",
    href: "/penghuni",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: "Tagihan & Pembayaran",
    href: "/pembayaran",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: "Laporan Keuangan",
    href: "/laporan",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <span className="font-bold tracking-tight text-slate-900">Kost Al Kasyaaf</span>
        <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
          {open ? <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" /></svg> : <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      </div>
      {open && <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/50 md:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex min-h-screen w-72 shrink-0 flex-col bg-slate-900 text-slate-100 transition-transform duration-200 md:sticky md:top-0 md:w-64 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
            AK
          </span>
          Kost Al Kasyaaf
        </h1>
        <p className="text-xs text-slate-400 mt-1">Sistem Pengelolaan Kos</p>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          // Cek apakah halaman ini sedang aktif
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Pemilik */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
            PK
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200">Pemilik Kos</p>
            <p className="text-[11px] text-slate-400">Administrator</p>
          </div>
          <form action={logout}><button className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-white">Keluar</button></form>
        </div>
      </div>
    </aside>
    </>
  );
}

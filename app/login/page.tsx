import { redirect } from "next/navigation";
import { hasSession } from "@/lib/auth";
import { login } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await hasSession()) redirect("/dashboard");
  const { error } = await searchParams;
  return <main className="flex min-h-screen items-center justify-center bg-slate-100 p-5"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="mb-7"><p className="text-sm font-semibold text-emerald-700">Kost Al Kasyaaf</p><h1 className="mt-2 text-2xl font-bold text-slate-900">Masuk ke akun admin</h1><p className="mt-2 text-sm text-slate-500">Masukkan email dan kata sandi admin untuk melanjutkan.</p></div>{error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">Email atau kata sandi salah.</p>}<form action={login} className="space-y-4"><label className="block text-sm font-medium text-slate-700">Email<input required type="email" name="email" autoComplete="username" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label><label className="block text-sm font-medium text-slate-700">Kata sandi<input required type="password" name="password" autoComplete="current-password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label><button className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700">Masuk</button></form></section></main>;
}

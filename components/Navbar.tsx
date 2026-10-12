export default function Navbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-base font-bold leading-tight text-slate-800 sm:text-lg">{title || "Dashboard Pengelola"}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Database */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs font-medium text-emerald-700 sm:px-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline">Database Terhubung (Neon)</span>
          <span className="sm:hidden">Neon</span>
        </div>
      </div>
    </header>
  );
}

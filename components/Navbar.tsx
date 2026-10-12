export default function Navbar({ title }: { title?: string }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-slate-800">{title || "Dashboard Pengelola"}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Database */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Database Terhubung (Neon)</span>
        </div>
      </div>
    </header>
  );
}

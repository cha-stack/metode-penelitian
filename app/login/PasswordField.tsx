"use client";

import { useState } from "react";

export default function PasswordField() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-1">
      <input
        required
        type={visible ? "text" : "password"}
        name="password"
        autoComplete="current-password"
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-20"
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-pressed={visible}
        className="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
      >
        {visible ? "Sembunyikan" : "Lihat"}
      </button>
    </div>
  );
}

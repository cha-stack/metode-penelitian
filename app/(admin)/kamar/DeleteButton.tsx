"use client";

import { useTransition } from "react";
import { deleteKamar } from "./actions";

export default function DeleteKamarButton({
  id,
  nomorKamar,
}: {
  id: string;
  nomorKamar: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus Kamar ${nomorKamar}?`)) {
      startTransition(async () => {
        try {
          await deleteKamar(id);
        } catch (error) {
          alert((error as Error).message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs font-medium text-rose-600 hover:text-rose-800 disabled:opacity-50 p-1.5 hover:bg-rose-50 rounded transition-colors"
      title="Hapus Kamar"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}

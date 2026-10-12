"use client";

import { useTransition } from "react";
import { deletePenghuni } from "./actions";

export default function DeletePenghuniButton({
  id,
  nama,
}: {
  id: string;
  nama: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus data penghuni ${nama}?`)) {
      startTransition(async () => {
        try {
          await deletePenghuni(id);
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
      title="Hapus Penghuni"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}

import { redirect } from "next/navigation";

export default function TunggakanPage() {
  redirect("/pembayaran?status=MENUNGGAK");
}

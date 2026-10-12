import { redirect } from "next/navigation";

export default function Home() {
  // Sementara belum ada login, arahkan langsung ke ringkasan aplikasi.
  redirect("/dashboard");
}

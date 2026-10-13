"use server";

import { redirect } from "next/navigation";
import { startSession, validCredentials } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!validCredentials(email, password)) redirect("/login?error=1");
  await startSession(email);
  redirect("/dashboard");
}

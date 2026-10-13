"use server";

import { endSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logout() {
  await endSession();
  redirect("/login");
}

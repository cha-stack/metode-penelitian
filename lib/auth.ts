import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "kost_admin_session";

function signature(value: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET belum dikonfigurasi.");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function validCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  return Boolean(adminEmail && adminPassword && email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword);
}

export async function startSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, expires: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${payload}.${signature(payload)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function hasSession() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [payload, supplied] = value.split(".");
  if (!payload || !supplied) return false;
  let expected: string;
  try { expected = signature(payload); } catch { return false; }
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; expires: number };
    return session.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase() && session.expires > Date.now();
  } catch { return false; }
}

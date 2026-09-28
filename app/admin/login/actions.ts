"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  verifyAdminCredentials,
} from "@/lib/auth/admin-session"

export type LoginState = {
  error?: string
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const next = String(formData.get("next") ?? "/admin")

  if (!username || !password) {
    return { error: "Informe usuário e senha." }
  }

  if (!verifyAdminCredentials(username, password)) {
    return { error: "Usuário ou senha inválidos." }
  }

  const token = await createAdminSessionToken(username)
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  })

  redirect(next.startsWith("/admin") ? next : "/admin")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME)
  redirect("/admin/login")
}

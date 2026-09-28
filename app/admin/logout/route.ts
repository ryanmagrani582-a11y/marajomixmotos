import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/auth/admin-session"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME)
  return NextResponse.redirect(new URL("/admin/login", request.url))
}

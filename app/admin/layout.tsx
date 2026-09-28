import type React from "react"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth/admin-session"

// A proteção de acesso ao painel é feita pelo middleware (middleware.ts),
// que redireciona para /admin/login quando não há sessão válida. A página
// de login não usa este layout (ela renderiza sua própria tela cheia).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar username={session?.username} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

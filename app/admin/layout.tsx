import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"

// TODO(supabase): proteger este layout com Supabase Auth — validar sessão do usuário
// e redirecionar para /admin/login quando não autenticado ou sem a role "admin"
// na tabela `profiles`. Por ora o painel é exibido sem autenticação real.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-foreground">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

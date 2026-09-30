"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  MenuIcon,
  LayoutDashboardIcon,
  PackageIcon,
  TagsIcon,
  UsersIcon,
  ImageIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/admin/login/actions"

const items = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
  { label: "Produtos", href: "/admin/produtos", icon: PackageIcon },
  { label: "Categorias", href: "/admin/categorias", icon: TagsIcon },
  { label: "Leads", href: "/admin/leads", icon: UsersIcon },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Configurações", href: "/admin/configuracoes", icon: SettingsIcon },
]

const descriptions: Record<string, string> = {
  "/admin": "Visão geral do painel",
  "/admin/produtos": "Catálogo de veículos e produtos",
  "/admin/categorias": "Organização do showroom",
  "/admin/leads": "Contatos recebidos pelo site",
  "/admin/banners": "Carrossel da home",
  "/admin/configuracoes": "Dados institucionais e contato",
}

function resolveDescription(pathname: string) {
  if (descriptions[pathname]) return descriptions[pathname]
  const base = Object.keys(descriptions).find((key) => key !== "/admin" && pathname.startsWith(key))
  return base ? descriptions[base] : ""
}

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/produtos": "Produtos",
  "/admin/categorias": "Categorias",
  "/admin/leads": "Leads",
  "/admin/banners": "Banners",
  "/admin/configuracoes": "Configurações",
}

function resolveTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname]
  const base = Object.keys(titles).find((key) => key !== "/admin" && pathname.startsWith(key))
  return base ? titles[base] : "Admin"
}

export function AdminTopbar({ username }: { username?: string }) {
  const pathname = usePathname()
  const initials = (username ?? "MM")
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="lg:hidden" />}
          >
            <MenuIcon />
            <span className="sr-only">Abrir menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card p-0">
            <SheetHeader className="border-b border-border px-6 py-4">
              <SheetTitle className="sr-only">Menu do painel</SheetTitle>
              <Image
                src="/images/marajo-motors-logo.png"
                alt="Marajó Motors"
                width={480}
                height={192}
                className="h-8 w-auto object-contain"
              />
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4">
              {items.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="min-w-0">
          <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {resolveTitle(pathname)}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{resolveDescription(pathname)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">{username ?? "Administrador"}</p>
          <p className="text-xs text-muted-foreground">Marajó Motors</p>
        </div>
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary">{initials || "MM"}</AvatarFallback>
        </Avatar>
        {/* Logout via Server Action (POST): um <Link> seria pré-carregado pelo Next.js e apagaria a sessão sozinho. */}
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="icon" title="Sair">
            <LogOutIcon />
            <span className="sr-only">Sair</span>
          </Button>
        </form>
      </div>
    </header>
  )
}

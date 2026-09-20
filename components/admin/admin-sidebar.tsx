"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  PackageIcon,
  TagsIcon,
  UsersIcon,
  ImageIcon,
  SettingsIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const groups = [
  {
    label: "Visão geral",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboardIcon }],
  },
  {
    label: "Catálogo",
    items: [
      { label: "Produtos", href: "/admin/produtos", icon: PackageIcon },
      { label: "Categorias", href: "/admin/categorias", icon: TagsIcon },
    ],
  },
  {
    label: "Atendimento",
    items: [{ label: "Leads", href: "/admin/leads", icon: UsersIcon }],
  },
  {
    label: "Site",
    items: [
      { label: "Banners", href: "/admin/banners", icon: ImageIcon },
      { label: "Configurações", href: "/admin/configuracoes", icon: SettingsIcon },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0B0B0B] lg:flex">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link href="/admin" className="flex items-center gap-2" aria-label="Painel administrativo Marajó Motors">
          <Image
            src="/images/marajo-motors-logo.png"
            alt="Marajó Motors"
            width={480}
            height={192}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {isActive ? (
                    <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" aria-hidden />
                  ) : null}
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <ExternalLinkIcon className="size-4" />
          Ver site público
        </Link>
      </div>
    </aside>
  )
}

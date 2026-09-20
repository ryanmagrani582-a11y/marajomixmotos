"use client"

import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { InstagramIcon } from "@/components/icons/instagram-icon"
import { mockCategories } from "@/lib/data/mock-categories"
import type { Category } from "@/lib/types"
import { useSiteSettings } from "@/hooks/use-site-settings"

export function Footer() {
  const { settings } = useSiteSettings()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings?.institutionalText ??
                "Uma experiência completa para quem busca produtos de mobilidade, aventura, trabalho e lazer."}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={settings?.instagram ?? "https://www.instagram.com/marajomotorsoficial/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Marajó Motors"
                className="flex size-10 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
              Categorias
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {mockCategories.map((category: Category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categorias/${category.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
              Contato
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{settings?.phone ?? "Telefone a definir"}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{settings?.address ?? "Endereço a definir"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Marajó Motors. Todos os direitos reservados.</p>
          <p>Conteúdo institucional e comercial sujeito a atualização.</p>
        </div>
      </div>
    </footer>
  )
}

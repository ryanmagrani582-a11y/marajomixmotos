"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { mainNav } from "@/lib/nav"
import { Logo } from "@/components/layout/logo"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Abrir menu" />}>
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full border-l border-border bg-background p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle render={<Logo />} />
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-6 py-8">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 font-heading text-2xl font-medium uppercase tracking-tight text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/produtos"
            onClick={() => setOpen(false)}
            className="py-3 font-heading text-2xl font-medium uppercase tracking-tight text-muted-foreground transition-colors hover:text-primary"
          >
            CATÁLOGO
          </Link>
        </nav>
        <div className="mt-auto border-t border-border px-6 py-6">
          <WhatsAppCtaButton size="lg" className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { mainNav } from "@/lib/nav"
import { Logo } from "@/components/layout/logo"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 py-2.5 backdrop-blur-md"
          : "border-b border-transparent bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="hidden md:flex" />

        <nav className="hidden items-center gap-8 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <WhatsAppCtaButton size="sm">Falar com consultor</WhatsAppCtaButton>
        </div>

        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

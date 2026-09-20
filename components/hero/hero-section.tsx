import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockBanners } from "@/lib/data/mock-site"

const heroQuickLinks = [
  { label: "Motos Yamaha", href: "/categorias/motos" },
  { label: "Náutica Yamaha", href: "/categorias/nautica" },
  { label: "Scooters", href: "/categorias/scooters" },
  { label: "Consórcio Yamaha", href: "/consorcio" },
]

/**
 * Hero da home. Hoje alimentado pelo primeiro banner ativo em `mock-site.ts`;
 * futuramente virá da tabela `banners` (imagem em Supabase Storage).
 */
export function HeroSection() {
  const banner = mockBanners.find((b) => b.active) ?? mockBanners[0]

  return (
    <section className="relative min-h-[115vw] w-full bg-background md:flex md:min-h-[700px] md:items-end md:overflow-hidden">
      {/* Desktop: imagem como background */}
      <Image
        src={banner.imageDesktop || "/placeholder.svg"}
        alt=""
        fill
        priority
        className="hidden object-cover md:block"
        sizes="100vw"
      />

      {/* Mobile: imagem como conteúdo estático com altura fixa */}
      <div className="relative md:hidden">
        <Image
          src={banner.imageMobile || banner.imageDesktop || "/placeholder.svg"}
          alt=""
          width={1280}
          height={1470}
          priority
          className="h-auto w-full object-contain"
        />
        <div className="h-32" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-background via-background/95 to-transparent" />
      </div>

      {/* Desktop: gradients */}
      <div className="hidden md:absolute md:inset-0 md:bg-gradient-to-t md:from-background md:via-background/70 md:to-background/20" />
      <div className="hidden md:absolute md:inset-0 md:bg-gradient-to-r md:from-background md:via-background/70 md:via-30% md:to-transparent md:to-75%" />

      {/* Conteúdo: abaixo da imagem no mobile (fluxo normal), sobreposto no desktop */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-36 sm:px-6 sm:pb-12 sm:pt-28 md:relative md:inset-auto md:bottom-auto md:mt-0 md:pb-20 md:pt-32 lg:px-8">
        <div
          className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 text-center duration-700 md:mx-0 md:text-left"
          style={{ animationFillMode: "backwards" }}
        >
          {/* Logo: mostrar só no desktop */}
          <Image
            src="/images/marajo-motors-logo.png"
            alt="Marajó Motors"
            width={640}
            height={320}
            priority
            className="hidden h-20 w-auto sm:h-24 md:block lg:h-28"
          />
          <h1 className="mt-36 font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight text-foreground sm:mt-0 sm:text-5xl lg:text-6xl">
            {banner.title}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white sm:mt-5 sm:text-lg md:mx-0">
            {banner.subtitle}
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center md:items-center md:justify-start">
            <Button
              render={<Link href={banner.ctaLink ?? "/produtos"} />}
              nativeButton={false}
              size="lg"
              className="h-12 w-full px-6 text-sm sm:w-auto"
            >
              {banner.ctaLabel ?? "VER PRODUTOS"}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href="/contato" />}
              nativeButton={false}
              size="lg"
              className="h-12 w-full bg-white px-6 text-sm text-primary hover:bg-white/90 sm:w-auto"
            >
              FALAR COM UM CONSULTOR
            </Button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground sm:mt-4">Yamaha Motos e Sousa Motos</p>
        </div>

        <nav className="mt-8 hidden flex-wrap gap-x-6 gap-y-3 border-t border-border/60 pt-6 sm:mt-14 sm:flex sm:gap-x-8 md:flex">
          {heroQuickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}

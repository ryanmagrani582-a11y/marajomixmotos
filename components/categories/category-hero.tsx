import Image from "next/image"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"
import type { Category } from "@/lib/types"

export function CategoryHero({ category }: { category: Category }) {
  return (
    <section className="relative flex min-h-[380px] items-center overflow-hidden border-b border-border">
      <Image
        src={category.image || "/placeholder.svg"}
        alt={category.name}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Marajó Motors
        </p>
        <h1 className="mt-2 max-w-2xl font-heading text-4xl font-bold uppercase leading-[1.05] tracking-tight text-foreground md:text-5xl">
          {category.name}
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">{category.description}</p>
        <div className="mt-6">
          <WhatsAppCtaButton size="lg">FALAR COM CONSULTOR</WhatsAppCtaButton>
        </div>
      </div>
    </section>
  )
}

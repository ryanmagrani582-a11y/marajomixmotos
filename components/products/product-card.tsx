import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"
import { formatPrice } from "@/lib/format"
import { getCategoryName } from "@/lib/data/mock-categories"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const mainImage = product.images.find((img) => img.isPrimary) ?? product.images[0]

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40",
        className
      )}
    >
      <Link href={`/produtos/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={mainImage?.url || "/placeholder.svg"}
          alt={mainImage?.alt ?? product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        />
        {product.featured && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">DESTAQUE</Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="font-heading text-[11px] font-semibold uppercase tracking-wider text-primary">
            {product.brand}
          </p>
          <Link href={`/produtos/${product.slug}`}>
            <h3 className="mt-1 font-heading text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            {getCategoryName(product.categorySlug)}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>

        <p className="font-heading text-xl font-bold text-foreground">
          {product.price ? formatPrice(product.price) : "CONSULTE O VALOR"}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <WhatsAppCtaButton size="sm" className="w-full" productName={product.name}>
            TENHO INTERESSE
          </WhatsAppCtaButton>
          <Button
            render={<Link href={`/produtos/${product.slug}`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="w-full"
          >
            VER DETALHES
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}

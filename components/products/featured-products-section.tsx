import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { getProducts } from "@/lib/data/repository"
import type { Product } from "@/lib/types"

function BrandProductsRow({
  title,
  description,
  brandQuery,
  products,
}: {
  title: string
  description: string
  brandQuery: string
  products: Product[]
}) {
  if (products.length === 0) return null

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <Button
          render={<Link href={`/produtos?brand=${brandQuery}`} />}
          nativeButton={false}
          variant="outline"
          className="shrink-0"
        >
          VER CATÁLOGO COMPLETO
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export async function FeaturedProductsSection() {
  const products = await getProducts()

  const yamahaProducts = products.filter((p) => p.brand === "YAMAHA" && p.featured).slice(0, 4)
  const sousaProducts = products.filter((p) => p.brand === "SOUSA MOTOS" && p.featured).slice(0, 4)

  if (yamahaProducts.length === 0 && sousaProducts.length === 0) return null

  return (
    <section className="bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-20 sm:px-6 lg:gap-20 lg:px-8 lg:py-28">
        <BrandProductsRow
          title="Destaques Yamaha"
          description="Motos, scooters, náutica e quadriciclos direto da linha oficial Yamaha."
          brandQuery="YAMAHA"
          products={yamahaProducts}
        />

        <BrandProductsRow
          title="Destaques Sousa Motos"
          description="Triciclos, bikes elétricas e outros produtos da linha Sousa Motos."
          brandQuery="SOUSA%20MOTOS"
          products={sousaProducts}
        />
      </div>
    </section>
  )
}

import type { Metadata } from "next"
import { ProductCatalog } from "@/components/products/product-catalog"
import { getCategories, getProducts } from "@/lib/data/repository"

export const metadata: Metadata = {
  title: "Catálogo de Produtos | Marajó Motors",
  description: "Explore o catálogo de produtos da Marajó Motors: motos, náutica, quadriciclos, triciclos, scooters, bikes elétricas e consórcio.",
}

export default async function ProdutosPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <main>
      <section className="border-b border-border bg-secondary/40 px-6 py-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">Catálogo</p>
          <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Encontre seu próximo destino
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Explore nosso catálogo de produtos.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <ProductCatalog products={products} categories={categories} />
        </div>
      </section>
    </main>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryHero } from "@/components/categories/category-hero"
import { ProductBrandTabs } from "@/components/products/product-brand-tabs"
import { ProductCard } from "@/components/products/product-card"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { PackageSearchIcon } from "lucide-react"
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data/repository"

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.name} | Marajó Motors`,
    description: category.description,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ marca?: string }>
}) {
  const { slug } = await params
  const { marca = "all" } = await searchParams
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const allProducts = await getProductsByCategory(category.slug)
  const selectedBrand = ["all", "YAMAHA", "SOUSA MOTOS"].includes(marca) ? marca : "all"
  const products = category.slug === "motos" && selectedBrand !== "all"
    ? allProducts.filter((product) => product.brand === selectedBrand)
    : allProducts

  return (
    <main>
      <CategoryHero category={category} />

      <section className="px-6 py-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
              Produtos {category.name}
            </h2>
            {category.slug === "motos" ? (
              <ProductBrandTabs categorySlug={category.slug} selectedBrand={selectedBrand} />
            ) : null}
          </div>

          {products.length === 0 ? (
            <Empty className="border border-dashed border-border">
              <EmptyMedia variant="icon">
                <PackageSearchIcon />
              </EmptyMedia>
              <EmptyTitle>Nenhum produto encontrado.</EmptyTitle>
              <EmptyDescription>
                Ainda não há produtos cadastrados nesta categoria. Fale com um consultor para saber mais.
              </EmptyDescription>
            </Empty>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 px-6 py-14 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
              Não encontrou o que procurava?
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Fale com um dos nossos consultores e descubra as opções disponíveis em {category.name.toLowerCase()}.
            </p>
          </div>
          <WhatsAppCtaButton size="lg">FALAR COM CONSULTOR</WhatsAppCtaButton>
        </div>
      </section>
    </main>
  )
}

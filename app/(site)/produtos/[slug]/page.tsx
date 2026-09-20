import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductSpecs } from "@/components/products/product-specs"
import { ProductCard } from "@/components/products/product-card"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"
import { getCategoryBySlug, getProductBySlug, getProducts } from "@/lib/data/repository"
import { formatPrice } from "@/lib/format"

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Marajó Motors`,
    description: product.shortDescription,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const category = await getCategoryBySlug(product.categorySlug)
  const allProducts = await getProducts()
  const related = allProducts.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 3)

  const displayPrice = product.promoPrice ?? product.price

  return (
    <main>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/produtos" className="hover:text-foreground">
              Produtos
            </Link>
            {category && (
              <>
                <span>/</span>
                <Link href={`/categorias/${category.slug}`} className="hover:text-foreground">
                  {category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} productName={product.name} />

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {product.brand}
                  </p>
                  {product.featured && <Badge className="bg-primary text-primary-foreground">DESTAQUE</Badge>}
                </div>
                <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
                  {product.name}
                </h1>
                {category && (
                  <Link
                    href={`/categorias/${category.slug}`}
                    className="mt-1 inline-block text-sm text-muted-foreground hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                )}
              </div>

              <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>

              <div>
                {product.promoPrice != null && product.price != null && (
                  <p className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</p>
                )}
                <p className="font-heading text-3xl font-bold tracking-tight text-foreground">
                  {formatPrice(displayPrice)}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppCtaButton size="lg" productName={product.name} className="sm:flex-1">
                  TENHO INTERESSE
                </WhatsAppCtaButton>
                <WhatsAppCtaButton size="lg" variant="outline" className="sm:flex-1">
                  FALAR COM CONSULTOR
                </WhatsAppCtaButton>
              </div>

              <ProductSpecs specs={product.specs} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
              Você também pode gostar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

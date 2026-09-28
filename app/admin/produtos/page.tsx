import Link from "next/link"
import Image from "next/image"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { getAdminCategories, getAdminProducts } from "@/lib/data/repository"
import { formatPrice } from "@/lib/format"
import { ProductRowActions } from "@/components/admin/product-row-actions"
import { PackageIcon } from "lucide-react"
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice"

export const dynamic = "force-dynamic"

const BRAND_TABS = [
  { value: "all", label: "Todos" },
  { value: "YAMAHA", label: "Yamaha" },
  { value: "SOUSA MOTOS", label: "Sousa Motos" },
]

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string }>
}) {
  const { marca = "all" } = await searchParams
  let products: Awaited<ReturnType<typeof getAdminProducts>>
  let categories: Awaited<ReturnType<typeof getAdminCategories>>
  try {
    ;[products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()])
  } catch {
    return <SupabaseSetupNotice />
  }
  const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]))
  const getCategoryName = (slug: string) => categoryNameBySlug.get(slug) ?? slug
  const selectedBrand = BRAND_TABS.some((tab) => tab.value === marca) ? marca : "all"
  const visibleProducts = selectedBrand === "all" ? products : products.filter((product) => product.brand === selectedBrand)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Produtos</h2>
            <p className="text-sm text-muted-foreground">Gerencie o catálogo de produtos da Marajó Motors.</p>
          </div>
          <Badge variant="secondary" className="mt-1">
            {visibleProducts.length} {visibleProducts.length === 1 ? "produto" : "produtos"}
          </Badge>
        </div>
        <Button render={<Link href="/admin/produtos/novo" />}>
          <PlusIcon data-icon="inline-start" />
          Novo produto
        </Button>
      </div>

      <nav aria-label="Filtrar produtos por marca" className="flex flex-wrap gap-2">
        {BRAND_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={selectedBrand === tab.value ? "default" : "outline"}
            size="sm"
            render={<Link href={tab.value === "all" ? "/admin/produtos" : `/admin/produtos?marca=${encodeURIComponent(tab.value)}`} />}
          >
            {tab.label}
          </Button>
        ))}
      </nav>

      <Card className="rounded-xl border-white/10 bg-[#0B0B0B]">
        <CardContent className="p-0">
          {visibleProducts.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackageIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum produto cadastrado</EmptyTitle>
                <EmptyDescription>Cadastre o primeiro produto do catálogo.</EmptyDescription>
              </EmptyHeader>
              <Button render={<Link href="/admin/produtos/novo" />}>
                <PlusIcon data-icon="inline-start" />
                Novo produto
              </Button>
            </Empty>
          ) : (
            <>
              {/* Mobile: lista em cards */}
              <div className="flex flex-col divide-y divide-white/10 lg:hidden">
                    {visibleProducts.map((product) => {
                  const cover = product.images.find((img) => img.isPrimary) ?? product.images[0]
                  return (
                    <div key={product.id} className="flex gap-3 p-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        {cover ? (
                          <Image
                            src={cover.url || "/placeholder.svg"}
                            alt={cover.alt}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {product.brand} · {getCategoryName(product.categorySlug)}
                            </p>
                          </div>
                          <ProductRowActions productId={product.id} />
                        </div>
                        <p className="text-sm text-foreground">{formatPrice(product.price)}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {product.featured ? <Badge variant="default">Destaque</Badge> : null}
                          <Badge variant={product.active ? "secondary" : "outline"}>
                            {product.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop: tabela */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Destaque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Atualizado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                {visibleProducts.map((product) => {
                      const cover = product.images.find((img) => img.isPrimary) ?? product.images[0]
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                {cover ? (
                                  <Image
                                    src={cover.url || "/placeholder.svg"}
                                    alt={cover.alt}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                                <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {getCategoryName(product.categorySlug)}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            {product.featured ? (
                              <Badge variant="default">Destaque</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.active ? "secondary" : "outline"}>
                              {product.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(product.updatedAt).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right">
                            <ProductRowActions productId={product.id} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

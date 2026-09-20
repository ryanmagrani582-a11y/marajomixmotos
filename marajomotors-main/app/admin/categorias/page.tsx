import Image from "next/image"
import { PlusIcon, TagsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { getAdminCategories, getAdminProducts } from "@/lib/data/repository"
import { CategoryRowActions } from "@/components/admin/category-row-actions"
import { CategoryFormDialog } from "@/components/admin/category-form-dialog"

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getAdminCategories(), getAdminProducts()])
  const nextOrder = categories.reduce((max, category) => Math.max(max, category.order), -1) + 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Categorias</h2>
            <p className="text-sm text-muted-foreground">Organize as categorias exibidas no showroom.</p>
          </div>
          <Badge variant="secondary" className="mt-1">
            {categories.length} {categories.length === 1 ? "categoria" : "categorias"}
          </Badge>
        </div>
        <CategoryFormDialog
          nextOrder={nextOrder}
          trigger={
            <Button>
              <PlusIcon data-icon="inline-start" />
              Nova categoria
            </Button>
          }
        />
      </div>

      <Card className="rounded-xl border-white/10 bg-[#0B0B0B]">
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TagsIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhuma categoria cadastrada</EmptyTitle>
                <EmptyDescription>Crie a primeira categoria do catálogo.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              {/* Mobile: lista em cards */}
              <div className="flex flex-col divide-y divide-white/10 lg:hidden">
                {categories.map((category) => {
                  const productCount = products.filter((p) => p.categorySlug === category.slug).length
                  return (
                    <div key={category.id} className="flex gap-3 p-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
                            <p className="truncate text-xs text-muted-foreground">/{category.slug}</p>
                          </div>
                          <CategoryRowActions categoryName={category.name} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{category.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant={category.active ? "secondary" : "outline"}>
                            {category.active ? "Ativa" : "Inativa"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {productCount} produto{productCount === 1 ? "" : "s"} · ordem {category.order}
                          </span>
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
                      <TableHead>Categoria</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => {
                      const productCount = products.filter((p) => p.categorySlug === category.slug).length
                      return (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                <Image
                                  src={category.image || "/placeholder.svg"}
                                  alt={category.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
                                <p className="truncate text-xs text-muted-foreground">{category.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">/{category.slug}</TableCell>
                          <TableCell className="text-sm text-foreground">{productCount}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{category.order}</TableCell>
                          <TableCell>
                            <Badge variant={category.active ? "secondary" : "outline"}>
                              {category.active ? "Ativa" : "Inativa"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <CategoryRowActions categoryName={category.name} />
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

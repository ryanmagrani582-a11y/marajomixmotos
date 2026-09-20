"use client"

import { useMemo, useState } from "react"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ProductCard } from "@/components/products/product-card"
import type { Category, Product } from "@/lib/types"

const PRICE_RANGES = [
  { value: "all", label: "Qualquer preço" },
  { value: "0-10000", label: "Até R$ 10.000" },
  { value: "10000-25000", label: "R$ 10.000 a R$ 25.000" },
  { value: "25000-50000", label: "R$ 25.000 a R$ 50.000" },
  { value: "50000-999999999", label: "Acima de R$ 50.000" },
]

const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "featured", label: "Destaques" },
]

function matchesPriceRange(price: number | null, range: string) {
  if (range === "all") return true
  if (price == null) return false
  const [min, max] = range.split("-").map(Number)
  return price >= min && price <= max
}

export function ProductCatalog({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [brand, setBrand] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sort, setSort] = useState("recent")

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products])

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch = search.trim().length === 0 || p.name.toLowerCase().includes(search.trim().toLowerCase())
      const matchesCategory = category === "all" || p.categorySlug === category
      const matchesBrand = brand === "all" || p.brand === brand
      const matchesPrice = matchesPriceRange(p.promoPrice ?? p.price, priceRange)
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })

    result = [...result].sort((a, b) => {
      if (sort === "price-asc") return (a.promoPrice ?? a.price ?? Infinity) - (b.promoPrice ?? b.price ?? Infinity)
      if (sort === "price-desc") return (b.promoPrice ?? b.price ?? -1) - (a.promoPrice ?? a.price ?? -1)
      if (sort === "featured") return Number(b.featured) - Number(a.featured)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [products, search, category, brand, priceRange, sort])

  function clearFilters() {
    setSearch("")
    setCategory("all")
    setBrand("all")
    setPriceRange("all")
    setSort("recent")
  }

  const filtersContent = (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Categoria
        </label>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v ?? "all")}
          items={{ all: "Todas as categorias", ...Object.fromEntries(categories.map((c) => [c.slug, c.name])) }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Marca
        </label>
        <Select
          value={brand}
          onValueChange={(v) => setBrand(v ?? "all")}
          items={{ all: "Todas as marcas", ...Object.fromEntries(brands.map((b) => [b, b])) }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas as marcas</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Faixa de preço
        </label>
        <Select
          value={priceRange}
          onValueChange={(v) => setPriceRange(v ?? "all")}
          items={Object.fromEntries(PRICE_RANGES.map((r) => [r.value, r.label]))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Faixa de preço" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRICE_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button variant="ghost" size="sm" onClick={clearFilters} className="justify-start">
        Limpar filtros
      </Button>
    </div>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
            Filtros
          </h2>
          {filtersContent}
        </div>
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <InputGroup className="sm:max-w-sm">
            <InputGroupInput
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>
                <SlidersHorizontalIcon data-icon="inline-start" />
                Filtros
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">{filtersContent}</div>
              </SheetContent>
            </Sheet>

            <Select
              value={sort}
              onValueChange={(v) => setSort(v ?? "recent")}
              items={Object.fromEntries(SORT_OPTIONS.map((o) => [o.value, o.label]))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>

        {filtered.length === 0 ? (
          <Empty className="border border-dashed border-border">
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum produto encontrado.</EmptyTitle>
            <EmptyDescription>Tente ajustar os filtros ou buscar por outro termo.</EmptyDescription>
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
              LIMPAR FILTROS
            </Button>
          </Empty>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

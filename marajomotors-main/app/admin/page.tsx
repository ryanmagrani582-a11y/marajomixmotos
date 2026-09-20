import Link from "next/link"
import { PackageIcon, StarIcon, TagsIcon, UsersIcon, ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAdminCategories, getAdminLeads, getAdminProducts } from "@/lib/data/repository"
import { formatPrice } from "@/lib/format"
import { leadStatusLabels } from "@/lib/admin/lead-status"

// Números e listas desta página vêm diretamente das tabelas do Supabase
// (products, categories, leads) através da camada de repositório admin.
export default async function AdminDashboardPage() {
  const [products, categories, leads] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
    getAdminLeads(),
  ])

  const stats = [
    { label: "Produtos", value: products.length, icon: PackageIcon, href: "/admin/produtos" },
    {
      label: "Destaques",
      value: products.filter((p) => p.featured).length,
      icon: StarIcon,
      href: "/admin/produtos",
    },
    { label: "Categorias", value: categories.length, icon: TagsIcon, href: "/admin/categorias" },
    {
      label: "Leads novos",
      value: leads.filter((l) => l.status === "novo").length,
      icon: UsersIcon,
      href: "/admin/leads",
    },
  ]

  const recentLeads = leads.slice(0, 5)

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="rounded-xl border-white/10 bg-[#0B0B0B] transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-heading text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <stat.icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-xl border-white/10 bg-[#0B0B0B]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-base">Leads recentes</CardTitle>
            <Button render={<Link href="/admin/leads" />} variant="ghost" size="sm">
              Ver todos
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentLeads.length === 0 ? (
              <p className="px-2 py-6 text-sm text-muted-foreground">Nenhum lead recebido ainda.</p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.productName ?? "Interesse geral"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {leadStatusLabels[lead.status]}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-white/10 bg-[#0B0B0B]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-base">Produtos adicionados recentemente</CardTitle>
            <Button render={<Link href="/admin/produtos" />} variant="ghost" size="sm">
              Ver todos
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentProducts.length === 0 ? (
              <p className="px-2 py-6 text-sm text-muted-foreground">Nenhum produto cadastrado ainda.</p>
            ) : (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">{formatPrice(product.price)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

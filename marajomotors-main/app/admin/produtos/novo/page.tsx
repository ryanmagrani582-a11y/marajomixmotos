import { ProductForm } from "@/components/admin/product-form"
import { getAdminCategories } from "@/lib/data/repository"
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  let categories: Awaited<ReturnType<typeof getAdminCategories>>
  try {
    categories = await getAdminCategories()
  } catch {
    return <SupabaseSetupNotice />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Novo produto</h2>
        <p className="text-sm text-muted-foreground">Cadastre um novo produto no catálogo.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}

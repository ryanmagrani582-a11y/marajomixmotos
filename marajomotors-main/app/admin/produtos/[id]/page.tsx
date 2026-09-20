import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { getAdminCategories, getAdminProductById } from "@/lib/data/repository"
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice"

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product: Awaited<ReturnType<typeof getAdminProductById>>
  let categories: Awaited<ReturnType<typeof getAdminCategories>>
  try {
    ;[product, categories] = await Promise.all([getAdminProductById(id), getAdminCategories()])
  } catch {
    return <SupabaseSetupNotice />
  }

  if (!product) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Editar produto</h2>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}

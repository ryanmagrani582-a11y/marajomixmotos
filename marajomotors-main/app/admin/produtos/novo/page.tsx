import { ProductForm } from "@/components/admin/product-form"
import { getAdminCategories } from "@/lib/data/repository"

export default async function NewProductPage() {
  const categories = await getAdminCategories()

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

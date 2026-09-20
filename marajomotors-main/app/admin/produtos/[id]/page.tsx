import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { getAdminCategories, getAdminProductById } from "@/lib/data/repository"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([getAdminProductById(id), getAdminCategories()])

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

import { getCategories } from "@/lib/data/repository"
import { CategoryCard } from "@/components/categories/category-card"

export async function CategoryGridSection() {
  const categories = await getCategories()

  if (categories.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          Encontre o que você procura
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Escolha uma categoria e encontre o produto ideal para o seu próximo destino.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
      </div>
    </section>
  )
}

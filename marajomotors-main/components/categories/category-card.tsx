import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Category } from "@/lib/types"
import { cn } from "@/lib/utils"

export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  return (
    <Link
      href={`/categorias/${category.slug}`}
      className={cn(
        "group relative flex aspect-square flex-col justify-end overflow-hidden rounded-lg border border-border sm:aspect-[4/5]",
        className
      )}
    >
      <Image
        src={category.image || "/placeholder.svg"}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-colors group-hover:from-black/95" />

      <div className="relative z-10 flex flex-col gap-1 p-3 sm:gap-1.5 sm:p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-white transition-transform duration-300 group-hover:-translate-y-1 sm:text-lg lg:text-xl">
            {category.name}
          </h3>
          <ArrowUpRight className="size-4 shrink-0 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:size-5" />
        </div>
        <p className="hidden line-clamp-2 text-sm leading-relaxed text-white/70 sm:block">{category.description}</p>
      </div>
    </Link>
  )
}

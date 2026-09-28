import Link from "next/link"
import { Button } from "@/components/ui/button"

const BRAND_TABS = [
  { value: "all", label: "Todas" },
  { value: "YAMAHA", label: "Yamaha" },
  { value: "SOUSA MOTOS", label: "Sousa Motos" },
]

export function ProductBrandTabs({ categorySlug, selectedBrand }: { categorySlug: string; selectedBrand: string }) {
  return (
    <nav aria-label="Filtrar motos por marca" className="flex flex-wrap gap-2">
      {BRAND_TABS.map((tab) => (
        <Button
          key={tab.value}
          variant={selectedBrand === tab.value ? "default" : "outline"}
          size="sm"
          render={
            <Link
              href={
                tab.value === "all"
                  ? `/categorias/${categorySlug}`
                  : `/categorias/${categorySlug}?marca=${encodeURIComponent(tab.value)}`
              }
            />
          }
        >
          {tab.label}
        </Button>
      ))}
    </nav>
  )
}

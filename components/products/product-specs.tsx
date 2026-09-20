import type { ProductSpec } from "@/lib/types"

export function ProductSpecs({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null
  const sorted = [...specs].sort((a, b) => a.order - b.order)

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold uppercase tracking-tight text-foreground">
        Especificações
      </h2>
      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {sorted.map((spec) => (
          <div key={spec.id} className="flex items-center justify-between gap-4 bg-card px-4 py-3">
            <dt className="text-sm text-muted-foreground">{spec.label}</dt>
            <dd className="text-sm font-medium text-foreground">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

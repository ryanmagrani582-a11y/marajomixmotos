"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ProductImage } from "@/lib/types"

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.order - b.order)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const active = sorted[activeIndex] ?? sorted[0]

  function goTo(delta: number) {
    setActiveIndex((i) => (i + delta + sorted.length) % sorted.length)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-secondary">
        <Image
          src={active?.url || "/placeholder.svg"}
          alt={active?.alt ?? productName}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Ampliar imagem"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
        >
          <ExpandIcon className="size-4" />
        </button>

        {sorted.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-opacity hover:bg-background"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-opacity hover:bg-background"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </>
        )}
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sorted.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md border transition-colors",
                index === activeIndex ? "border-primary" : "border-border hover:border-muted-foreground"
              )}
            >
              <Image src={img.url || "/placeholder.svg"} alt={img.alt} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src={active?.url || "/placeholder.svg"}
              alt={active?.alt ?? productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

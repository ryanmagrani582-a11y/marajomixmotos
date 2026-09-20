"use client"

import Image from "next/image"
import { toast } from "sonner"
import { useState } from "react"
import { PlusIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { mockBanners } from "@/lib/data/mock-site"

// Lista alimentada por DEMO DATA (lib/data/mock-site). Futuramente
// substituída por uma consulta à tabela `banners` do Supabase, com imagens
// hospedadas no Supabase Storage.
export default function AdminBannersPage() {
  const [banners, setBanners] = useState(mockBanners)

  function toggleActive(id: string) {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)))
    // TODO(supabase): persistir o campo `active` na tabela `banners`.
    toast.success("Banner atualizado (simulação — conecte o Supabase para persistir).")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Banners</h2>
          <p className="text-sm text-muted-foreground">Gerencie os banners exibidos no carrossel da home.</p>
        </div>
        <Button
          onClick={() =>
            toast.info("Novo banner (simulação — conecte o Supabase para persistir).")
          }
        >
          <PlusIcon data-icon="inline-start" />
          Novo banner
        </Button>
      </div>

      <Card className="rounded-xl border-white/10 bg-[#0B0B0B]">
        <CardContent className="p-0">
          {banners.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum banner cadastrado</EmptyTitle>
                <EmptyDescription>Crie o primeiro banner do carrossel da home.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              {/* Mobile: lista em cards */}
              <div className="flex flex-col divide-y divide-white/10 lg:hidden">
                {banners.map((banner) => (
                  <div key={banner.id} className="flex gap-3 p-4">
                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={banner.imageDesktop || "/placeholder.svg"}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{banner.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{banner.subtitle}</p>
                        </div>
                        <Switch checked={banner.active} onCheckedChange={() => toggleActive(banner.id)} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {banner.ctaLabel} → {banner.ctaLink}
                      </p>
                      <p className="text-xs text-muted-foreground">Ordem {banner.order}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: tabela */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>CTA</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Ativo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                              <Image
                                src={banner.imageDesktop || "/placeholder.svg"}
                                alt={banner.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">{banner.title}</p>
                              <p className="truncate text-xs text-muted-foreground">{banner.subtitle}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {banner.ctaLabel} → {banner.ctaLink}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{banner.order}</TableCell>
                        <TableCell>
                          <Switch checked={banner.active} onCheckedChange={() => toggleActive(banner.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

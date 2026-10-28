"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BannerFormDialog } from "@/components/admin/banner-form-dialog"
import { deleteBanner, setBannerActive } from "@/app/admin/actions"
import type { Banner } from "@/lib/types"

export function BannersManager({ banners: initialBanners }: { banners: Banner[] }) {
  const router = useRouter()
  const [banners, setBanners] = useState(initialBanners)
  const [syncedFrom, setSyncedFrom] = useState(initialBanners)
  const [formState, setFormState] = useState<{ banner?: Banner; key: number } | null>(null)
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  if (syncedFrom !== initialBanners) {
    setSyncedFrom(initialBanners)
    setBanners(initialBanners)
  }

  const nextOrder = banners.reduce((max, b) => Math.max(max, b.order), -1) + 1

  async function toggleActive(banner: Banner) {
    const nextActive = !banner.active
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, active: nextActive } : b)))
    const result = await setBannerActive(banner.id, nextActive)
    if (!result.ok) {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, active: banner.active } : b)))
      toast.error(result.error)
      return
    }
    toast.success(nextActive ? "Banner ativado." : "Banner desativado.")
    router.refresh()
  }

  async function confirmDelete() {
    if (!bannerToDelete) return
    setIsDeleting(true)
    const result = await deleteBanner(bannerToDelete.id)
    setIsDeleting(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Banner excluído.")
    setBannerToDelete(null)
    router.refresh()
  }

  const openForm = (banner?: Banner) => setFormState({ banner, key: Date.now() })

  const rowActions = (banner: Banner) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" onClick={() => openForm(banner)}>
        <PencilIcon />
        <span className="sr-only">Editar {banner.title}</span>
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => setBannerToDelete(banner)}>
        <Trash2Icon />
        <span className="sr-only">Excluir {banner.title}</span>
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Banners</h2>
          <p className="text-sm text-muted-foreground">
            O primeiro banner ativo (menor ordem) aparece no topo da home.
          </p>
        </div>
        <Button onClick={() => openForm()}>
          <PlusIcon data-icon="inline-start" />
          Novo banner
        </Button>
      </div>

      <Card className="rounded-xl border-border bg-card">
        <CardContent className="p-0">
          {banners.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum banner cadastrado</EmptyTitle>
                <EmptyDescription>
                  Enquanto não houver banners, a home mostra o banner padrão do site.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="flex flex-col divide-y divide-border lg:hidden">
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
                        <Switch
                          checked={banner.active}
                          onCheckedChange={() => toggleActive(banner)}
                          aria-label={`Ativar ${banner.title}`}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">Ordem {banner.order}</p>
                        {rowActions(banner)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>Botão</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead className="w-24">
                        <span className="sr-only">Ações</span>
                      </TableHead>
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
                          {banner.ctaLabel || "VER PRODUTOS"} {"→"} {banner.ctaLink || "/produtos"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{banner.order}</TableCell>
                        <TableCell>
                          <Switch
                            checked={banner.active}
                            onCheckedChange={() => toggleActive(banner)}
                            aria-label={`Ativar ${banner.title}`}
                          />
                        </TableCell>
                        <TableCell>{rowActions(banner)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {formState ? (
        <BannerFormDialog
          key={formState.key}
          banner={formState.banner}
          nextOrder={nextOrder}
          open
          onOpenChange={(open) => {
            if (!open) setFormState(null)
          }}
        />
      ) : null}

      <AlertDialog open={bannerToDelete !== null} onOpenChange={(open) => !open && setBannerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir banner?</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${bannerToDelete?.title ?? ""}" será removido do site. Essa ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

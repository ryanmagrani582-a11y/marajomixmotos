"use client"

import Image from "next/image"
import { useId, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createBanner, createBannerImageUpload, updateBanner } from "@/app/admin/actions"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Banner } from "@/lib/types"

function ImageUploadField({
  id,
  label,
  description,
  value,
  onChange,
  onUploadingChange,
}: {
  id: string
  label: string
  description: string
  value: string
  onChange: (url: string) => void
  onUploadingChange: (uploading: boolean) => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    onUploadingChange(true)
    try {
      const upload = await createBannerImageUpload(file.type, file.size)
      const { error } = await createSupabaseBrowserClient()
        .storage.from(upload.bucket)
        .uploadToSignedUrl(upload.path, upload.token, file, { contentType: file.type })
      if (error) throw error
      onChange(upload.publicUrl)
    } catch (error) {
      toast.error(`Falha ao enviar a imagem: ${error instanceof Error ? error.message : "erro desconhecido"}`)
    } finally {
      setUploading(false)
      onUploadingChange(false)
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {value ? (
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-lg border border-border bg-muted">
          <Image src={value} alt="" fill className="object-cover" sizes="480px" />
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute right-2 top-2"
            onClick={() => onChange("")}
          >
            <XIcon />
            <span className="sr-only">Remover imagem</span>
          </Button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex aspect-[16/7] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          {uploading ? <Loader2Icon className="size-5 animate-spin" /> : <UploadIcon className="size-5" />}
          {uploading ? "Enviando..." : "Clique para enviar"}
        </label>
      )}
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ""
        }}
      />
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}

export function BannerFormDialog({
  banner,
  nextOrder,
  open,
  onOpenChange,
}: {
  banner?: Banner
  nextOrder: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const idPrefix = useId()
  const isEditing = Boolean(banner)

  const [title, setTitle] = useState(banner?.title ?? "")
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? "")
  const [imageDesktop, setImageDesktop] = useState(banner?.imageDesktop ?? "")
  const [imageMobile, setImageMobile] = useState(banner?.imageMobile ?? "")
  const [ctaLabel, setCtaLabel] = useState(banner?.ctaLabel ?? "")
  const [ctaLink, setCtaLink] = useState(banner?.ctaLink ?? "")
  const [order, setOrder] = useState(String(banner?.order ?? nextOrder))
  const [active, setActive] = useState(banner?.active ?? true)
  const [uploadsInProgress, setUploadsInProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trackUpload = (uploading: boolean) => setUploadsInProgress((n) => n + (uploading ? 1 : -1))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!imageDesktop) {
      toast.error("Envie a imagem principal do banner.")
      return
    }
    setIsSubmitting(true)
    const input = {
      title,
      subtitle,
      imageDesktop,
      imageMobile,
      ctaLabel,
      ctaLink,
      active,
      order: Number(order) || 0,
    }
    const result = isEditing && banner ? await updateBanner(banner.id, input) : await createBanner(input)
    setIsSubmitting(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(isEditing ? "Banner atualizado." : "Banner criado.")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar banner" : "Novo banner"}</DialogTitle>
            <DialogDescription>O primeiro banner ativo (menor ordem) aparece no topo da home.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-title`}>Título</FieldLabel>
              <Input
                id={`${idPrefix}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="CONQUISTE A SUA MOTO DOS SONHOS."
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-subtitle`}>Subtítulo</FieldLabel>
              <Input
                id={`${idPrefix}-subtitle`}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </Field>
            <ImageUploadField
              id={`${idPrefix}-desktop`}
              label="Imagem desktop"
              description="Obrigatória. Recomendado 1920 × 800 px."
              value={imageDesktop}
              onChange={setImageDesktop}
              onUploadingChange={trackUpload}
            />
            <ImageUploadField
              id={`${idPrefix}-mobile`}
              label="Imagem mobile"
              description="Opcional. Se vazia, usa a imagem desktop. Recomendado 1280 × 1470 px."
              value={imageMobile}
              onChange={setImageMobile}
              onUploadingChange={trackUpload}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`${idPrefix}-cta-label`}>Texto do botão</FieldLabel>
                <Input
                  id={`${idPrefix}-cta-label`}
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="VER PRODUTOS"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${idPrefix}-cta-link`}>Link do botão</FieldLabel>
                <Input
                  id={`${idPrefix}-cta-link`}
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="/produtos"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`${idPrefix}-order`}>Ordem</FieldLabel>
                <Input
                  id={`${idPrefix}-order`}
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor={`${idPrefix}-active`}>Ativo</FieldLabel>
                <Switch id={`${idPrefix}-active`} checked={active} onCheckedChange={setActive} />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || uploadsInProgress > 0}>
              {isSubmitting ? <Loader2Icon data-icon="inline-start" className="animate-spin" /> : null}
              {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

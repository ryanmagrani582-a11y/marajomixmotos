"use client"

import { useId, useState, type ReactElement } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { createCategory, updateCategory } from "@/app/admin/actions"
import type { Category } from "@/lib/types"

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function CategoryFormDialog({
  category,
  trigger,
  nextOrder = 0,
}: {
  category?: Category
  trigger: ReactElement
  nextOrder?: number
}) {
  const router = useRouter()
  const idPrefix = useId()
  const isEditing = Boolean(category)

  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name ?? "")
  const [slug, setSlug] = useState(category?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [description, setDescription] = useState(category?.description ?? "")
  const [image, setImage] = useState(category?.image ?? "")
  const [order, setOrder] = useState(category?.order?.toString() ?? nextOrder.toString())
  const [active, setActive] = useState(category?.active ?? true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const input = {
        slug,
        name,
        description,
        image: image || null,
        order: Number(order) || 0,
        active,
      }
      if (isEditing && category) {
        await updateCategory(category.id, input)
        toast.success("Categoria atualizada.")
      } else {
        await createCategory(input)
        toast.success("Categoria criada.")
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a categoria.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize as informações da categoria."
                : "Crie uma nova categoria para organizar o catálogo."}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`${idPrefix}-name`}>Nome</FieldLabel>
                <Input
                  id={`${idPrefix}-name`}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Náutica"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${idPrefix}-slug`}>Slug</FieldLabel>
                <Input
                  id={`${idPrefix}-slug`}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setSlug(slugify(e.target.value))
                  }}
                  placeholder="nautica"
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-description`}>Descrição</FieldLabel>
              <Textarea
                id={`${idPrefix}-description`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-image`}>URL da imagem</FieldLabel>
              <Input
                id={`${idPrefix}-image`}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
              <FieldDescription>Imagem exibida nos cards de categoria.</FieldDescription>
            </Field>
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
                <FieldLabel htmlFor={`${idPrefix}-active`}>Ativa</FieldLabel>
                <Switch id={`${idPrefix}-active`} checked={active} onCheckedChange={setActive} />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

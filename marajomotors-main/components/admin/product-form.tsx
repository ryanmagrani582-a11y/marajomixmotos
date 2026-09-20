"use client"

import { useId, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { UploadIcon, StarIcon, Trash2Icon, PlusIcon, GripVerticalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { createProduct, updateProduct } from "@/app/admin/actions"
import type { Category, Product, ProductImage, ProductSpec } from "@/lib/types"

interface ImageDraft extends ProductImage {}
interface SpecDraft extends ProductSpec {}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter()
  const idPrefix = useId()
  const isEditing = Boolean(product)

  const [name, setName] = useState(product?.name ?? "")
  const [slug, setSlug] = useState(product?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [categorySlug, setCategorySlug] = useState(product?.categorySlug ?? categories[0]?.slug ?? "")
  const [brand, setBrand] = useState(product?.brand ?? "Yamaha")
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product?.price?.toString() ?? "")
  const [promoPrice, setPromoPrice] = useState(product?.promoPrice?.toString() ?? "")
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [active, setActive] = useState(product?.active ?? true)
  const [images, setImages] = useState<ImageDraft[]>(product?.images ?? [])
  const [specs, setSpecs] = useState<SpecDraft[]>(product?.specs ?? [])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  function addImagesFromFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const drafts: ImageDraft[] = Array.from(files).map((file, index) => ({
      id: `${idPrefix}-img-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      alt: `${name || "Produto"} — foto ${images.length + index + 1}`,
      order: images.length + index,
      isPrimary: images.length === 0 && index === 0,
      productId: product?.id ?? "",
    }))
    setImages((prev) => [...prev, ...drafts])
    // TODO(supabase): fazer upload real dos arquivos para o Supabase Storage
    // (bucket de produtos) e salvar as URLs públicas em `product_images`.
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id)
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true }
      }
      return next
    })
  }

  function setPrimaryImage(id: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === id })))
  }

  function moveImage(id: string, direction: "up" | "down") {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      const targetIndex = direction === "up" ? index - 1 : index + 1
      if (index < 0 || targetIndex < 0 || targetIndex >= prev.length) return prev
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.splice(targetIndex, 0, item)
      return next.map((img, i) => ({ ...img, order: i }))
    })
  }

  function addSpec() {
    setSpecs((prev) => [
      ...prev,
      {
        id: `${idPrefix}-spec-${Date.now()}`,
        productId: product?.id ?? "",
        label: "",
        value: "",
        order: prev.length,
      },
    ])
  }

  function updateSpec(id: string, field: "label" | "value", value: string) {
    setSpecs((prev) => prev.map((spec) => (spec.id === id ? { ...spec, [field]: value } : spec)))
  }

  function removeSpec(id: string) {
    setSpecs((prev) => prev.filter((spec) => spec.id !== id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (images.some((image) => image.url.startsWith("blob:"))) {
      toast.error("Faça o upload das imagens antes de salvar — o upload direto ainda não está conectado.")
      return
    }

    setIsSubmitting(true)
    try {
      const input = {
        name,
        slug,
        categorySlug,
        brand,
        shortDescription,
        description,
        price: price === "" ? null : Number(price),
        promoPrice: promoPrice === "" ? null : Number(promoPrice),
        featured,
        active,
        images: images.map((image, index) => ({
          url: image.url,
          alt: image.alt,
          order: index,
          isPrimary: image.isPrimary,
        })),
        specs: specs.map((spec, index) => ({ label: spec.label, value: spec.value, order: index })),
      }

      if (isEditing && product) {
        await updateProduct(product.id, input)
        toast.success("Produto atualizado.")
      } else {
        await createProduct(input)
        toast.success("Produto criado.")
      }
      router.push("/admin/produtos")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o produto.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-white/10 bg-[#0B0B0B]">
            <CardHeader>
              <CardTitle className="font-heading text-base">Informações básicas</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ex: MT-03"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true)
                        setSlug(slugify(e.target.value))
                      }}
                      placeholder="mt-03"
                      required
                    />
                    <FieldDescription>Usado na URL: /produtos/{slug || "slug-do-produto"}</FieldDescription>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="category">Categoria</FieldLabel>
                    <Select value={categorySlug} onValueChange={(value) => value && setCategorySlug(value)}>
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.slug} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="brand">Marca</FieldLabel>
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="shortDescription">Descrição curta</FieldLabel>
                  <Input
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Frase curta exibida nos cards"
                    maxLength={120}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Descrição completa</FieldLabel>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Descrição detalhada do produto"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="price">Preço (R$)</FieldLabel>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Deixe vazio para exibir “Consulte o valor”"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="promoPrice">Preço promocional (R$)</FieldLabel>
                    <Input
                      id="promoPrice"
                      type="number"
                      min={0}
                      step="0.01"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(e.target.value)}
                      placeholder="Opcional"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0B0B0B]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">Especificações</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <PlusIcon data-icon="inline-start" />
                Adicionar especificação
              </Button>
            </CardHeader>
            <CardContent>
              {specs.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Nenhuma especificação adicionada. Ex: Motor, Cilindrada, Potência.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {specs.map((spec) => (
                    <div key={spec.id} className="flex items-end gap-2">
                      <Field className="flex-1">
                        <FieldLabel className="sr-only">Nome da especificação</FieldLabel>
                        <Input
                          value={spec.label}
                          onChange={(e) => updateSpec(spec.id, "label", e.target.value)}
                          placeholder="Motor"
                        />
                      </Field>
                      <Field className="flex-1">
                        <FieldLabel className="sr-only">Valor da especificação</FieldLabel>
                        <Input
                          value={spec.value}
                          onChange={(e) => updateSpec(spec.id, "value", e.target.value)}
                          placeholder="150 cc"
                        />
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpec(spec.id)}
                        aria-label="Remover especificação"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-white/10 bg-[#0B0B0B]">
            <CardHeader>
              <CardTitle className="font-heading text-base">Visibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="featured">Produto em destaque</FieldLabel>
                  <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="active">Produto ativo</FieldLabel>
                  <Switch id="active" checked={active} onCheckedChange={setActive} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0B0B0B]">
            <CardHeader>
              <CardTitle className="font-heading text-base">Imagens</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <label
                htmlFor="image-upload"
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  addImagesFromFiles(e.dataTransfer.files)
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-white/15 hover:border-white/30"
                }`}
              >
                <UploadIcon className="size-5 text-muted-foreground" />
                <p className="text-sm text-foreground">Arraste imagens ou clique para enviar</p>
                <p className="text-xs text-muted-foreground">PNG ou JPG — múltiplas imagens permitidas</p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => addImagesFromFiles(e.target.files)}
                />
              </label>

              {images.length === 0 ? (
                <Empty className="py-6">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <UploadIcon />
                    </EmptyMedia>
                    <EmptyTitle>Nenhuma imagem</EmptyTitle>
                    <EmptyDescription>Adicione ao menos uma imagem principal.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="flex flex-col gap-2">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex items-center gap-2 rounded-lg border border-white/10 p-2"
                    >
                      <GripVerticalIcon className="size-4 shrink-0 text-muted-foreground" />
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-muted-foreground">{image.alt}</p>
                      </div>
                      <Button
                        type="button"
                        variant={image.isPrimary ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setPrimaryImage(image.id)}
                        aria-label="Definir como imagem principal"
                        title="Definir como imagem principal"
                      >
                        <StarIcon />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => moveImage(image.id, "up")}
                        aria-label="Mover para cima"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === images.length - 1}
                        onClick={() => moveImage(image.id, "down")}
                        aria-label="Mover para baixo"
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(image.id)}
                        aria-label="Remover imagem"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/produtos")}>
          Cancelar
        </Button>
        <Button type="submit">{isEditing ? "Salvar alterações" : "Criar produto"}</Button>
      </div>
    </form>
  )
}

"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth/admin-session"
import type { LeadStatus, ProductImage, ProductSpec } from "@/lib/types"

const PRODUCT_IMAGES_BUCKET = "products"
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}

async function requireAdminSession() {
  const cookieStore = await cookies()
  const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value)
  if (!session) throw new Error("Sessão expirada. Faça login novamente.")
  return session
}

async function ensureProductImagesBucket() {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase.storage.getBucket(PRODUCT_IMAGES_BUCKET)
  if (data) return

  const { error } = await supabase.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: MAX_IMAGE_SIZE_BYTES,
    allowedMimeTypes: Object.keys(ALLOWED_IMAGE_TYPES),
  })
  if (error && !/already exists/i.test(error.message)) throw error
}

/**
 * Gera uma URL assinada para o navegador enviar a imagem direto ao Supabase
 * Storage — evita o limite de tamanho do corpo das Server Actions.
 */
export async function createProductImageUpload(contentType: string, size: number) {
  return createImageUpload("produtos", contentType, size)
}

export async function createBannerImageUpload(contentType: string, size: number) {
  return createImageUpload("banners", contentType, size)
}

async function createImageUpload(folder: string, contentType: string, size: number) {
  await requireAdminSession()

  const extension = ALLOWED_IMAGE_TYPES[contentType]
  if (!extension) throw new Error("Formato não suportado. Use JPG, PNG, WEBP ou AVIF.")
  if (!Number.isFinite(size) || size <= 0 || size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("A imagem deve ter no máximo 10 MB.")
  }

  await ensureProductImagesBucket()

  const supabase = createSupabaseAdminClient()
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { data, error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).createSignedUploadUrl(path)
  if (error) throw error

  const { data: publicData } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)

  return {
    bucket: PRODUCT_IMAGES_BUCKET,
    path: data.path,
    token: data.token,
    publicUrl: publicData.publicUrl,
  }
}

function revalidateProductPaths() {
  revalidatePath("/admin/produtos")
  revalidatePath("/admin")
  revalidatePath("/produtos")
}

export interface ProductInput {
  name: string
  slug: string
  categorySlug: string
  brand: string
  shortDescription: string
  description: string
  price: number | null
  promoPrice: number | null
  featured: boolean
  active: boolean
  images: Pick<ProductImage, "url" | "alt" | "order" | "isPrimary">[]
  specs: Pick<ProductSpec, "label" | "value" | "order">[]
}

async function replaceProductRelations(productId: string, input: ProductInput) {
  const supabase = createSupabaseAdminClient()

  const { error: deleteImagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
  if (deleteImagesError) throw deleteImagesError

  const { error: deleteSpecsError } = await supabase.from("product_specs").delete().eq("product_id", productId)
  if (deleteSpecsError) throw deleteSpecsError

  if (input.images.length > 0) {
    const { error } = await supabase.from("product_images").insert(
      input.images.map((image) => ({
        product_id: productId,
        url: image.url,
        alt: image.alt,
        order: image.order,
        is_primary: image.isPrimary,
      })),
    )
    if (error) throw error
  }

  if (input.specs.length > 0) {
    const { error } = await supabase.from("product_specs").insert(
      input.specs.map((spec) => ({
        product_id: productId,
        label: spec.label,
        value: spec.value,
        order: spec.order,
      })),
    )
    if (error) throw error
  }
}

export async function createProduct(input: ProductInput) {
  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug: input.slug,
      category_slug: input.categorySlug,
      brand: input.brand,
      short_description: input.shortDescription,
      description: input.description,
      price: input.price,
      promo_price: input.promoPrice,
      featured: input.featured,
      active: input.active,
    })
    .select("id")
    .single()

  if (error) throw error

  await replaceProductRelations(data.id as string, input)
  revalidateProductPaths()
  return { id: data.id as string }
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      slug: input.slug,
      category_slug: input.categorySlug,
      brand: input.brand,
      short_description: input.shortDescription,
      description: input.description,
      price: input.price,
      promo_price: input.promoPrice,
      featured: input.featured,
      active: input.active,
    })
    .eq("id", id)

  if (error) throw error

  await replaceProductRelations(id, input)
  revalidateProductPaths()
}

export async function deleteProduct(id: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
  revalidateProductPaths()
}

export async function duplicateProduct(id: string) {
  const supabase = createSupabaseAdminClient()

  const { data: original, error: fetchError } = await supabase
    .from("products")
    .select("*, product_images(*), product_specs(*)")
    .eq("id", id)
    .single()
  if (fetchError) throw fetchError

  const baseSlug = `${original.slug}-copia`
  let slug = baseSlug
  let attempt = 1
  while (true) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle()
    if (!existing) break
    attempt += 1
    slug = `${baseSlug}-${attempt}`
  }

  const { data: created, error: insertError } = await supabase
    .from("products")
    .insert({
      name: `${original.name} (cópia)`,
      slug,
      category_slug: original.category_slug,
      brand: original.brand,
      short_description: original.short_description,
      description: original.description,
      price: original.price,
      promo_price: original.promo_price,
      featured: false,
      active: false,
    })
    .select("id")
    .single()
  if (insertError) throw insertError

  const images = (original.product_images as Record<string, unknown>[]) ?? []
  const specs = (original.product_specs as Record<string, unknown>[]) ?? []

  if (images.length > 0) {
    const { error } = await supabase.from("product_images").insert(
      images.map((image) => ({
        product_id: created.id,
        url: image.url,
        alt: image.alt,
        order: image.order,
        is_primary: image.is_primary,
      })),
    )
    if (error) throw error
  }

  if (specs.length > 0) {
    const { error } = await supabase.from("product_specs").insert(
      specs.map((spec) => ({
        product_id: created.id,
        label: spec.label,
        value: spec.value,
        order: spec.order,
      })),
    )
    if (error) throw error
  }

  revalidateProductPaths()
  return { id: created.id as string }
}

export interface CategoryInput {
  slug: string
  name: string
  description: string
  image: string | null
  order: number
  active: boolean
}

export async function createCategory(input: CategoryInput) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("categories").insert({
    slug: input.slug,
    name: input.name,
    description: input.description,
    image: input.image,
    order: input.order,
    active: input.active,
  })
  if (error) throw error
  revalidatePath("/admin/categorias")
  revalidatePath("/admin")
}

export async function updateCategory(id: string, input: CategoryInput) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from("categories")
    .update({
      slug: input.slug,
      name: input.name,
      description: input.description,
      image: input.image,
      order: input.order,
      active: input.active,
    })
    .eq("id", id)
  if (error) throw error
  revalidatePath("/admin/categorias")
  revalidatePath("/admin")
}

export async function deleteCategory(id: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/categorias")
  revalidatePath("/admin")
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession()
  } catch {
    return { ok: false, error: "Sessão expirada. Faça login novamente." }
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId)
  if (error) {
    console.error("Erro ao atualizar lead:", error)
    return { ok: false, error: `Não foi possível atualizar: ${error.message}` }
  }
  revalidatePath("/admin/leads")
  revalidatePath("/admin")
  return { ok: true }
}

type ActionResult = { ok: true } | { ok: false; error: string }

export interface BannerInput {
  title: string
  subtitle: string
  imageDesktop: string
  imageMobile: string
  ctaLabel: string
  ctaLink: string
  active: boolean
  order: number
}

function revalidateBannerPaths() {
  revalidatePath("/admin/banners")
  revalidatePath("/")
}

function bannerRowFromInput(input: BannerInput) {
  const clean = (value: string) => {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }
  return {
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    image_desktop: clean(input.imageDesktop),
    image_mobile: clean(input.imageMobile),
    cta_label: clean(input.ctaLabel),
    cta_link: clean(input.ctaLink),
    active: input.active,
    order: Number.isFinite(input.order) ? Math.trunc(input.order) : 0,
  }
}

async function runAdminMutation(
  label: string,
  mutate: (supabase: ReturnType<typeof createSupabaseAdminClient>) => PromiseLike<{ error: { message: string } | null }>,
): Promise<ActionResult> {
  try {
    await requireAdminSession()
  } catch {
    return { ok: false, error: "Sessão expirada. Faça login novamente." }
  }
  const { error } = await mutate(createSupabaseAdminClient())
  if (error) {
    console.error(`Erro ao ${label}:`, error)
    return { ok: false, error: `Não foi possível ${label}: ${error.message}` }
  }
  revalidateBannerPaths()
  return { ok: true }
}

export async function createBanner(input: BannerInput): Promise<ActionResult> {
  if (!input.title.trim()) return { ok: false, error: "Informe o título do banner." }
  if (!input.imageDesktop.trim()) return { ok: false, error: "Envie a imagem principal do banner." }
  return runAdminMutation("criar o banner", (supabase) => supabase.from("banners").insert(bannerRowFromInput(input)))
}

export async function updateBanner(id: string, input: BannerInput): Promise<ActionResult> {
  if (!input.title.trim()) return { ok: false, error: "Informe o título do banner." }
  if (!input.imageDesktop.trim()) return { ok: false, error: "Envie a imagem principal do banner." }
  return runAdminMutation("salvar o banner", (supabase) =>
    supabase.from("banners").update(bannerRowFromInput(input)).eq("id", id),
  )
}

export async function setBannerActive(id: string, active: boolean): Promise<ActionResult> {
  return runAdminMutation("atualizar o banner", (supabase) => supabase.from("banners").update({ active }).eq("id", id))
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  return runAdminMutation("excluir o banner", (supabase) => supabase.from("banners").delete().eq("id", id))
}

export interface SiteSettingsInput {
  companyName: string
  whatsapp: string | null
  instagram: string | null
  phone: string | null
  address: string | null
  email: string | null
  institutionalText: string
  whatsappMessageTemplate: string
}

export async function updateSiteSettings(
  input: SiteSettingsInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession()
  } catch {
    return { ok: false, error: "Sessão expirada. Faça login novamente." }
  }

  const companyName = input.companyName.trim()
  if (!companyName) return { ok: false, error: "Informe o nome da empresa." }

  const clean = (value: string | null) => {
    const trimmed = value?.trim() ?? ""
    return trimmed.length > 0 ? trimmed : null
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: 1,
      company_name: companyName,
      whatsapp: clean(input.whatsapp),
      instagram: clean(input.instagram),
      phone: clean(input.phone),
      address: clean(input.address),
      email: clean(input.email),
      institutional_text: input.institutionalText,
      whatsapp_message_template: input.whatsappMessageTemplate,
    })
  if (error) {
    console.error("Erro ao salvar site_settings:", error)
    return { ok: false, error: `Não foi possível salvar: ${error.message}` }
  }
  revalidatePath("/", "layout")
  return { ok: true }
}

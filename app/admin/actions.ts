"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { LeadStatus, ProductImage, ProductSpec } from "@/lib/types"

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

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId)
  if (error) throw error
  revalidatePath("/admin/leads")
  revalidatePath("/admin")
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

export async function updateSiteSettings(input: SiteSettingsInput) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: 1,
      company_name: input.companyName,
      whatsapp: input.whatsapp,
      instagram: input.instagram,
      phone: input.phone,
      address: input.address,
      email: input.email,
      institutional_text: input.institutionalText,
      whatsapp_message_template: input.whatsappMessageTemplate,
    })
  if (error) throw error
  revalidatePath("/admin/configuracoes")
  revalidatePath("/")
}

import "server-only"

import type { Category, Lead, Product, ProductImage, ProductSpec, SiteSettings } from "@/lib/types"
import { mockCategories } from "@/lib/data/mock-categories"
import { mockProducts } from "@/lib/data/mock-products"
import { mockBanners, mockLeads, mockSiteSettings } from "@/lib/data/mock-site"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

/**
 * Camada de repositório.
 *
 * Toda leitura de dados do site passa por estas funções. Hoje elas resolvem
 * com os dados mockados em lib/data/mock-*.ts (marcados como DEMO DATA).
 * Quando o Supabase for conectado, basta reimplementar o corpo destas
 * funções com chamadas ao client do Supabase — nenhuma página ou
 * componente precisa mudar, pois todos consomem apenas esta interface.
 */

export async function getCategories(): Promise<Category[]> {
  return [...mockCategories].sort((a, b) => a.order - b.order).filter((c) => c.active)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find((c) => c.slug === slug) ?? null
}

export async function getProducts(): Promise<Product[]> {
  return [...mockProducts].filter((p) => p.active)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => p.featured)
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => p.categorySlug === categorySlug)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export async function getBanners() {
  return [...mockBanners].filter((b) => b.active).sort((a, b) => a.order - b.order)
}

export async function getSiteSettings() {
  return mockSiteSettings
}

export async function getLeads() {
  return [...mockLeads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * Funções administrativas.
 *
 * Usadas exclusivamente pelo painel /admin: leem diretamente das tabelas do
 * Supabase (via service_role, que ignora RLS) para mostrar TODOS os
 * registros — inclusive produtos/categorias inativos e leads — e não apenas
 * o subconjunto público que `getCategories`/`getProducts` expõem ao site.
 *
 * A única exceção é `banners`, que o admin ainda gerencia com DEMO DATA
 * (lib/data/mock-site) enquanto o CRUD de banners não é conectado.
 */

function mapCategoryRow(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    image: (row.image as string) ?? "",
    order: row.order as number,
    active: row.active as boolean,
  }
}

function mapProductImageRow(row: Record<string, unknown>): ProductImage {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    url: row.url as string,
    alt: (row.alt as string) ?? "",
    order: row.order as number,
    isPrimary: row.is_primary as boolean,
  }
}

function mapProductSpecRow(row: Record<string, unknown>): ProductSpec {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    label: row.label as string,
    value: row.value as string,
    order: row.order as number,
  }
}

function mapProductRow(row: Record<string, unknown>): Product {
  const images = ((row.product_images as Record<string, unknown>[]) ?? [])
    .map(mapProductImageRow)
    .sort((a, b) => a.order - b.order)
  const specs = ((row.product_specs as Record<string, unknown>[]) ?? [])
    .map(mapProductSpecRow)
    .sort((a, b) => a.order - b.order)

  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    categorySlug: row.category_slug as string,
    shortDescription: (row.short_description as string) ?? "",
    description: (row.description as string) ?? "",
    price: row.price === null ? null : Number(row.price),
    promoPrice: row.promo_price === null || row.promo_price === undefined ? null : Number(row.promo_price),
    featured: row.featured as boolean,
    active: row.active as boolean,
    images,
    specs,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapLeadRow(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    name: row.name as string,
    whatsapp: row.whatsapp as string,
    email: (row.email as string) ?? null,
    productId: (row.product_id as string) ?? null,
    productName: (row.product_name as string) ?? null,
    message: (row.message as string) ?? "",
    status: row.status as Lead["status"],
    createdAt: row.created_at as string,
  }
}

function mapSiteSettingsRow(row: Record<string, unknown>): SiteSettings {
  return {
    companyName: (row.company_name as string) ?? "",
    whatsapp: (row.whatsapp as string) ?? null,
    instagram: (row.instagram as string) ?? null,
    phone: (row.phone as string) ?? null,
    address: (row.address as string) ?? null,
    email: (row.email as string) ?? null,
    institutionalText: (row.institutional_text as string) ?? "",
    whatsappMessageTemplate: (row.whatsapp_message_template as string) ?? "",
  }
}

export async function getAdminCategories(): Promise<Category[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.from("categories").select("*").order("order", { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapCategoryRow)
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_specs(*)")
    .order("updated_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapProductRow)
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_specs(*)")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  return data ? mapProductRow(data) : null
}

export async function getAdminLeads(): Promise<Lead[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapLeadRow)
}

export async function getAdminSiteSettings(): Promise<SiteSettings> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
  if (error) throw error
  return data ? mapSiteSettingsRow(data) : mockSiteSettings
}

// Banners: ainda gerenciados com DEMO DATA no painel — não há CRUD real
// conectado ao Supabase Storage/tabela `banners` por enquanto.
export async function getAdminBanners() {
  return [...mockBanners].sort((a, b) => a.order - b.order)
}

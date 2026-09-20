/**
 * Tipos de domínio da Marajó Motors.
 *
 * Estes tipos espelham o schema planejado para o Supabase (ver seção 29 do briefing):
 * profiles, categories, products, product_images, product_specs, leads, banners, site_settings.
 * Hoje eles são usados pela camada de dados mockada (lib/data/*), mas foram desenhados
 * para mapear 1:1 para as tabelas reais quando a integração for conectada.
 */

export type LeadStatus = "novo" | "em_atendimento" | "convertido" | "arquivado"

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
  order: number
  active: boolean
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt: string
  order: number
  isPrimary: boolean
}

export interface ProductSpec {
  id: string
  productId: string
  label: string
  value: string
  order: number
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  categorySlug: string
  shortDescription: string
  description: string
  price: number | null
  promoPrice: number | null
  featured: boolean
  active: boolean
  images: ProductImage[]
  specs: ProductSpec[]
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  name: string
  whatsapp: string
  email: string | null
  productId: string | null
  productName: string | null
  message: string
  status: LeadStatus
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  imageDesktop: string
  imageMobile: string
  ctaLabel: string
  ctaLink: string
  active: boolean
  order: number
}

export interface SiteSettings {
  companyName: string
  whatsapp: string | null
  instagram: string | null
  phone: string | null
  address: string | null
  email: string | null
  institutionalText: string
  whatsappMessageTemplate: string
}

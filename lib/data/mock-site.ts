import type { Banner, Lead, SiteSettings } from "@/lib/types"

/**
 * DEMO DATA — banner do hero. Futuramente alimentado por /admin/banners e
 * pela tabela `banners` do Supabase (incluindo imagens do Supabase Storage).
 */
export const mockBanners: Banner[] = [
  {
    id: "banner-hero",
    title: "CONQUISTE A SUA MOTO DOS SONHOS.",
    subtitle:
      "Representante autorizado Yamaha e Sousa Motos. Motos, náutica e consórcio Yamaha com atendimento de quem entende.",
    imageDesktop: "/images/banner-yamaha-desktop.png",
    imageMobile: "/images/banner-yamaha-mobile.png",
    ctaLabel: "AGENDE A REVISÃO DE GARANTIA",
    ctaLink: "/revisao-garantia",
    active: true,
    order: 1,
  },
]

/**
 * DEMO DATA — configurações institucionais. NÃO representam dados reais da
 * Marajó Motors. Serão substituídas pela tabela `site_settings` e
 * gerenciadas em /admin/configuracoes.
 */
export const mockSiteSettings: SiteSettings = {
  companyName: "Marajó Motors",
  whatsapp: "(91) 99299-2906",
  instagram: "https://www.instagram.com/marajomotorsoficial/",
  phone: "(91) 99299-2906",
  address: "Lojas filiais em Cametá, Portel e Vigia — Pará",
  email: null,
  institutionalText:
    "Representante autorizado Yamaha e Sousa Motos. Especialistas em motos, náutica e consórcio Yamaha, com lojas filiais em Cametá, Portel e Vigia.",
  whatsappMessageTemplate:
    "Olá! Tenho interesse no produto {{produto}}. Gostaria de receber mais informações.",
}

/**
 * DEMO DATA — leads fictícios apenas para preencher o painel administrativo
 * visualmente. Serão substituídos pela tabela `leads` do Supabase.
 */
export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Carlos Andrade",
    whatsapp: "(00) 00000-0000",
    email: "carlos@example.com",
    productId: "prod-mt03",
    productName: "MT-03",
    message: "Olá! Tenho interesse no produto MT-03. Gostaria de receber mais informações.",
    status: "novo",
    createdAt: "2025-01-20T14:30:00.000Z",
  },
  {
    id: "lead-2",
    name: "Fernanda Souza",
    whatsapp: "(00) 00000-0001",
    email: null,
    productId: "prod-nmax",
    productName: "NMAX",
    message: "Olá! Tenho interesse no produto NMAX. Gostaria de receber mais informações.",
    status: "em_atendimento",
    createdAt: "2025-01-19T09:15:00.000Z",
  },
  {
    id: "lead-3",
    name: "Ricardo Lima",
    whatsapp: "(00) 00000-0002",
    email: "ricardo@example.com",
    productId: null,
    productName: null,
    message: "Gostaria de saber mais sobre as opções de consórcio.",
    status: "convertido",
    createdAt: "2025-01-18T18:00:00.000Z",
  },
  {
    id: "lead-4",
    name: "Juliana Prado",
    whatsapp: "(00) 00000-0003",
    email: null,
    productId: "prod-bike-urbana",
    productName: "Urbana E-Bike",
    message: "Olá! Tenho interesse no produto Urbana E-Bike. Gostaria de receber mais informações.",
    status: "arquivado",
    createdAt: "2025-01-14T11:45:00.000Z",
  },
]

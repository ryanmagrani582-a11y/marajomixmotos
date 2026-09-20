/**
 * Helpers para geração de links do WhatsApp.
 *
 * O número de WhatsApp NUNCA é hardcoded — ele vem de SiteSettings, que hoje
 * é mockado (lib/data/mock-site.ts) e futuramente virá da tabela
 * `site_settings` do Supabase, editável em /admin/configuracoes.
 */

export function buildWhatsAppLink(params: {
  whatsapp: string | null
  message?: string
}): string {
  const { whatsapp, message } = params

  if (!whatsapp) {
    // Nenhum número configurado ainda — placeholder para não quebrar o link.
    return "#whatsapp-nao-configurado"
  }

  const digits = whatsapp.replace(/\D/g, "")
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildProductInterestMessage(template: string, productName: string): string {
  return template.replace("{{produto}}", productName)
}

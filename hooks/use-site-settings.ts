"use client"

import useSWR from "swr"
import type { SiteSettings } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Lê as configurações públicas do site (WhatsApp, Instagram, textos, etc).
 * Hoje serve dados mockados via /api/site-settings; futuramente virá do Supabase
 * (tabela `site_settings`) sem exigir mudanças nos componentes consumidores.
 */
export function useSiteSettings() {
  const { data, isLoading } = useSWR<SiteSettings>("/api/site-settings", fetcher)
  return { settings: data, isLoading }
}

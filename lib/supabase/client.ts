import { createBrowserClient } from "@supabase/ssr"

/**
 * Client Supabase para uso no browser (componentes client).
 *
 * A integração real ainda não está conectada neste projeto. As variáveis
 * NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY deverão ser
 * configuradas no ambiente Vercel quando o Supabase for conectado.
 * Nenhuma service_role key deve ser usada aqui — apenas a anon key.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      "Supabase ainda não está configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }

  return createBrowserClient(url, anonKey)
}

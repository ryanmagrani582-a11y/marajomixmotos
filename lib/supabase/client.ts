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
  // A publishable key é pública por natureza (protegida por RLS), então pode ficar como fallback.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://dazaotnlwyukldzzwifl.supabase.co"
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "sb_publishable_yzrenXablpgE7rZqqLtDXg_Hb42abE4"

  if (!url || !anonKey) {
    throw new Error(
      "Supabase ainda não está configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }

  return createBrowserClient(url, anonKey)
}

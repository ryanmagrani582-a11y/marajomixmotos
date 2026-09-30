import "server-only"

import { createClient } from "@supabase/supabase-js"

/**
 * Client Supabase com a service_role key — ignora Row Level Security.
 *
 * Uso restrito ao painel /admin (que ainda não tem login próprio conectado
 * ao Supabase Auth) para poder ler produtos inativos, todos os leads e as
 * configurações do site. NUNCA importar este arquivo em código exposto ao
 * navegador ou em rotas públicas do site — apenas em Server Components e
 * Server Actions dentro de app/admin.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://dazaotnlwyukldzzwifl.supabase.co"
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "sb_publishable_yzrenXablpgE7rZqqLtDXg_Hb42abE4"

  // Sem a service_role key, cai para a publishable key: o site público continua
  // funcionando (RLS permite leitura), mas gravações do admin serão bloqueadas.
  if (!serviceRoleKey) {
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY ausente — usando publishable key. Gravações do painel admin serão bloqueadas pelo RLS.",
    )
  }

  return createClient(url, serviceRoleKey ?? publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

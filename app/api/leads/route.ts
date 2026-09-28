import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

/**
 * Recebe submissões do formulário de interesse.
 *
 * Hoje apenas valida e loga a submissão — nenhum dado é persistido.
 * Quando o Supabase for conectado, este handler deverá inserir o
 * registro na tabela `leads` (id, name, whatsapp, email, product_id,
 * message, status, created_at).
 */
export async function POST(request: Request) {
  const body = await request.json()
  const { name, whatsapp, email, productId, message } = body ?? {}

  if (!name || !whatsapp || !message) {
    return NextResponse.json({ error: "Nome, WhatsApp e mensagem são obrigatórios." }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { data: product } = productId
    ? await supabase.from("products").select("name").eq("id", productId).maybeSingle()
    : { data: null }

  const { error } = await supabase.from("leads").insert({
    name: String(name).trim(),
    whatsapp: String(whatsapp).trim(),
    email: email ? String(email).trim() : null,
    product_id: productId || null,
    product_name: product?.name ?? null,
    message: String(message).trim(),
    status: "novo",
  })

  if (error) {
    return NextResponse.json({ error: "Não foi possível registrar seu contato." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

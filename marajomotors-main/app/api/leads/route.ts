import { NextResponse } from "next/server"

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

  console.log("[v0] Novo lead recebido (ainda não persistido no Supabase):", {
    name,
    whatsapp,
    email,
    productId,
    message,
  })

  return NextResponse.json({ ok: true })
}

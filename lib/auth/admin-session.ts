import "server-only"

/**
 * Autenticação simples do painel administrativo (usuário + senha fixos).
 * A sessão é um token assinado (HMAC-SHA256) guardado em cookie httpOnly.
 * A chave de assinatura reaproveita a SUPABASE_SERVICE_ROLE_KEY, que já é
 * um segredo disponível apenas no servidor.
 */

export const ADMIN_SESSION_COOKIE_NAME = "marajo_admin_session"
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 dias

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "adminmarajo"
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "marajo2026@@"

type SessionPayload = {
  u: string
  exp: number
}

function getSecret() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada — necessária para assinar a sessão do admin.")
  }
  return secret
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function hmacSign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  return toBase64Url(new Uint8Array(signature))
}

export async function createAdminSessionToken(username: string) {
  const secret = getSecret()
  const payload: SessionPayload = { u: username, exp: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000 }
  const encodedPayload = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const signature = await hmacSign(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export async function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return null

  const [encodedPayload, signature] = token.split(".")
  if (!encodedPayload || !signature) return null

  try {
    const secret = getSecret()
    const expectedSignature = await hmacSign(encodedPayload, secret)
    if (expectedSignature !== signature) return null

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as SessionPayload
    if (!payload.exp || Date.now() > payload.exp) return null

    return { username: payload.u }
  } catch {
    return null
  }
}

export function verifyAdminCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

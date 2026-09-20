"use client"

import type { ReactNode } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { buildProductInterestMessage, buildWhatsAppLink } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

interface WhatsAppCtaButtonProps {
  message?: string
  productName?: string
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "lg" | "sm"
  className?: string
  children?: ReactNode
  showIcon?: boolean
}

/**
 * Botão de CTA para WhatsApp usado em toda a experiência pública.
 * O número e a mensagem-base vêm das configurações do site (futuramente Supabase).
 * Se `productName` for informado, a mensagem é montada a partir do
 * `whatsappMessageTemplate` configurado (com placeholder {{produto}}).
 */
export function WhatsAppCtaButton({
  message,
  productName,
  variant = "default",
  size = "default",
  className,
  children,
  showIcon = true,
}: WhatsAppCtaButtonProps) {
  const { settings } = useSiteSettings()

  const finalMessage = productName
    ? buildProductInterestMessage(
        settings?.whatsappMessageTemplate ??
          "Olá! Tenho interesse no produto {{produto}}. Gostaria de receber mais informações.",
        productName
      )
    : message ?? "Olá! Gostaria de falar com um consultor da Marajó Motors."

  const href = buildWhatsAppLink({ whatsapp: settings?.whatsapp ?? null, message: finalMessage })

  return (
    <Button
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
      nativeButton={false}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      {showIcon && <MessageCircle data-icon="inline-start" />}
      {children ?? "Falar com consultor"}
    </Button>
  )
}

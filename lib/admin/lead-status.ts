import type { LeadStatus } from "@/lib/types"

export const leadStatusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  convertido: "Convertido",
  arquivado: "Arquivado",
}

export const leadStatusOptions: { value: LeadStatus; label: string }[] = (
  Object.entries(leadStatusLabels) as [LeadStatus, string][]
).map(([value, label]) => ({ value, label }))

export function leadStatusBadgeVariant(status: LeadStatus): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "novo":
      return "default"
    case "em_atendimento":
      return "secondary"
    case "convertido":
      return "outline"
    case "arquivado":
      return "destructive"
  }
}

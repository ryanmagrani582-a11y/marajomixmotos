"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { leadStatusOptions } from "@/lib/admin/lead-status"
import type { LeadStatus } from "@/lib/types"

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [value, setValue] = useState<LeadStatus>(status)

  function handleChange(next: string | null) {
    if (!next) return
    setValue(next as LeadStatus)
    // TODO(supabase): atualizar o campo `status` do lead na tabela `leads`.
    toast.success("Status do lead atualizado (simulação — conecte o Supabase para persistir).")
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-full sm:w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {leadStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

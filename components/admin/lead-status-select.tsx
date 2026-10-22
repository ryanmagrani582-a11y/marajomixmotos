"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { updateLeadStatus } from "@/app/admin/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { leadStatusOptions } from "@/lib/admin/lead-status"
import type { LeadStatus } from "@/lib/types"

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [value, setValue] = useState<LeadStatus>(status)
  const [isPending, startTransition] = useTransition()

  function handleChange(next: string | null) {
    if (!next) return
    const previous = value
    const nextStatus = next as LeadStatus
    setValue(nextStatus)
    startTransition(async () => {
      try {
        const result = await updateLeadStatus(leadId, nextStatus)
        if (result.ok) {
          toast.success("Status do lead atualizado.")
        } else {
          setValue(previous)
          toast.error(result.error)
        }
      } catch {
        setValue(previous)
        toast.error("Erro de conexão ao atualizar. Tente novamente.")
      }
    })
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={isPending}>
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

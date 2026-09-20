"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import type { SiteSettings } from "@/lib/types"

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState(settings)

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO(supabase): persistir as configurações na tabela `site_settings`.
    toast.success("Configurações salvas (simulação — conecte o Supabase para persistir).")
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <Card className="border-white/10 bg-[#0B0B0B]">
        <CardHeader>
          <CardTitle className="font-heading text-base">Informações institucionais</CardTitle>
          <CardDescription>Usadas no rodapé, na página inicial e no WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="companyName">Nome da empresa</FieldLabel>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="institutionalText">Texto institucional</FieldLabel>
              <Textarea
                id="institutionalText"
                rows={4}
                value={form.institutionalText}
                onChange={(e) => update("institutionalText", e.target.value)}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-[#0B0B0B]">
        <CardHeader>
          <CardTitle className="font-heading text-base">Canais de contato</CardTitle>
          <CardDescription>Exibidos no cabeçalho, rodapé e página de contato.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
                <Input
                  id="whatsapp"
                  value={form.whatsapp ?? ""}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Telefone fixo</FieldLabel>
                <Input
                  id="phone"
                  value={form.phone ?? ""}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(00) 0000-0000"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
                <Input
                  id="instagram"
                  value={form.instagram ?? ""}
                  onChange={(e) => update("instagram", e.target.value)}
                  placeholder="@marajomotors"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="address">Endereço</FieldLabel>
              <Input
                id="address"
                value={form.address ?? ""}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="whatsappMessageTemplate">Modelo de mensagem do WhatsApp</FieldLabel>
              <Textarea
                id="whatsappMessageTemplate"
                rows={3}
                value={form.whatsappMessageTemplate}
                onChange={(e) => update("whatsappMessageTemplate", e.target.value)}
              />
              <FieldDescription>
                Use {"{{produto}}"} para inserir o nome do produto automaticamente.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Salvar configurações</Button>
      </div>
    </form>
  )
}

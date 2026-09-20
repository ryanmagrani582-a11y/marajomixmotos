"use client"

import { useState } from "react"
import { Loader2Icon, SendIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/lib/types"

interface InterestFormProps {
  products?: Product[]
  defaultProductId?: string
  title?: string
  description?: string
}

interface FormState {
  name: string
  whatsapp: string
  email: string
  productId: string
  message: string
}

const initialState: FormState = {
  name: "",
  whatsapp: "",
  email: "",
  productId: "",
  message: "",
}

export function InterestForm({
  products = [],
  defaultProductId,
  title = "FALE COM UM CONSULTOR",
  description = "Preencha seus dados e retornaremos o mais breve possível.",
}: InterestFormProps) {
  const [form, setForm] = useState<FormState>({
    ...initialState,
    productId: defaultProductId ?? "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) nextErrors.name = "Informe seu nome."
    if (!form.whatsapp.trim()) nextErrors.whatsapp = "Informe seu WhatsApp."
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error("Falha ao enviar interesse")

      toast.success("Interesse enviado com sucesso!", {
        description: "Um consultor da Marajó Motors entrará em contato em breve.",
      })
      setForm({ ...initialState, productId: defaultProductId ?? "" })
    } catch {
      toast.error("Não foi possível enviar agora.", {
        description: "Tente novamente em alguns instantes.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="lead-name">Nome</FieldLabel>
          <Input
            id="lead-name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Seu nome completo"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <FieldError>{errors.name}</FieldError> : null}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.whatsapp)}>
            <FieldLabel htmlFor="lead-whatsapp">WhatsApp</FieldLabel>
            <Input
              id="lead-whatsapp"
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              placeholder="(00) 00000-0000"
              aria-invalid={Boolean(errors.whatsapp)}
            />
            {errors.whatsapp ? <FieldError>{errors.whatsapp}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="lead-email">E-mail</FieldLabel>
            <Input
              id="lead-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="seuemail@exemplo.com"
            />
          </Field>
        </div>

        {products.length > 0 ? (
          <Field>
            <FieldLabel htmlFor="lead-product">Produto de interesse</FieldLabel>
            <Select
              value={form.productId}
              onValueChange={(value) => updateField("productId", value ?? "")}
              items={products.map((p) => ({ value: p.id, label: p.name }))}
            >
              <SelectTrigger id="lead-product">
                <SelectValue placeholder="Selecione um produto (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        ) : null}

        <Field>
          <FieldLabel htmlFor="lead-message">Mensagem</FieldLabel>
          <Textarea
            id="lead-message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Conte um pouco sobre o que você procura..."
            rows={4}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <Loader2Icon className="animate-spin" data-icon="inline-start" />
        ) : (
          <SendIcon data-icon="inline-start" />
        )}
        ENVIAR INTERESSE
      </Button>
    </form>
  )
}

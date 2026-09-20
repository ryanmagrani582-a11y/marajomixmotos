import type { Metadata } from "next"
import { MapPinIcon, MessageCircleIcon } from "lucide-react"
import { mockSiteSettings } from "@/lib/data/mock-site"
import { InstagramIcon } from "@/components/icons/instagram-icon"
import { InterestForm } from "@/components/forms/interest-form"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"

export const metadata: Metadata = {
  title: "Contato | Marajó Motors",
  description: "Fale com um consultor da Marajó Motors pelo WhatsApp ou envie sua mensagem.",
}

export default function ContatoPage() {
  const settings = mockSiteSettings

  return (
    <div className="flex flex-col">
      <section className="border-b border-white/10 bg-[#0B0B0B] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Fale com a Marajó Motors</span>
          <h1 className="max-w-2xl font-heading text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
            ESTAMOS PRONTOS PARA TE ATENDER.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Fale diretamente com um consultor pelo WhatsApp ou envie sua mensagem pelo formulário abaixo.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-card p-6">
              <div className="flex items-center gap-3">
                <MessageCircleIcon className="size-5 text-primary" />
                <p className="font-medium text-foreground">WhatsApp</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {settings.whatsapp ? settings.whatsapp : "A definir — configurar no painel administrativo"}
              </p>
              <div className="mt-2">
                <WhatsAppCtaButton message="Olá! Gostaria de falar com um consultor da Marajó Motors.">
                  FALAR COM CONSULTOR
                </WhatsAppCtaButton>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-card p-6">
              <div className="flex items-center gap-3">
                <MapPinIcon className="size-5 text-primary" />
                <p className="font-medium text-foreground">Endereço</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {settings.address ? settings.address : "A definir — configurar no painel administrativo"}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-card p-6">
              <div className="flex items-center gap-3">
                <InstagramIcon className="size-5 text-primary" />
                <p className="font-medium text-foreground">Instagram</p>
              </div>
              <a
                href={settings.instagram ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                @marajomotorsoficial
              </a>
            </div>
          </div>

          <InterestForm
            title="ENVIAR MENSAGEM"
            description="Preencha seus dados abaixo e retornaremos o mais breve possível."
          />
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from "next"
import { CheckCircle2Icon, ClockIcon, WrenchIcon } from "lucide-react"
import { InterestForm } from "@/components/forms/interest-form"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"

export const metadata: Metadata = {
  title: "Revisão de Garantia | Marajó Motors",
  description:
    "Agende a revisão de garantia da sua Yamaha nas oficinas autorizadas Yamaha Motos e Sousa Motos.",
}

const highlights = [
  {
    icon: WrenchIcon,
    title: "Oficinas autorizadas",
    description: "Manutenção realizada por técnicos Yamaha Motos e Sousa Motos, com peças originais.",
  },
  {
    icon: CheckCircle2Icon,
    title: "Garantia preservada",
    description: "Revisões em dia mantêm a garantia de fábrica da sua Yamaha válida.",
  },
  {
    icon: ClockIcon,
    title: "Agendamento facilitado",
    description: "Preencha o formulário ou fale com um consultor e escolha o melhor horário.",
  },
]

export default function RevisaoGarantiaPage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[380px] items-center overflow-hidden bg-[#0B0B0B] px-4 py-20 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_55%)]"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Revisão de Garantia • Yamaha Motos e Sousa Motos
          </span>
          <h1 className="max-w-3xl font-heading text-3xl font-bold uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            AGENDE A REVISÃO DE GARANTIA DA SUA YAMAHA
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Mantenha sua Yamaha sempre em dia. Nossas oficinas autorizadas Yamaha Motos e Sousa Motos cuidam da
            revisão de garantia com quem entende do assunto.
          </p>
          <div>
            <WhatsAppCtaButton
              size="lg"
              message="Olá! Gostaria de agendar a revisão de garantia da minha Yamaha."
            >
              AGENDAR PELO WHATSAPP
            </WhatsAppCtaButton>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Nossas oficinas
              </h2>
              <p className="text-muted-foreground">
                Em breve, as informações completas das oficinas Yamaha Motos e Sousa Motos — endereços, horários
                de atendimento e especialidades de cada unidade — estarão disponíveis aqui.
              </p>

              <div className="mt-4 flex flex-col gap-4">
                {highlights.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <InterestForm
              title="AGENDAR REVISÃO DE GARANTIA"
              description="Preencha seus dados e um consultor entrará em contato para confirmar o agendamento."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

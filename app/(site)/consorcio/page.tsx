import type { Metadata } from "next"
import { CheckCircle2Icon } from "lucide-react"
import { mockCategories } from "@/lib/data/mock-categories"
import { CategoryCard } from "@/components/categories/category-card"
import { InterestForm } from "@/components/forms/interest-form"
import { WhatsAppCtaButton } from "@/components/whatsapp/whatsapp-cta-button"

export const metadata: Metadata = {
  title: "Consórcio Yamaha | Marajó Motors",
  description:
    "Representante autorizado Yamaha. Planeje hoje a conquista da sua Yamaha com o consórcio Yamaha na Marajó Motors.",
}

const benefits = [
  {
    title: "Consórcio Yamaha oficial",
    description: "Somos representante autorizado Yamaha para o seu consórcio com total segurança.",
  },
  {
    title: "Linha Yamaha completa",
    description: "Motos e produtos náuticos Yamaha, além de outras soluções de mobilidade.",
  },
  {
    title: "Atendimento consultivo",
    description: "Um consultor Marajó Motors te ajuda a encontrar a melhor opção Yamaha.",
  },
]

// Consórcio faz sentido para produtos de maior valor: motos, náutica, quadriciclos e triciclos.
const consortiumCategories = mockCategories.filter((c) =>
  ["motos", "nautica", "quadriciclos", "triciclos"].includes(c.slug)
)

export default function ConsorcioPage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[420px] items-center overflow-hidden bg-[#0B0B0B] px-4 py-24 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_55%)]"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Consórcio Yamaha • Representante Autorizado
          </span>
          <h1 className="max-w-3xl font-heading text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            PLANEJE HOJE A SUA YAMAHA.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Como representante autorizado Yamaha, oferecemos o consórcio Yamaha para você realizar seus planos de
            mobilidade, trabalho ou lazer.
          </p>
          <div>
            <WhatsAppCtaButton
              size="lg"
              message="Olá! Gostaria de saber mais sobre as opções de consórcio da Marajó Motors."
            >
              QUERO SABER MAIS
            </WhatsAppCtaButton>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                O que é o consórcio Marajó Motors
              </h2>
              <p className="text-muted-foreground">
                O consórcio é uma forma de planejamento financeiro para adquirir o produto que você deseja, dentro
                do seu orçamento e no seu tempo. Nossos consultores explicam as condições disponíveis, prazos e
                valores diretamente com você, sem informações genéricas.
              </p>
              <p className="text-sm text-muted-foreground/80">
                Condições comerciais, taxas e prazos variam conforme o produto e serão apresentados por um
                consultor Marajó Motors.
              </p>

              <div className="mt-4 flex flex-col gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{benefit.title}</p>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <InterestForm
              title="QUERO SABER MAIS SOBRE CONSÓRCIO"
              description="Preencha seus dados e um consultor entrará em contato para explicar as opções disponíveis."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0B0B0B] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 flex flex-col gap-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Categorias disponíveis para consórcio
            </h2>
            <p className="text-muted-foreground">
              Consulte um consultor para saber quais produtos estão disponíveis em cada categoria.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {consortiumCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

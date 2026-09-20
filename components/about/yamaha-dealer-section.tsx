import Image from "next/image"
import { BadgeCheck, Wrench } from "lucide-react"

const highlights = [
  {
    icon: BadgeCheck,
    title: "Representante Oficial",
    description: "Revenda autorizada Yamaha e Sousa Motos, com produtos originais e garantia de fábrica.",
  },
  {
    icon: Wrench,
    title: "Peças e Assistência",
    description: "Peças genuínas e assistência técnica especializada na linha Yamaha.",
  },
]

/**
 * Card dedicado ao Consórcio Nacional Yamaha, usando a logo oficial em vez de
 * um ícone genérico — reforça que o consórcio é um plano oficial da marca.
 */
function ConsorcioHighlightCard() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 text-center">
      <span className="flex h-12 w-24 items-center justify-center rounded-lg bg-white p-1.5">
        <Image
          src="/images/logo-yamaha-consorcio.jpg"
          alt="Logo do Consórcio Nacional Yamaha"
          width={200}
          height={120}
          className="h-full w-full object-contain"
        />
      </span>
      <h3 className="font-heading text-base font-semibold uppercase tracking-wide">Consórcio Yamaha</h3>
      <p className="text-sm leading-relaxed text-primary-foreground/80">
        Planos oficiais do Consórcio Nacional Yamaha, sem juros e com parcelas que cabem no bolso.
      </p>
    </div>
  )
}

/**
 * Faixa de credibilidade destacando que a Marajó Motors é representante
 * autorizado Yamaha. Fica logo abaixo do hero na home.
 */
export function YamahaDealerSection() {
  return (
    <section className="w-full border-y border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] sm:text-xs">
            <BadgeCheck className="size-4" />
            Representante Autorizado Yamaha e Sousa Motos
          </span>
          <h2 className="max-w-2xl font-heading text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
            A referência Yamaha no Marajó e região
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Motos, náutica, scooters e consórcio direto da linha oficial Yamaha, com a estrutura Yamaha Motos e Sousa
            Motos e o atendimento de quem entende do produto.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/15">
              <BadgeCheck className="size-6" />
            </span>
            <h3 className="font-heading text-base font-semibold uppercase tracking-wide">{highlights[0].title}</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/80">{highlights[0].description}</p>
          </div>

          <ConsorcioHighlightCard />

          <div className="flex flex-col items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/15">
              <Wrench className="size-6" />
            </span>
            <h3 className="font-heading text-base font-semibold uppercase tracking-wide">{highlights[1].title}</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/80">{highlights[1].description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

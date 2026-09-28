import { MapPin, ShieldCheck, Sparkles, Waves } from "lucide-react"

const locations = ["Breves", "Portel", "Cametá", "Vigia de Nazaré"]

export default function SobrePage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-primary px-4 pb-16 pt-36 text-primary-foreground sm:px-6 lg:px-8 lg:pb-24 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/75">
            Quem somos
          </p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            Mobilidade que acompanha você em terra e nos rios.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-primary-foreground/85 sm:text-lg">
            Conheça a Marajó Motors Mix, uma rede de concessionárias autorizadas Yamaha presente em diferentes regiões do Pará.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24 lg:px-8 lg:py-24">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">Sobre a Marajó Motors Mix</p>
          <div className="mt-7 space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
            <p>A Marajó Motors Mix é uma rede de concessionárias autorizadas Yamaha, com forte presença na Ilha do Marajó e em diferentes regiões do estado do Pará. Ao longo de sua trajetória, a empresa vem construindo uma relação de confiança com seus clientes, oferecendo produtos, serviços e soluções de mobilidade para diferentes necessidades.</p>
            <p>Com unidades em Breves, Portel, Cametá e Vigia de Nazaré, a Marajó Motors Mix está presente em importantes cidades da região, levando atendimento especializado e produtos de qualidade cada vez mais próximos de seus clientes.</p>
            <p>Nosso portfólio reúne motocicletas Yamaha, motores de popa, triciclos de carga e soluções de mobilidade elétrica, atendendo tanto quem busca praticidade para o dia a dia quanto profissionais que dependem de veículos para trabalhar e se deslocar.</p>
            <p>Também oferecemos Consórcio Nacional Yamaha, financiamento pelo Banco Yamaha e outras opções de crédito, facilitando o acesso aos produtos e ajudando nossos clientes a encontrar a melhor solução para cada momento.</p>
            <p>Mais do que vender veículos, a Marajó Motors Mix busca oferecer uma experiência completa, baseada em confiança, qualidade, atendimento e compromisso com as comunidades onde está presente.</p>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3 text-primary"><MapPin className="size-5" aria-hidden="true" /><h2 className="font-heading text-lg font-bold">Onde estamos</h2></div>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              {locations.map((location) => <li key={location} className="border-b border-border pb-3">{location}</li>)}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="border border-border bg-card p-5"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /><p className="mt-3 font-heading font-semibold">Confiança</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Uma relação construída com nossos clientes.</p></div>
            <div className="border border-border bg-card p-5"><Sparkles className="size-5 text-primary" aria-hidden="true" /><p className="mt-3 font-heading font-semibold">Qualidade</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Produtos e atendimento especializados.</p></div>
            <div className="border border-border bg-card p-5"><Waves className="size-5 text-primary" aria-hidden="true" /><p className="mt-3 font-heading font-semibold">Presença regional</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Perto de quem vive e trabalha no Pará.</p></div>
          </div>
        </aside>
      </section>

      <section className="border-t border-border bg-muted/40 px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-xl font-bold sm:text-2xl">Marajó Motors Mix</p>
        <p className="mt-2 text-muted-foreground">Mobilidade que acompanha você em terra e nos rios.</p>
      </section>
    </main>
  )
}

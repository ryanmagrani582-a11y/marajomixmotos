import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConsorcioHomeSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[440px]">
          <Image
            src="/images/cat-consorcio.png"
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background" />
        </div>

        <div className="flex flex-col justify-center bg-background px-4 py-16 sm:px-6 lg:px-16 lg:py-0">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">Consórcio</p>
          <h2 className="mt-3 max-w-md font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
            Planeje hoje a sua próxima conquista.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Encontre uma opção de consórcio para realizar seus planos de mobilidade, trabalho ou lazer.
          </p>
          <Button
            render={<Link href="/consorcio" />}
            nativeButton={false}
            size="lg"
            className="mt-8 h-12 w-fit px-6 text-sm"
          >
            QUERO SABER MAIS
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}

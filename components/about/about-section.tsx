import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutSection() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">Marajó Motors</p>
        <p className="mt-5 text-xl leading-relaxed text-foreground sm:text-2xl">
          Uma experiência completa para quem busca produtos de mobilidade, aventura, trabalho e lazer.
        </p>
        <Button render={<Link href="/sobre" />} nativeButton={false} variant="outline" className="mt-8">
          CONHEÇA A MARAJÓ MOTORS
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}

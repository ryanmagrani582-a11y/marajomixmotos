import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)} aria-label="Marajó Motors - Página inicial">
      <Image
        src="/images/marajo-motors-logo.png"
        alt="Marajó Motors"
        width={480}
        height={192}
        priority
        className="h-16 w-auto object-contain md:h-20"
      />
    </Link>
  )
}

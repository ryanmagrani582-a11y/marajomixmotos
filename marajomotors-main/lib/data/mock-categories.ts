import type { Category } from "@/lib/types"

/**
 * DEMO DATA — dados fictícios apenas para demonstrar o layout.
 * Serão substituídos pela tabela `categories` do Supabase.
 */
export const mockCategories: Category[] = [
  {
    id: "cat-motos",
    slug: "motos",
    name: "Motos",
    description: "Motos Yamaha para todos os estilos: urbanas, esportivas e de trabalho.",
    image: "/images/cat-motos.png",
    order: 1,
    active: true,
  },
  {
    id: "cat-nautica",
    slug: "nautica",
    name: "Náutica",
    description: "Jet skis e produtos náuticos Yamaha para aproveitar a água com performance.",
    image: "/images/cat-nautica.png",
    order: 2,
    active: true,
  },
  {
    id: "cat-quadriciclos",
    slug: "quadriciclos",
    name: "Quadriciclos",
    description: "Quadriciclos para trabalho, esporte e aventura em qualquer terreno.",
    image: "/images/cat-quadriciclos.png",
    order: 3,
    active: true,
  },
  {
    id: "cat-triciclos",
    slug: "triciclos",
    name: "Triciclos de Carga",
    description: "Soluções de mobilidade e transporte de carga para o seu negócio.",
    image: "/images/cat-triciclos.png",
    order: 4,
    active: true,
  },
  {
    id: "cat-scooters",
    slug: "scooters",
    name: "Scooters",
    description: "Praticidade e economia para o dia a dia na cidade.",
    image: "/images/cat-scooters.png",
    order: 5,
    active: true,
  },
  {
    id: "cat-bikes-eletricas",
    slug: "bikes-eletricas",
    name: "Bikes Elétricas",
    description: "Mobilidade elétrica, sustentável e cheia de estilo.",
    image: "/images/cat-bikes.png",
    order: 6,
    active: true,
  },
  {
    id: "cat-consorcio",
    slug: "consorcio",
    name: "Consórcio",
    description: "Planeje hoje a conquista do seu próximo produto Marajó Motors.",
    image: "/images/cat-consorcio.png",
    order: 7,
    active: true,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find((category) => category.slug === slug)
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug
}

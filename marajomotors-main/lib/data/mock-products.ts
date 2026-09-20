import type { Product } from "@/lib/types"

/**
 * DEMO DATA — produtos fictícios criados apenas para demonstrar o layout e a
 * navegação do showroom. Nenhum destes nomes, preços ou especificações
 * representa informação real da Marajó Motors. Serão substituídos pelas
 * tabelas `products`, `product_images` e `product_specs` do Supabase.
 */
export const mockProducts: Product[] = [
  {
    id: "prod-mt03",
    slug: "yamaha-mt-03-demo",
    name: "MT-03",
    brand: "YAMAHA",
    categorySlug: "motos",
    shortDescription: "Naked esportiva de média cilindrada, leve e agressiva.",
    description:
      "DEMO DATA — texto de demonstração. A MT-03 combina design agressivo com uma pilotagem ágil, ideal para o dia a dia urbano e escapadas de fim de semana.",
    price: 27990,
    promoPrice: null,
    featured: true,
    active: true,
    images: [
      { id: "img-mt03-1", productId: "prod-mt03", url: "/images/prod-moto-mt03.png", alt: "Yamaha MT-03", order: 1, isPrimary: true },
    ],
    specs: [
      { id: "s1", productId: "prod-mt03", label: "Motor", value: "321 cc", order: 1 },
      { id: "s2", productId: "prod-mt03", label: "Potência", value: "42 cv", order: 2 },
      { id: "s3", productId: "prod-mt03", label: "Transmissão", value: "6 marchas", order: 3 },
      { id: "s4", productId: "prod-mt03", label: "Combustível", value: "Gasolina", order: 4 },
      { id: "s5", productId: "prod-mt03", label: "Peso", value: "168 kg", order: 5 },
    ],
    createdAt: "2025-01-10T10:00:00.000Z",
    updatedAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "prod-fz25",
    slug: "yamaha-fz25-demo",
    name: "FZ25",
    brand: "YAMAHA",
    categorySlug: "motos",
    shortDescription: "Naked de média cilindrada com pegada confortável.",
    description:
      "DEMO DATA — texto de demonstração. A FZ25 entrega torque generoso e conforto para quem quer uma moto versátil para todos os dias.",
    price: 24990,
    promoPrice: 22990,
    featured: true,
    active: true,
    images: [
      { id: "img-fz25-1", productId: "prod-fz25", url: "/images/prod-moto-fz25.png", alt: "Yamaha FZ25", order: 1, isPrimary: true },
    ],
    specs: [
      { id: "s1", productId: "prod-fz25", label: "Motor", value: "249 cc", order: 1 },
      { id: "s2", productId: "prod-fz25", label: "Potência", value: "20,9 cv", order: 2 },
      { id: "s3", productId: "prod-fz25", label: "Transmissão", value: "5 marchas", order: 3 },
      { id: "s4", productId: "prod-fz25", label: "Combustível", value: "Gasolina", order: 4 },
    ],
    createdAt: "2025-01-08T10:00:00.000Z",
    updatedAt: "2025-01-08T10:00:00.000Z",
  },
  {
    id: "prod-nmax",
    slug: "yamaha-nmax-demo",
    name: "NMAX",
    brand: "YAMAHA",
    categorySlug: "scooters",
    shortDescription: "Scooter premium com tecnologia e conforto de sobra.",
    description:
      "DEMO DATA — texto de demonstração. A NMAX une design moderno, painel digital e espaço para o dia a dia na cidade.",
    price: 19990,
    promoPrice: null,
    featured: true,
    active: true,
    images: [
      { id: "img-nmax-1", productId: "prod-nmax", url: "/images/prod-scooter-nmax-1.png", alt: "Yamaha NMAX — vista lateral", order: 1, isPrimary: true },
      { id: "img-nmax-2", productId: "prod-nmax", url: "/images/prod-scooter-nmax-2.png", alt: "Yamaha NMAX — vista traseira", order: 2, isPrimary: false },
    ],
    specs: [
      { id: "s1", productId: "prod-nmax", label: "Motor", value: "155 cc", order: 1 },
      { id: "s2", productId: "prod-nmax", label: "Potência", value: "15,1 cv", order: 2 },
      { id: "s3", productId: "prod-nmax", label: "Transmissão", value: "Automática CVT", order: 3 },
      { id: "s4", productId: "prod-nmax", label: "Capacidade do tanque", value: "7,1 L", order: 4 },
    ],
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "prod-vx-cruiser",
    slug: "yamaha-vx-cruiser-demo",
    name: "VX Cruiser",
    brand: "YAMAHA",
    categorySlug: "nautica",
    shortDescription: "Jet ski premium para famílias e aventuras na água.",
    description:
      "DEMO DATA — texto de demonstração. O VX Cruiser oferece estabilidade, conforto e espaço de armazenamento para o seu dia na água.",
    price: null,
    promoPrice: null,
    featured: true,
    active: true,
    images: [
      { id: "img-vx-1", productId: "prod-vx-cruiser", url: "/images/prod-jetski-vx.png", alt: "Yamaha VX Cruiser", order: 1, isPrimary: true },
    ],
    specs: [
      { id: "s1", productId: "prod-vx-cruiser", label: "Motor", value: "1049 cc" , order: 1 },
      { id: "s2", productId: "prod-vx-cruiser", label: "Capacidade", value: "3 pessoas", order: 2 },
      { id: "s3", productId: "prod-vx-cruiser", label: "Combustível", value: "Gasolina", order: 3 },
    ],
    createdAt: "2025-01-05T10:00:00.000Z",
    updatedAt: "2025-01-05T10:00:00.000Z",
  },
  {
    id: "prod-tc150",
    slug: "triciclo-carga-tc150-demo",
    name: "TC150 Carga",
    brand: "SOUSA MOTOS",
    categorySlug: "triciclos",
    shortDescription: "Triciclo de carga para trabalho pesado no dia a dia.",
    description:
      "DEMO DATA — texto de demonstração. O TC150 foi pensado para quem precisa de capacidade de carga e economia para o trabalho.",
    price: 18990,
    promoPrice: null,
    featured: false,
    active: true,
    images: [
      { id: "img-tc150-1", productId: "prod-tc150", url: "/images/prod-triciclo-tc150.png", alt: "Triciclo de carga TC150", order: 1, isPrimary: true },
    ],
    specs: [
      { id: "s1", productId: "prod-tc150", label: "Motor", value: "150 cc", order: 1 },
      { id: "s2", productId: "prod-tc150", label: "Capacidade de carga", value: "500 kg", order: 2 },
      { id: "s3", productId: "prod-tc150", label: "Caçamba", value: "Aço reforçado", order: 3 },
    ],
    createdAt: "2025-01-03T10:00:00.000Z",
    updatedAt: "2025-01-03T10:00:00.000Z",
  },
  {
    id: "prod-yfz450",
    slug: "yamaha-yfz450-demo",
    name: "YFZ450",
    brand: "YAMAHA",
    categorySlug: "quadriciclos",
    shortDescription: "Quadriciclo esportivo de alta performance.",
    description:
      "DEMO DATA — texto de demonstração. O YFZ450 é feito para quem busca performance e adrenalina em qualquer terreno.",
    price: 54990,
    promoPrice: null,
    featured: false,
    active: true,
    images: [
      { id: "img-yfz-1", productId: "prod-yfz450", url: "/images/prod-quadriciclo-yfz450.png", alt: "Yamaha YFZ450", order: 1, isPrimary: true },
    ],
    specs: [
      { id: "s1", productId: "prod-yfz450", label: "Motor", value: "449 cc", order: 1 },
      { id: "s2", productId: "prod-yfz450", label: "Transmissão", value: "5 marchas + ré", order: 2 },
      { id: "s3", productId: "prod-yfz450", label: "Tração", value: "Traseira", order: 3 },
    ],
    createdAt: "2025-01-02T10:00:00.000Z",
    updatedAt: "2025-01-02T10:00:00.000Z",
  },
  {
    id: "prod-bike-urbana",
    slug: "bike-eletrica-urbana-demo",
    name: "Urbana E-Bike",
    brand: "SOUSA MOTOS",
    categorySlug: "bikes-eletricas",
    shortDescription: "Bike elétrica leve, ideal para a cidade.",
    description:
      "DEMO DATA — texto de demonstração. A Urbana E-Bike entrega autonomia e praticidade para o seu trajeto diário sem complicação.",
    price: 8990,
    promoPrice: 7990,
    featured: true,
    active: true,
    images: [
      { id: "img-bike-1", productId: "prod-bike-urbana", url: "/images/prod-bike-urbana.png", alt: "Bike elétrica urbana", order: 1, isPrimary: true },
    ],
    specs: [
      { id: "s1", productId: "prod-bike-urbana", label: "Motor", value: "350 W", order: 1 },
      { id: "s2", productId: "prod-bike-urbana", label: "Autonomia", value: "Até 60 km", order: 2 },
      { id: "s3", productId: "prod-bike-urbana", label: "Bateria", value: "36V removível", order: 3 },
    ],
    createdAt: "2025-01-12T10:00:00.000Z",
    updatedAt: "2025-01-12T10:00:00.000Z",
  },
]

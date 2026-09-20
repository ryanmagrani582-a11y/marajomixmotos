import { HeroSection } from "@/components/hero/hero-section"
import { YamahaDealerSection } from "@/components/about/yamaha-dealer-section"
import { CategoryGridSection } from "@/components/categories/category-grid-section"
import { FeaturedProductsSection } from "@/components/products/featured-products-section"
import { ConsorcioHomeSection } from "@/components/consorcio/consorcio-home-section"
import { AboutSection } from "@/components/about/about-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <YamahaDealerSection />
      <CategoryGridSection />
      <FeaturedProductsSection />
      <ConsorcioHomeSection />
      <AboutSection />
    </>
  )
}

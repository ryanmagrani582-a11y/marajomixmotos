import type { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getCategories } from "@/lib/data/repository"

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const categories = await getCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  )
}

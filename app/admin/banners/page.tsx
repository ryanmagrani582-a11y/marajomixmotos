import { BannersManager } from "@/components/admin/banners-manager"
import { getAdminBanners } from "@/lib/data/repository"

export const dynamic = "force-dynamic"

export default async function AdminBannersPage() {
  const banners = await getAdminBanners()
  return <BannersManager banners={banners} />
}

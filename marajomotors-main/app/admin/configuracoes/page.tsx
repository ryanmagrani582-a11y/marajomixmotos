import { SettingsForm } from "@/components/admin/settings-form"
import { getAdminSiteSettings } from "@/lib/data/repository"
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  let settings: Awaited<ReturnType<typeof getAdminSiteSettings>>
  try {
    settings = await getAdminSiteSettings()
  } catch {
    return <SupabaseSetupNotice />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Informações institucionais e canais de contato exibidos no site.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}

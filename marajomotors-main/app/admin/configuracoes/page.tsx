import { SettingsForm } from "@/components/admin/settings-form"
import { getAdminSiteSettings } from "@/lib/data/repository"

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings()

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

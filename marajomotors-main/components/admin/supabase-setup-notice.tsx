import { DatabaseIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

/**
 * Exibido no lugar de qualquer tela administrativa quando a leitura no
 * Supabase falha (normalmente porque NEXT_PUBLIC_SUPABASE_URL e
 * SUPABASE_SERVICE_ROLE_KEY ainda não foram configuradas no projeto).
 * Evita que o painel /admin quebre com uma página de erro 500.
 */
export function SupabaseSetupNotice() {
  return (
    <Empty className="min-h-[50vh] border border-dashed border-border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <DatabaseIcon />
        </EmptyMedia>
        <EmptyTitle>Supabase não conectado</EmptyTitle>
        <EmptyDescription>
          Esta área do painel lê dados diretamente do Supabase e ainda não está configurada neste projeto.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          Conecte a integração do Supabase nas configurações do projeto para habilitar produtos, categorias, leads e
          configurações do site.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}

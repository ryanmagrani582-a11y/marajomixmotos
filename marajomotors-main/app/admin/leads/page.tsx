import { UsersIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { getAdminLeads } from "@/lib/data/repository"
import { LeadStatusSelect } from "@/components/admin/lead-status-select"

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Leads</h2>
          <p className="text-sm text-muted-foreground">
            Contatos recebidos pelos formulários do site e do WhatsApp.
          </p>
        </div>
        <Badge variant="secondary" className="mt-1">
          {leads.length} {leads.length === 1 ? "lead" : "leads"}
        </Badge>
      </div>

      <Card className="rounded-xl border-white/10 bg-[#0B0B0B]">
        <CardContent className="p-0">
          {leads.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum lead recebido</EmptyTitle>
                <EmptyDescription>Os contatos enviados pelo site aparecerão aqui.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              {/* Mobile: lista em cards */}
              <div className="flex flex-col divide-y divide-white/10 lg:hidden">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.whatsapp}</p>
                        {lead.email ? <p className="text-xs text-muted-foreground">{lead.email}</p> : null}
                      </div>
                      <span className="shrink-0 text-right text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Interesse: {lead.productName ?? "Interesse geral"}
                    </p>
                    <p className="text-sm text-muted-foreground">{lead.message}</p>
                    <LeadStatusSelect leadId={lead.id} status={lead.status} />
                  </div>
                ))}
              </div>

              {/* Desktop: tabela */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Mensagem</TableHead>
                      <TableHead>Recebido em</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="text-sm font-medium text-foreground">{lead.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <p>{lead.whatsapp}</p>
                          {lead.email ? <p className="text-xs">{lead.email}</p> : null}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {lead.productName ?? "Interesse geral"}
                        </TableCell>
                        <TableCell className="max-w-64 truncate text-sm text-muted-foreground" title={lead.message}>
                          {lead.message}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <LeadStatusSelect leadId={lead.id} status={lead.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

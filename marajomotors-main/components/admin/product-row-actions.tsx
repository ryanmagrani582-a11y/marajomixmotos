"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MoreHorizontalIcon, PencilIcon, CopyIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteProduct, duplicateProduct } from "@/app/admin/actions"

export function ProductRowActions({ productId }: { productId: string }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  async function handleDuplicate() {
    setIsBusy(true)
    try {
      await duplicateProduct(productId)
      toast.success("Produto duplicado.")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível duplicar o produto.")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleDelete() {
    setIsBusy(true)
    try {
      await deleteProduct(productId)
      setConfirmOpen(false)
      toast.success("Produto excluído.")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o produto.")
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
          <MoreHorizontalIcon />
          <span className="sr-only">Ações do produto</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href={`/admin/produtos/${productId}`} />}>
              <PencilIcon data-icon="inline-start" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <CopyIcon data-icon="inline-start" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2Icon data-icon="inline-start" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente do catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

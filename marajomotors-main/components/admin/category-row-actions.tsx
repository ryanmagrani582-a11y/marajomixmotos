"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PencilIcon, Trash2Icon, MoreHorizontalIcon } from "lucide-react"
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
import { CategoryFormDialog } from "@/components/admin/category-form-dialog"
import { deleteCategory } from "@/app/admin/actions"
import type { Category } from "@/lib/types"

export function CategoryRowActions({ category }: { category: Category }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteCategory(category.id)
      setConfirmOpen(false)
      toast.success("Categoria excluída.")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir a categoria.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
          <MoreHorizontalIcon />
          <span className="sr-only">Ações da categoria</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <CategoryFormDialog
              category={category}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <PencilIcon data-icon="inline-start" />
                  Editar
                </DropdownMenuItem>
              }
            />
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
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              A categoria &quot;{category.name}&quot; será removida permanentemente. Produtos vinculados a ela
              precisarão ser reatribuídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

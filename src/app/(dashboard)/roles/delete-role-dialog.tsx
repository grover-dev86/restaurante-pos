'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRole } from '@/actions/roles'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Role {
  id: string
  name: string
  displayName: string
  _count?: {
    users: number
  }
}

interface DeleteRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

export function DeleteRoleDialog({ open, onOpenChange, role }: DeleteRoleDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!role) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteRole(role.id)

      if (result.success) {
        toast({
          title: 'Rol eliminado',
          description: result.message,
        })
        onOpenChange(false)
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al eliminar el rol',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar rol?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar el rol <strong>{role.displayName}</strong> ({role.name}).
            Esta acción no se puede deshacer.
            {role._count && role._count.users > 0 && (
              <span className="block mt-2 text-destructive">
                ⚠️ Este rol tiene {role._count.users} usuario(s) asignado(s).
                No se puede eliminar hasta que se reasignen.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || (role._count?.users ?? 0) > 0}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

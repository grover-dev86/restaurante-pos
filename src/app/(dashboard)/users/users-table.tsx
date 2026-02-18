'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Image from 'next/image'
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Eye, Plus, Power, User as UserIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { UserFormModal } from './user-form-modal'
import { DeleteUserDialog } from './delete-user-dialog'
import { checkPermission } from '@/lib/rbac'
import { useToast } from '@/hooks/use-toast'

interface Role {
  id: string
  name: string
  displayName: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  isActive: boolean
  roleId: string
  role: Role
  lastLoginAt: Date | null
  createdAt: Date
}

interface UsersTableProps {
  users: User[]
  roles: Role[]
  userRole: string
  currentUserId: string
}

export function UsersTable({
  users,
  roles,
  userRole,
  currentUserId,
}: UsersTableProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const canCreate = checkPermission(userRole, 'users', 'create')
  const canUpdate = checkPermission(userRole, 'users', 'update')
  const canDelete = checkPermission(userRole, 'users', 'delete')

  // Toggle activar/desactivar via API Route
  const handleToggleActive = (user: User) => {
    setTogglingUserId(user.id)

    fetch(`/api/users/${user.id}/toggle-active`, { method: 'PATCH' })
      .then((res) => res.json())
      .then((result: { success: boolean; message: string }) => {
        if (result.success) {
          toast({ title: 'Éxito', description: result.message })
        } else {
          toast({ title: 'Error', description: result.message, variant: 'destructive' })
        }
      })
      .catch(() => {
        toast({ title: 'Error', description: 'Error al cambiar estado', variant: 'destructive' })
      })
      .finally(() => {
        setTogglingUserId(null)
        startTransition(() => {
          router.refresh()
        })
      })
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
            {row.original.avatar ? (
              <Image
                src={row.original.avatar}
                alt={row.original.name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{row.original.name}</div>
            <div className="text-sm text-muted-foreground truncate">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => (
        <Badge variant="secondary" className="whitespace-nowrap">
          {row.original.role.displayName}
        </Badge>
      ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue || filterValue === 'all') return true
        return row.original.roleId === filterValue
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => {
        const isToggling = togglingUserId === row.original.id
        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={row.original.isActive ? 'default' : 'outline'}
              className={
                row.original.isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-red-500 border-red-300'
              }
            >
              {row.original.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
            {isToggling && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          </div>
        )
      },
      filterFn: (row, _, filterValue) => {
        if (!filterValue || filterValue === 'all') return true
        return filterValue === 'true' ? row.original.isActive : !row.original.isActive
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Creado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original
        const isSelf = user.id === currentUserId
        const isToggling = togglingUserId === user.id

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/users/${user.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalle
              </DropdownMenuItem>
              {canUpdate && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user)
                    setIsCreating(false)
                    setIsFormModalOpen(true)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {canUpdate && !isSelf && (
                <DropdownMenuItem
                  disabled={isToggling}
                  onSelect={(e) => {
                    e.preventDefault()
                    handleToggleActive(user)
                  }}
                >
                  {isToggling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="mr-2 h-4 w-4" />
                  )}
                  {user.isActive ? 'Desactivar' : 'Activar'}
                </DropdownMenuItem>
              )}
              {canDelete && !isSelf && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnFilters, globalFilter },
    globalFilterFn: (row, _, filterValue) => {
      const search = filterValue.toLowerCase()
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.email.toLowerCase().includes(search)
      )
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  return (
    <div className="space-y-4 px-4 sm:px-0">
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Input
            placeholder="Buscar por nombre o email..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          {canCreate && (
            <Button
              onClick={() => {
                setSelectedUser(null)
                setIsCreating(true)
                setIsFormModalOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo usuario
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          <Select
            value={(table.getColumn('role')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(v) => table.getColumn('role')?.setFilterValue(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={(table.getColumn('isActive')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(v) => table.getColumn('isActive')?.setFilterValue(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Activos</SelectItem>
              <SelectItem value="false">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden -mx-4 sm:mx-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[650px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} usuario(s) encontrado(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        user={isCreating ? null : selectedUser}
        roles={roles}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
      />
    </div>
  )
}

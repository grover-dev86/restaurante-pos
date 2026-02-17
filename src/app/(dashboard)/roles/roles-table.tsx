'use client'

import { useState } from 'react'
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
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Eye, Plus, Shield } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { RoleFormModal } from './role-form-modal'
import { RolePermissionsModal } from './role-permissions-modal'
import { DeleteRoleDialog } from './delete-role-dialog'
import { checkPermission } from '@/lib/rbac'

// Tipos
interface Permission {
  id: string
  resource: string
  action: string
  description: string
}

interface Role {
  id: string
  name: string
  displayName: string
  description: string | null
  permissions: Permission[]
  _count: {
    users: number
  }
  createdAt: Date
}

interface RolesTableProps {
  roles: Role[]
  allPermissions: Permission[]
  userRole: string
}

// Roles del sistema que no se pueden eliminar
const SYSTEM_ROLES = ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'USER']

export function RolesTable({ roles, allPermissions, userRole }: RolesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const canCreate = checkPermission(userRole, 'roles', 'create')
  const canUpdate = checkPermission(userRole, 'roles', 'update')
  const canDelete = checkPermission(userRole, 'roles', 'delete')

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'displayName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const isSystem = SYSTEM_ROLES.includes(row.original.name)
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{row.original.displayName}</div>
              <div className="text-sm text-muted-foreground font-mono">{row.original.name}</div>
            </div>
            {isSystem && (
              <Badge variant="outline" className="text-xs">
                Sistema
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.description || 'Sin descripción'}
        </span>
      ),
    },
    {
      accessorKey: 'permissions',
      header: 'Permisos',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.permissions.length} permisos
        </Badge>
      ),
    },
    {
      accessorKey: '_count.users',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Usuarios
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original._count.users} usuarios
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const role = row.original
        const isSystem = SYSTEM_ROLES.includes(role.name)

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
                onClick={() => {
                  setSelectedRole(role)
                  setIsPermissionsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver permisos
              </DropdownMenuItem>
              {canUpdate && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRole(role)
                    setIsCreating(false)
                    setIsFormModalOpen(true)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar rol
                </DropdownMenuItem>
              )}
              {canDelete && !isSystem && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedRole(role)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar rol
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
    data: roles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4 px-4 sm:px-0">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Input
          placeholder="Buscar roles..."
          value={(table.getColumn('displayName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('displayName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {canCreate && (
          <Button
            onClick={() => {
              setSelectedRole(null)
              setIsCreating(true)
              setIsFormModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo rol
          </Button>
        )}
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                  No se encontraron roles.
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
          {table.getFilteredRowModel().rows.length} rol(es) encontrado(s)
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
      <RoleFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        role={isCreating ? null : selectedRole}
        allPermissions={allPermissions}
      />

      <RolePermissionsModal
        open={isPermissionsModalOpen}
        onOpenChange={setIsPermissionsModalOpen}
        role={selectedRole}
        allPermissions={allPermissions}
      />

      <DeleteRoleDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        role={selectedRole}
      />
    </div>
  )
}

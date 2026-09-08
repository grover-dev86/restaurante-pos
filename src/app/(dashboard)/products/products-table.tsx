'use client'

import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, ChevronLeft, ChevronRight, Package, Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

// Shape del producto tal como lo devuelve getAllProducts()
export interface ProductRow {
  id: string
  name: string
  slug: string
  barcode: string | null
  description: string | null
  stock: number
  minStock: number
  isActive: boolean
  isArchived: boolean
  category: { id: string; name: string }
  _count: { saleItems: number; orderItems: number }
  createdAt: Date
  updatedAt: Date
}

interface ProductsTableProps {
  products: ProductRow[]
}

const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 hover:bg-transparent"
      >
        Nombre
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate">{row.original.name}</p>
        {row.original.barcode && (
          <p className="text-xs text-muted-foreground font-mono">{row.original.barcode}</p>
        )}
      </div>
    ),
  },
  {
    id: 'category',
    header: 'Categoría',
    accessorFn: (row) => row.category.name,
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.category.name}
      </Badge>
    ),
  },
  {
    id: 'price',
    header: 'Precio',
    cell: () => (
      // Placeholder — se conecta con ProductPrice en la subtarea 6
      <span className="text-sm text-muted-foreground italic">Sin precio</span>
    ),
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 hover:bg-transparent"
      >
        Stock
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      // El indicador visual de stock bajo se agrega en la subtarea 9
      <span className="tabular-nums">{row.original.stock}</span>
    ),
  },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const { isActive, isArchived } = row.original
      if (isArchived) {
        return <Badge variant="outline">Archivado</Badge>
      }
      return isActive ? (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
          Activo
        </Badge>
      ) : (
        <Badge variant="secondary">Inactivo</Badge>
      )
    },
  },
]

export function ProductsTable({ products }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Filtro por nombre o código de barras (case-insensitive)
  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()
    if (!term) return products
    return products.filter((p) => {
      if (p.name.toLowerCase().includes(term)) return true
      if (p.barcode && p.barcode.toLowerCase().includes(term)) return true
      return false
    })
  }, [products, debouncedSearch])

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  // Estado vacío completo (0 productos en total, sin filtro)
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <Package className="mx-auto mb-3 h-10 w-10 opacity-40" />
        <p className="font-medium">Aún no hay productos</p>
        <p className="text-sm">Crea el primero para empezar a poblar el catálogo</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar por nombre o código de barras…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Estado vacío filtrado (hay productos pero ninguno matchea) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Search className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="font-medium">
            No se encontraron resultados para “{debouncedSearch}”
          </p>
          <p className="text-sm">Prueba con otro término o limpia la búsqueda.</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-x-auto">
            <Table>
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
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between gap-2 px-2">
              <p className="text-sm text-muted-foreground">
                Mostrando{' '}
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                {' - '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  filteredProducts.length
                )}{' '}
                de {filteredProducts.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

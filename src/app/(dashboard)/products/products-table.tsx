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
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
  X,
  FilterX,
} from 'lucide-react'
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

export interface CategoryFilterOption {
  id: string
  name: string
  isActive: boolean
}

interface ProductsTableProps {
  products: ProductRow[]
  categories: CategoryFilterOption[]
}

// Sentinels para los <Select> de shadcn (que no admiten value="")
const ALL_CATEGORIES = '__all_categories__'
const ALL_STATUSES = '__all_statuses__'
type StatusFilter = 'active' | 'inactive' | 'archived'

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

export function ProductsTable({ products, categories }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Filtros adicionales
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES)
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES)
  const [lowStockOnly, setLowStockOnly] = useState(false)

  const hasActiveFilters =
    categoryFilter !== ALL_CATEGORIES || statusFilter !== ALL_STATUSES || lowStockOnly

  const clearFilters = () => {
    setCategoryFilter(ALL_CATEGORIES)
    setStatusFilter(ALL_STATUSES)
    setLowStockOnly(false)
  }

  // Filtrado combinado: búsqueda + categoría + estado + stock bajo
  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()

    return products.filter((p) => {
      // Búsqueda por nombre o barcode
      if (term) {
        const matchesName = p.name.toLowerCase().includes(term)
        const matchesBarcode = p.barcode?.toLowerCase().includes(term)
        if (!matchesName && !matchesBarcode) return false
      }

      // Categoría
      if (categoryFilter !== ALL_CATEGORIES && p.category.id !== categoryFilter) {
        return false
      }

      // Estado (activo / inactivo / archivado)
      if (statusFilter !== ALL_STATUSES) {
        const status: StatusFilter = p.isArchived
          ? 'archived'
          : p.isActive
            ? 'active'
            : 'inactive'
        if (status !== statusFilter) return false
      }

      // Solo stock bajo (stock < minStock)
      if (lowStockOnly && p.stock >= p.minStock) return false

      return true
    })
  }, [products, debouncedSearch, categoryFilter, statusFilter, lowStockOnly])

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
      {/* Barra de búsqueda + filtros */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        {/* Búsqueda */}
        <div className="relative flex-1 lg:max-w-sm">
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

        {/* Filtro por categoría */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-category" className="text-xs">
            Categoría
          </Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="filter-category" className="w-full lg:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                  {!c.isActive && ' (inactiva)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por estado */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-status" className="text-xs">
            Estado
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="filter-status" className="w-full lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Solo stock bajo */}
        <div className="flex items-center gap-2 lg:pb-2.5">
          <Checkbox
            id="filter-low-stock"
            checked={lowStockOnly}
            onCheckedChange={(v) => setLowStockOnly(v === true)}
          />
          <Label htmlFor="filter-low-stock" className="cursor-pointer text-sm font-normal">
            Solo stock bajo
          </Label>
        </div>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="self-start lg:self-end lg:mb-1"
          >
            <FilterX className="mr-1.5 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Estado vacío filtrado (hay productos pero ninguno matchea) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Search className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="font-medium">
            {debouncedSearch
              ? `No se encontraron resultados para “${debouncedSearch}”`
              : 'Ningún producto coincide con los filtros'}
          </p>
          <p className="text-sm">
            {debouncedSearch && hasActiveFilters
              ? 'Prueba con otro término o limpia los filtros.'
              : debouncedSearch
                ? 'Prueba con otro término o limpia la búsqueda.'
                : 'Ajusta los filtros o límpialos para ver todos los productos.'}
          </p>
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

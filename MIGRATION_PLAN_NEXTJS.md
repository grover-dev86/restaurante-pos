# Plan de Migración: Sistema POS Restaurante
## De Laravel a Next.js 14 Full-Stack

---

## 🚀 Nueva Arquitectura: Next.js 14

### Stack Tecnológico Completo

**Core:**
- ⚡ **Next.js 14** (App Router + Server Components)
- 🔷 **TypeScript** (type-safety total)
- 🗃️ **Prisma** (ORM + migraciones)
- 🔐 **NextAuth.js v5** (autenticación)
- 🎨 **Tailwind CSS** + **shadcn/ui** (componentes)

**Estado y Data:**
- 🐻 **Zustand** (state management)
- 🔄 **React Query / TanStack Query** (cache y fetching)
- 📡 **tRPC** (type-safe API)
- 🔌 **Socket.io** (real-time)

**Utilidades:**
- 📊 **Recharts** (gráficas)
- 📄 **React-PDF** (tickets/facturas)
- 🖼️ **UploadThing** (imágenes)
- ✅ **Zod** (validación de schemas)
- 📅 **date-fns** (fechas)

---

## 📁 Estructura del Proyecto

```
next-restaurant-pos/
├── app/                           # App Router (Next.js 14)
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Panel administrativo
│   │   ├── layout.tsx           # Layout con sidebar
│   │   ├── page.tsx             # Dashboard principal
│   │   ├── products/
│   │   ├── categories/
│   │   ├── sales/
│   │   ├── pos/                 # Sistema POS
│   │   ├── inventory/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── users/
│   ├── (public)/                # Sitio público del restaurante
│   │   ├── page.tsx            # Homepage
│   │   ├── menu/               # Menú público
│   │   └── order/              # Pedidos online
│   ├── api/                     # API Routes
│   │   ├── auth/[...nextauth]/
│   │   ├── trpc/[trpc]/
│   │   └── webhooks/
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── pos/
├── lib/
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # NextAuth config
│   ├── trpc/                    # tRPC setup
│   ├── utils.ts
│   └── validations/             # Zod schemas
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/
│   └── seed.ts
├── public/
├── store/                        # Zustand stores
├── types/
├── hooks/
└── middleware.ts                 # Auth middleware
```

---

## 📊 Migración de Base de Datos

### Estrategia: Migrar MySQL actual a Prisma

**Paso 1: Introspección**
```bash
# Prisma leerá tu base de datos actual y generará el schema
npx prisma db pull
```

**Paso 2: Schema Prisma** (ejemplo)
```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Multi-tenant
model Restaurant {
  id        Int      @id @default(autoincrement())
  name      String
  slug      String   @unique
  email     String?
  phone     String?
  address   String?
  logo      String?
  settings  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users      User[]
  categories Category[]
  products   Product[]
  sales      Sale[]
  tables     Table[]
}

model User {
  id           Int         @id @default(autoincrement())
  email        String      @unique
  name         String
  password     String
  role         Role        @default(USER)
  restaurantId Int
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id])
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  sales        Sale[]
}

enum Role {
  ADMIN
  MANAGER
  CASHIER
  WAITER
  USER
}

model Category {
  id           Int        @id @default(autoincrement())
  name         String
  image        String?
  restaurantId Int
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  products     Product[]
}

model Product {
  id           Int        @id @default(autoincrement())
  name         String
  description  String?    @db.Text
  price        Decimal    @db.Decimal(10, 2)
  cost         Decimal?   @db.Decimal(10, 2)
  stock        Int        @default(0)
  image        String?
  isActive     Boolean    @default(true)
  categoryId   Int
  category     Category   @relation(fields: [categoryId], references: [id])
  restaurantId Int
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  saleItems    SaleItem[]

  @@index([restaurantId])
  @@index([categoryId])
}

model Sale {
  id           Int        @id @default(autoincrement())
  total        Decimal    @db.Decimal(10, 2)
  subtotal     Decimal    @db.Decimal(10, 2)
  tax          Decimal?   @db.Decimal(10, 2)
  discount     Decimal?   @db.Decimal(10, 2)
  paymentMethod String
  status       SaleStatus @default(COMPLETED)
  tableId      Int?
  table        Table?     @relation(fields: [tableId], references: [id])
  userId       Int
  user         User       @relation(fields: [userId], references: [id])
  restaurantId Int
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  items        SaleItem[]

  @@index([restaurantId])
  @@index([createdAt])
}

enum SaleStatus {
  PENDING
  COMPLETED
  CANCELLED
}

model SaleItem {
  id        Int      @id @default(autoincrement())
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)
  subtotal  Decimal  @db.Decimal(10, 2)
  saleId    Int
  sale      Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  productId Int
  product   Product  @relation(fields: [productId], references: [id])

  @@index([saleId])
  @@index([productId])
}

model Table {
  id           Int        @id @default(autoincrement())
  number       String
  capacity     Int
  isAvailable  Boolean    @default(true)
  qrCode       String?    @unique
  restaurantId Int
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])

  sales        Sale[]

  @@unique([restaurantId, number])
}
```

---

## 🎯 Plan de Migración por Fases

### **FASE 1: Setup y Fundamentos (Semana 1-2)**

#### 1.1 Setup del Proyecto
```bash
# Crear proyecto Next.js con TypeScript
npx create-next-app@latest next-restaurant-pos --typescript --tailwind --app

cd next-restaurant-pos

# Instalar dependencias principales
npm install prisma @prisma/client
npm install next-auth@beta
npm install @tanstack/react-query
npm install zustand
npm install zod
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install recharts
npm install date-fns
npm install lucide-react # iconos

# Instalar shadcn/ui
npx shadcn-ui@latest init

# Dev dependencies
npm install -D prisma-client-js
```

**Tareas:**
- [x] Crear proyecto Next.js
- [ ] Configurar TypeScript estricto
- [ ] Setup Tailwind + shadcn/ui
- [ ] Configurar variables de entorno
- [ ] Instalar todas las dependencias

#### 1.2 Setup Prisma y Base de Datos
```bash
# Inicializar Prisma
npx prisma init

# Conectar a tu base de datos actual (introspección)
npx prisma db pull

# Generar cliente Prisma
npx prisma generate
```

**Tareas:**
- [ ] Conectar Prisma a MySQL actual
- [ ] Hacer introspección de tablas existentes
- [ ] Ajustar schema.prisma para multi-tenant
- [ ] Crear seed.ts con datos de prueba
- [ ] Migrar datos existentes

#### 1.3 Configurar NextAuth.js
**Archivo:** `lib/auth.ts`
```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { restaurant: true }
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          restaurantId: user.restaurantId,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
})
```

**Tareas:**
- [ ] Configurar NextAuth.js v5
- [ ] Implementar login con credentials
- [ ] Crear middleware de autenticación
- [ ] Proteger rutas del dashboard
- [ ] Implementar sistema de roles

---

### **FASE 2: Core Features (Semana 3-6)**

#### 2.1 Dashboard Principal
**Componentes:**
- [ ] Layout con sidebar responsive
- [ ] Navbar con info de usuario
- [ ] Cards de estadísticas
- [ ] Gráficas de ventas (Recharts)
- [ ] Tabla de últimas ventas
- [ ] Alertas de stock bajo

**Archivo:** `app/(dashboard)/page.tsx`
```typescript
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { RecentSales } from "@/components/dashboard/recent-sales"

export default async function DashboardPage() {
  const session = await auth()
  const restaurantId = session?.user.restaurantId

  // Server Component - fetch directo
  const stats = await prisma.$transaction([
    prisma.sale.count({ where: { restaurantId } }),
    prisma.sale.aggregate({
      where: { restaurantId, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      _sum: { total: true }
    }),
    prisma.product.count({ where: { restaurantId } }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <StatsCards data={stats} />
      <SalesChart restaurantId={restaurantId} />
      <RecentSales restaurantId={restaurantId} />
    </div>
  )
}
```

#### 2.2 Gestión de Productos
**Features:**
- [ ] Tabla con búsqueda y filtros
- [ ] Modal crear/editar producto
- [ ] Upload de imágenes (UploadThing)
- [ ] Validación con Zod
- [ ] Paginación server-side

**API Route:** `app/api/products/route.ts`
```typescript
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { productSchema } from "@/lib/validations/product"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 10

  const products = await prisma.product.findMany({
    where: { restaurantId: session.user.restaurantId },
    include: { category: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const validated = productSchema.parse(body)

  const product = await prisma.product.create({
    data: {
      ...validated,
      restaurantId: session.user.restaurantId,
    }
  })

  return NextResponse.json(product)
}
```

#### 2.3 Sistema POS (Punto de Venta)
**Features:**
- [ ] Interfaz de productos con grid
- [ ] Carrito de compra reactivo
- [ ] Cálculo automático de totales
- [ ] Selección de mesa
- [ ] Múltiples métodos de pago
- [ ] Generación de ticket PDF
- [ ] Impresión térmica

**Componente:** `app/(dashboard)/pos/page.tsx`
```typescript
"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ProductGrid } from "@/components/pos/product-grid"
import { Cart } from "@/components/pos/cart"
import { PaymentModal } from "@/components/pos/payment-modal"
import { useCart } from "@/store/cart"

export default function POSPage() {
  const { items, total, addItem, removeItem, clear } = useCart()
  const [showPayment, setShowPayment] = useState(false)

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then(r => r.json())
  })

  const createSale = useMutation({
    mutationFn: (data) => fetch("/api/sales", {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      clear()
      // Imprimir ticket
    }
  })

  return (
    <div className="grid grid-cols-12 gap-4 h-screen">
      <div className="col-span-8">
        <ProductGrid products={products} onSelect={addItem} />
      </div>
      <div className="col-span-4">
        <Cart
          items={items}
          total={total}
          onRemove={removeItem}
          onCheckout={() => setShowPayment(true)}
        />
      </div>

      {showPayment && (
        <PaymentModal
          total={total}
          onConfirm={createSale.mutate}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
```

**Store Zustand:** `store/cart.ts`
```typescript
import { create } from "zustand"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (product: any) => void
  removeItem: (id: number) => void
  clear: () => void
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    const items = get().items
    const existing = items.find(i => i.id === product.id)

    if (existing) {
      const updated = items.map(i =>
        i.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
      const total = updated.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      set({ items: updated, total })
    } else {
      const newItems = [...items, { ...product, quantity: 1 }]
      const total = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      set({ items: newItems, total })
    }
  },

  removeItem: (id) => {
    const items = get().items.filter(i => i.id !== id)
    const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    set({ items, total })
  },

  clear: () => set({ items: [], total: 0 })
}))
```

#### 2.4 Gestión de Categorías
**Features:**
- [ ] CRUD completo
- [ ] Drag & drop para ordenar
- [ ] Upload de imágenes
- [ ] Vista previa

---

### **FASE 3: Features Avanzadas (Semana 7-10)**

#### 3.1 Multi-Tenant (Multi-restaurante)
**Middleware:** `middleware.ts`
```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const session = await auth()

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Inyectar restaurantId en headers
  const headers = new Headers(request.headers)
  headers.set("x-restaurant-id", session.user.restaurantId.toString())

  return NextResponse.next({ headers })
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"]
}
```

**Features:**
- [ ] Panel de super admin
- [ ] Crear nuevos restaurantes
- [ ] Subdominios por restaurante (opcional)
- [ ] Aislamiento total de datos
- [ ] Facturación por restaurante

#### 3.2 Pedidos Online y Delivery
**Features:**
- [ ] Menú público con carrito
- [ ] Checkout con Stripe/PayPal
- [ ] Tracking de pedido en tiempo real
- [ ] Notificaciones push
- [ ] Integración con WhatsApp

#### 3.3 Sistema de Mesas y QR
**Features:**
- [ ] Generador de QR codes
- [ ] Página de pedido por QR
- [ ] Mapa visual de mesas
- [ ] Estado de mesas (ocupada/libre)
- [ ] Asignación automática

#### 3.4 Inventario Avanzado
**Features:**
- [ ] Control de stock en tiempo real
- [ ] Alertas automáticas
- [ ] Historial de movimientos
- [ ] Proveedores
- [ ] Órdenes de compra

---

### **FASE 4: Features Premium (Semana 11-14)**

#### 4.1 Reportes Avanzados
**Features:**
- [ ] Dashboard de analytics
- [ ] Reportes personalizables
- [ ] Exportar a PDF/Excel
- [ ] Comparativas períodos
- [ ] Predicciones con ML (opcional)

#### 4.2 Real-Time con Socket.io
**Setup:** `lib/socket.ts`
```typescript
import { Server } from "socket.io"

export function initSocket(httpServer) {
  const io = new Server(httpServer)

  io.on("connection", (socket) => {
    socket.on("join-restaurant", (restaurantId) => {
      socket.join(`restaurant-${restaurantId}`)
    })

    socket.on("new-order", (data) => {
      io.to(`restaurant-${data.restaurantId}`).emit("order-received", data)
    })
  })

  return io
}
```

**Features:**
- [ ] Notificaciones en tiempo real
- [ ] Actualización de pedidos
- [ ] Chat interno staff
- [ ] Dashboard live

#### 4.3 App Móvil (Opcional)
**Tech:** React Native + Expo
- [ ] App para meseros
- [ ] App para clientes
- [ ] Compartir código con web

---

## 🎨 Diseño UI/UX

### Tema y Colores
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          500: '#f97316', // Orange
          900: '#7c2d12',
        },
        // ... más colores
      }
    }
  }
}
```

### Componentes clave con shadcn/ui
- [ ] Button
- [ ] Card
- [ ] Table
- [ ] Form
- [ ] Dialog/Modal
- [ ] Select
- [ ] Input
- [ ] Tabs
- [ ] Alert
- [ ] Badge

---

## 📈 Cronograma

| Fase | Duración | Entregable |
|------|----------|------------|
| Fase 1: Setup | 2 semanas | Proyecto base + Auth |
| Fase 2: Core | 4 semanas | POS + CRUD completo |
| Fase 3: Avanzado | 4 semanas | Multi-tenant + Online orders |
| Fase 4: Premium | 4 semanas | Real-time + Analytics |
| **TOTAL** | **14 semanas** | **SaaS completo** |

---

## 🚀 Comandos Esenciales

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Prisma
npx prisma studio          # UI para ver DB
npx prisma generate        # Generar cliente
npx prisma db push         # Push schema sin migración
npx prisma migrate dev     # Crear migración
npx prisma db seed         # Sembrar datos

# Deploy a Vercel
vercel --prod
```

---

## 💰 Modelo de Negocio (igual que antes)

- **Básico:** $29/mes
- **Profesional:** $79/mes
- **Enterprise:** $199/mes

---

## 🎯 Ventajas de Next.js sobre Laravel

✅ **Todo en TypeScript** - Un solo lenguaje
✅ **Server Components** - Mejor performance
✅ **API Routes integradas** - No necesitas backend separado
✅ **Deploy fácil** - Vercel con 1 click
✅ **SEO optimizado** - Mejor para el sitio público
✅ **Real-time nativo** - Mejor con Socket.io
✅ **Comunidad activa** - React tiene más recursos
✅ **Más moderno** - Tecnología del futuro

---

## 🔥 Próximo Paso

¿Quieres que empiece a crear el proyecto Next.js ahora mismo?

Puedo:
1. **Crear el proyecto base** con toda la configuración
2. **Migrar el schema de Prisma** desde tu MySQL actual
3. **Implementar autenticación** completa
4. **Crear el primer módulo** (el que prefieras)

¿Por dónde empezamos? 🚀
# Especificación de Requisitos de Software (SRS)

## Sistema POS para Restaurante

### Stack Tecnológico JavaScript

---

## 1. INTRODUCCIÓN

### 1.1 Propósito

Este documento describe los requisitos funcionales y no funcionales del Sistema de Punto de Venta (POS) para Restaurante utilizando un **stack tecnológico completamente basado en JavaScript/TypeScript**. El sistema está diseñado para gestionar operaciones de ventas, inventario, clientes, pedidos online y administración de un restaurante.

### 1.2 Alcance

El sistema **POS para Restaurante** es una aplicación web moderna desarrollada con tecnologías JavaScript que permite:

- Gestión de ventas en punto de venta físico
- Control de inventario y productos en tiempo real
- Gestión de mesas y pedidos
- Pedidos online con pasarela de pago
- Reportes y análisis de ventas con gráficos interactivos
- Administración de usuarios con roles y permisos
- Sitio web público responsivo con menú digital
- Aplicación web progresiva (PWA) para uso offline

### 1.3 Definiciones, Acrónimos y Abreviaciones

- **POS**: Point of Sale (Punto de Venta)
- **SRS**: Software Requirements Specification
- **CRUD**: Create, Read, Update, Delete
- **API REST**: Interfaz de programación de aplicaciones con arquitectura REST
- **GraphQL**: Lenguaje de consulta para APIs
- **SSR**: Server-Side Rendering
- **SPA**: Single Page Application
- **PWA**: Progressive Web Application
- **ORM**: Object-Relational Mapping
- **JWT**: JSON Web Token
- **VAT**: Value Added Tax (Impuesto al Valor Agregado)
- **WebSocket**: Protocolo de comunicación bidireccional en tiempo real

### 1.4 Stack Tecnológico Propuesto

#### Frontend

- **Framework**: Next.js 14+ (React 18+)
- **Lenguaje**: TypeScript 5+
- **UI/Components**:
  - shadcn/ui (componentes)
  - Tailwind CSS (estilos)
  - Radix UI (primitivos accesibles)
- **Estado Global**: Zustand o Redux Toolkit
- **Formularios**: React Hook Form + Zod (validación)
- **Gráficos**: Recharts o Chart.js
- **Tablas**: TanStack Table (React Table v8)
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Gestión de fechas**: date-fns

#### Backend

- **Runtime**: Node.js 20+ LTS
- **Framework**:
  - **Opción 1**: Next.js 14+ API Routes (Full-stack)
  - **Opción 2**: Express.js + TypeScript (Backend separado)
  - **Opción 3**: NestJS (arquitectura enterprise)
- **ORM**: Prisma ORM
- **Base de datos**: PostgreSQL 15+ (principal) o MongoDB (alternativa)
- **Autenticación**: NextAuth.js (Auth.js) o Passport.js
- **Validación**: Zod
- **Logging**: Winston o Pino
- **Cron Jobs**: node-cron

#### Servicios Adicionales

- **Pagos**: Stripe SDK para Node.js
- **Email**: Resend o Nodemailer
- **Almacenamiento**:
  - AWS S3 o Cloudinary (imágenes)
  - Vercel Blob (alternativa)
- **WebSockets**: Socket.io (tiempo real)
- **Cache**: Redis (opcional)
- **Generación PDF**: Puppeteer o PDFKit
- **Procesamiento de imágenes**: Sharp

#### DevOps & Deployment

- **Hosting**: Vercel, Netlify, o Railway
- **Base de datos**: Supabase, Neon, o PlanetScale
- **CI/CD**: GitHub Actions
- **Monitoreo**: Sentry (errores)
- **Analytics**: Vercel Analytics o Google Analytics

---

## 2. DESCRIPCIÓN GENERAL

### 2.1 Perspectiva del Producto

El sistema es una **aplicación web moderna full-stack** que combina:

- Frontend responsivo con SSR/SSG para SEO optimizado
- Backend API REST con TypeScript
- Sistema POS optimizado para uso intensivo
- Dashboard administrativo con gráficos en tiempo real
- PWA para funcionalidad offline
- WebSockets para actualizaciones en tiempo real

### 2.2 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                    │
├─────────────────────────────────────────────────────────┤
│  Next.js Frontend (React + TypeScript)                  │
│  - Public Site (SSR/SSG)                                │
│  - Admin Dashboard (SPA)                                │
│  - POS Interface (Optimized)                            │
│  - PWA Service Worker                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              API Layer (Next.js API Routes)              │
│              o NestJS/Express Backend                    │
├─────────────────────────────────────────────────────────┤
│  - REST API Endpoints                                   │
│  - GraphQL (opcional)                                   │
│  - WebSocket Server (Socket.io)                         │
│  - Authentication Middleware (JWT)                      │
│  - Authorization (RBAC)                                 │
│  - Input Validation (Zod)                               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer (Prisma ORM)                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│  - Transactional data                                   │
│  - User management                                      │
│  - Sales & Inventory                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
├─────────────────────────────────────────────────────────┤
│  - Stripe (Payments)                                    │
│  - Cloudinary/S3 (Images)                               │
│  - Resend (Emails)                                      │
│  - Redis (Cache - opcional)                             │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Funciones del Producto

#### 1. Gestión de Ventas (POS)

- Interfaz optimizada para velocidad y usabilidad
- Registro de ventas en tiempo real con WebSocket
- Asignación de mesas con actualización automática
- Cálculo automático de impuestos y descuentos
- Generación de facturas/recibos en PDF
- Sistema de "hold orders" con persistencia local
- Búsqueda rápida de productos (debounced)
- Soporte para múltiples métodos de pago
- Modo offline con sincronización automática (PWA)
- Impresión térmica de tickets

#### 2. Gestión de Inventario

- Control de productos con imágenes optimizadas
- Categorías jerárquicas
- Tracking de inventario en tiempo real
- Recepciones de mercancía con validación
- Ajustes de stock con auditoría
- Alertas de stock bajo
- Historial completo de movimientos
- Exportación de datos a CSV/Excel

#### 3. Gestión Comercial

- Administración de clientes con historial de compras
- Administración de proveedores
- Registro de gastos por categoría
- Dashboard financiero
- Proyecciones y tendencias

#### 4. Reportes y Análisis

- Dashboard con métricas clave en tiempo real
- Ventas por período (día, semana, mes, año)
- Productos más vendidos (top 10, 20, 50)
- Ventas por empleado con comparativas
- Gráficos interactivos (líneas, barras, pastel)
- Exportación a PDF y Excel
- Registro de actividad del personal
- Análisis de rentabilidad por producto
- Reportes personalizables

#### 5. Pedidos Online

- Catálogo de productos con imágenes optimizadas
- Carrito de compras persistente
- Checkout optimizado
- Integración con Stripe Checkout
- Webhooks para confirmación de pago
- Notificaciones en tiempo real (WebSocket)
- Tracking de pedidos
- Sistema de cupones y descuentos

#### 6. Sitio Web Público

- Landing page optimizada (SEO)
- Menú digital con filtros y búsqueda
- Páginas institucionales (SSG)
- Formulario de contacto con validación
- Newsletter con double opt-in
- Blog (opcional)
- Multiidioma (i18n)
- Dark mode
- Accesibilidad WCAG 2.1 AA

#### 7. Administración de Sistema

- Gestión de usuarios con avatar
- Sistema de roles y permisos granular (RBAC)
- Configuración general del sistema
- Gestión de mesas con estados visuales
- CMS para contenido web
- Logs de auditoría
- Gestión de backups
- Configuración de impresoras
- Personalización de temas

### 2.4 Características de los Usuarios

| Tipo de Usuario   | Descripción             | Permisos                                           | Acceso                 |
| ----------------- | ----------------------- | -------------------------------------------------- | ---------------------- |
| **Super Admin**   | Acceso total al sistema | Todas las funcionalidades + configuración avanzada | Dashboard completo     |
| **Administrador** | Gestión operativa       | CRUD completo, reportes, configuración básica      | Dashboard + reportes   |
| **Cajero**        | Opera el POS            | Crear ventas, ver productos, gestionar pedidos     | Solo POS               |
| **Mesero**        | Toma pedidos            | Crear órdenes, asignar mesas, ver menú             | POS + mesas            |
| **Contador**      | Análisis financiero     | Solo lectura, reportes, exportación                | Reportes + dashboard   |
| **Cliente**       | Usuario web             | Ver menú, realizar pedidos, perfil                 | Sitio público + cuenta |

### 2.5 Restricciones

- Requiere navegadores modernos con soporte ES2022+
- JavaScript habilitado en el navegador
- Conexión a internet para funcionalidad completa
- Modo offline limitado (solo POS con sincronización posterior)
- Requiere HTTPS para PWA y pagos
- Límite de subida de imágenes: 5MB por archivo

### 2.6 Suposiciones y Dependencias

- Node.js 20+ instalado en servidor
- Base de datos PostgreSQL disponible
- Cuenta de Stripe para pagos
- Servicio de email (Resend/SMTP) configurado
- Almacenamiento de archivos (S3/Cloudinary)
- SSL/TLS configurado para producción

---

## 3. REQUISITOS ESPECÍFICOS

### 3.1 Requisitos Funcionales

#### RF-001: Autenticación y Autorización

**Prioridad**: Alta

**Descripción**: Sistema de autenticación seguro con JWT y manejo de sesiones

**Funcionalidades**:

- Login con email/contraseña
- Autenticación de dos factores (2FA) opcional
- OAuth social login (Google, Facebook) opcional
- Recuperación de contraseña por email
- Cambio de contraseña con validación
- Sesiones con expiración configurable
- Refresh tokens
- Logout con invalidación de token
- Rate limiting en endpoints de auth

**Validaciones**:

- Email válido y único
- Contraseña mínimo 8 caracteres con mayúsculas, minúsculas y números
- Captcha en intentos de login fallidos (3+)

**Salidas**:

- JWT token con información del usuario
- Redirección según rol

#### RF-002: Gestión de Roles y Permisos (RBAC)

**Prioridad**: Alta

**Descripción**: Sistema de control de acceso basado en roles

**Entidades**:

```typescript
interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: Permission[]
  users: User[]
  createdAt: Date
  updatedAt: Date
}

interface Permission {
  id: string
  resource: string // 'products', 'sales', 'users'
  action: string // 'create', 'read', 'update', 'delete'
  description: string
}
```

**Funcionalidades**:

- CRUD de roles
- Asignación de permisos a roles
- Asignación de roles a usuarios
- Verificación de permisos en middleware
- Permisos por recurso y acción

#### RF-003: Gestión de Productos

**Prioridad**: Alta

**Descripción**: Administración completa del catálogo de productos

**Schema Prisma**:

```prisma
model Product {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  barcode     String?   @unique
  description String?
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])

  prices      ProductPrice[]
  images      ProductImage[]

  stock       Int       @default(0)
  minStock    Int       @default(5)
  isActive    Boolean   @default(true)
  isArchived  Boolean   @default(false)

  saleItems   SaleItem[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}

model ProductPrice {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  title       String   // 'Pequeño', 'Mediano', 'Grande'
  price       Decimal  @db.Decimal(10, 2)
  isDefault   Boolean  @default(false)
}

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  url         String
  thumbnail   String
  order       Int      @default(0)
  isMain      Boolean  @default(false)
}
```

**Funcionalidades**:

- CRUD completo con validación TypeScript
- Búsqueda por nombre, código de barras, categoría
- Filtros avanzados (activo, stock bajo, categoría)
- Múltiples precios por producto
- Galería de imágenes con drag-and-drop
- Crop/resize automático de imágenes con Sharp
- Generación automática de thumbnails
- Slugs automáticos para SEO
- Soft delete para preservar historial
- Importación masiva desde CSV/Excel
- Exportación de catálogo
- Duplicación de productos
- Alertas de stock bajo

**API Endpoints**:

```typescript
GET    /api/products              // Listar con paginación
GET    /api/products/:id          // Obtener uno
POST   /api/products              // Crear
PUT    /api/products/:id          // Actualizar
DELETE /api/products/:id          // Eliminar
GET    /api/products/search       // Búsqueda
POST   /api/products/import       // Importar CSV
GET    /api/products/export       // Exportar
POST   /api/products/:id/archive  // Archivar
```

#### RF-004: Gestión de Categorías

**Prioridad**: Media

**Schema**:

```prisma
model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  image       String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)

  parentId    String?
  parent      Category? @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")

  products    Product[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Funcionalidades**:

- Categorías jerárquicas (árbol)
- Drag and drop para ordenar
- Imagen representativa
- SEO-friendly slugs
- Activar/desactivar

#### RF-005: Punto de Venta (POS)

**Prioridad**: Alta

**Descripción**: Interfaz optimizada para ventas rápidas

**Interfaz**:

- Layout dividido: Productos (izq) | Carrito (der)
- Grid de categorías con iconos
- Grid de productos con imágenes
- Búsqueda con autocompletado (debounce 300ms)
- Carrito con modificación de cantidades
- Calculadora visual para cantidades
- Selector de mesa
- Selector de cliente (búsqueda rápida)
- Panel de descuentos (% o monto fijo)
- Calculadora de IVA automática
- Selector de método de pago
- Calculadora de cambio
- Botones de acción rápida
- Atajos de teclado

**Schema**:

```prisma
model Sale {
  id              String      @id @default(cuid())
  invoiceNumber   String      @unique

  customerId      String?
  customer        Customer?   @relation(fields: [customerId], references: [id])

  cashierId       String
  cashier         User        @relation(fields: [cashierId], references: [id])

  tableId         String?
  table           Table?      @relation(fields: [tableId], references: [id])

  type            SaleType    // POS, ONLINE, DELIVERY
  status          SaleStatus  // PENDING, COMPLETED, CANCELLED

  items           SaleItem[]

  subtotal        Decimal     @db.Decimal(10, 2)
  discount        Decimal     @default(0) @db.Decimal(10, 2)
  discountType    String?     // 'PERCENTAGE', 'FIXED'
  tax             Decimal     @default(0) @db.Decimal(10, 2)
  taxRate         Decimal     @default(10) @db.Decimal(5, 2)
  deliveryCost    Decimal     @default(0) @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)

  paymentMethod   PaymentMethod
  amountReceived  Decimal?    @db.Decimal(10, 2)
  change          Decimal?    @db.Decimal(10, 2)

  notes           String?

  isHeld          Boolean     @default(false)
  heldAt          DateTime?

  completedAt     DateTime?
  cancelledAt     DateTime?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model SaleItem {
  id          String   @id @default(cuid())
  saleId      String
  sale        Sale     @relation(fields: [saleId], references: [id])

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  priceTitle  String   // 'Mediano'
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  subtotal    Decimal  @db.Decimal(10, 2)

  notes       String?
}

enum SaleType {
  POS
  ONLINE
  DELIVERY
  TAKEOUT
}

enum SaleStatus {
  PENDING
  COMPLETED
  CANCELLED
  REFUNDED
}

enum PaymentMethod {
  CASH
  CARD
  TRANSFER
  ONLINE
}
```

**Funcionalidades**:

- Agregar productos al carrito
- Modificar cantidades con +/-
- Eliminar items
- Aplicar descuentos
- Seleccionar tamaño/precio
- Agregar notas a items
- Guardar pedido en espera (hold)
- Recuperar pedidos en espera
- Calcular totales en tiempo real
- Validar stock disponible
- Completar venta con reducción de stock
- Generar factura en PDF
- Imprimir ticket térmico
- Enviar recibo por email
- Cancelar venta con restauración de stock
- Modo offline con queue de sincronización

**WebSocket Events**:

```typescript
// Cliente → Servidor
socket.emit('sale:create', saleData)
socket.emit('sale:hold', saleId)
socket.emit('sale:complete', saleId)

// Servidor → Clientes
socket.on('sale:created', (sale) => {})
socket.on('table:updated', (table) => {})
socket.on('inventory:updated', (product) => {})
```

#### RF-006: Gestión de Clientes

**Prioridad**: Media

**Schema**:

```prisma
model Customer {
  id            String    @id @default(cuid())
  name          String
  email         String?   @unique
  phone         String
  address       String?
  neighborhood  String?
  city          String?
  zipCode       String?

  birthDate     DateTime?

  sales         Sale[]

  totalPurchases Decimal  @default(0) @db.Decimal(10, 2)
  totalOrders    Int      @default(0)

  notes         String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Funcionalidades**:

- CRUD completo
- Búsqueda rápida por nombre/teléfono/email
- Historial de compras
- Total gastado
- Frecuencia de compra
- Productos favoritos
- Creación rápida desde POS
- Importación desde CSV
- Exportación de base de datos
- Segmentación (clientes VIP, frecuentes, etc.)

#### RF-007: Gestión de Proveedores

**Prioridad**: Media

**Schema**:

```prisma
model Supplier {
  id          String    @id @default(cuid())
  name        String
  email       String?
  phone       String
  address     String?
  website     String?

  contactName String?
  taxId       String?   // RFC/NIT

  receivings  Receiving[]

  notes       String?
  isActive    Boolean   @default(true)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### RF-008: Gestión de Mesas

**Prioridad**: Media

**Schema**:

```prisma
model Table {
  id          String      @id @default(cuid())
  number      String      @unique
  capacity    Int         @default(4)
  status      TableStatus @default(AVAILABLE)

  currentSaleId String?   @unique
  currentSale   Sale?     @relation(fields: [currentSaleId], references: [id])

  sales       Sale[]

  qrCode      String?     // Para pedidos desde mesa

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum TableStatus {
  AVAILABLE
  OCCUPIED
  RESERVED
  CLEANING
}
```

**Funcionalidades**:

- Vista de plano de mesas (grid)
- Estados visuales con colores
- Asignar/liberar mesa
- Transferir pedido entre mesas
- Unir mesas
- Reservar mesa
- QR code para pedidos
- Tiempo de ocupación

#### RF-009: Control de Inventario

**Prioridad**: Alta

**Schema**:

```prisma
model Receiving {
  id            String          @id @default(cuid())
  referenceNo   String          @unique

  supplierId    String
  supplier      Supplier        @relation(fields: [supplierId], references: [id])

  items         ReceivingItem[]

  subtotal      Decimal         @db.Decimal(10, 2)
  tax           Decimal         @default(0) @db.Decimal(10, 2)
  total         Decimal         @db.Decimal(10, 2)

  notes         String?

  receivedById  String
  receivedBy    User            @relation(fields: [receivedById], references: [id])

  receivedAt    DateTime        @default(now())
  createdAt     DateTime        @default(now())
}

model ReceivingItem {
  id          String    @id @default(cuid())
  receivingId String
  receiving   Receiving @relation(fields: [receivingId], references: [id])

  productId   String
  product     Product   @relation(fields: [productId], references: [id])

  quantity    Int
  cost        Decimal   @db.Decimal(10, 2)
  subtotal    Decimal   @db.Decimal(10, 2)
}

model Adjustment {
  id          String           @id @default(cuid())
  referenceNo String           @unique
  type        AdjustmentType
  reason      String

  items       AdjustmentItem[]

  adjustedById String
  adjustedBy   User            @relation(fields: [adjustedById], references: [id])

  notes       String?

  createdAt   DateTime         @default(now())
}

model AdjustmentItem {
  id           String     @id @default(cuid())
  adjustmentId String
  adjustment   Adjustment @relation(fields: [adjustmentId], references: [id])

  productId    String
  product      Product    @relation(fields: [productId], references: [id])

  quantity     Int
  type         String     // 'ADD', 'SUBTRACT'
  reason       String?
}

enum AdjustmentType {
  DAMAGE
  LOSS
  FOUND
  RETURN
  CORRECTION
}

model InventoryLog {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  type        String   // SALE, RECEIVING, ADJUSTMENT
  referenceId String

  quantityBefore Int
  quantity       Int    // + o -
  quantityAfter  Int

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  notes       String?

  createdAt   DateTime @default(now())
}
```

**Funcionalidades**:

- Recepciones de mercancía
- Ajustes de inventario con justificación
- Log completo de movimientos
- Alertas de stock bajo (email/notificación)
- Proyección de necesidades
- Costo promedio ponderado
- Valor del inventario
- Auditoría de inventario

#### RF-010: Gestión de Gastos

**Prioridad**: Media

**Schema**:

```prisma
model Expense {
  id          String        @id @default(cuid())
  description String
  amount      Decimal       @db.Decimal(10, 2)
  category    ExpenseCategory

  date        DateTime

  receipt     String?       // URL de imagen

  createdById String
  createdBy   User          @relation(fields: [createdById], references: [id])

  notes       String?

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum ExpenseCategory {
  RENT
  UTILITIES
  SUPPLIES
  PAYROLL
  MAINTENANCE
  MARKETING
  OTHER
}
```

**Funcionalidades**:

- CRUD de gastos
- Categorización
- Subir comprobantes/facturas
- Filtros por fecha y categoría
- Reportes de gastos
- Exportación

#### RF-011: Sistema de Reportes y Dashboard

**Prioridad**: Alta

**Descripción**: Dashboard interactivo con métricas en tiempo real

**Componentes del Dashboard**:

1. **KPIs Principales**:
   - Ventas hoy (comparado con ayer)
   - Ventas semana (comparado con semana anterior)
   - Ventas mes (comparado con mes anterior)
   - Total de pedidos
   - Ticket promedio
   - Productos vendidos

2. **Gráficos**:
   - Ventas por día (últimos 30 días) - Línea
   - Ventas por mes (último año) - Barras
   - Productos más vendidos - Barras horizontales
   - Ventas por categoría - Dona/Pastel
   - Ventas por método de pago - Pastel
   - Ventas por hora del día - Línea
   - Ventas POS vs Online - Área apilada

3. **Tablas**:
   - Últimas ventas
   - Productos con stock bajo
   - Mejores clientes
   - Mejores vendedores

**Reportes Disponibles**:

```typescript
interface Report {
  // Ventas
  salesByPeriod(start: Date, end: Date): SalesReport
  salesByProduct(start: Date, end: Date): ProductSalesReport[]
  salesByCategory(start: Date, end: Date): CategorySalesReport[]
  salesByEmployee(start: Date, end: Date): EmployeeSalesReport[]
  salesByHour(date: Date): HourlyReport[]
  salesByPaymentMethod(start: Date, end: Date): PaymentMethodReport[]

  // Inventario
  stockReport(): StockReport[]
  lowStockReport(): LowStockReport[]
  inventoryValue(): InventoryValueReport
  inventoryMovements(start: Date, end: Date): MovementReport[]

  // Financiero
  profitLoss(start: Date, end: Date): ProfitLossReport
  expensesByCategory(start: Date, end: Date): ExpenseReport[]
  cashFlow(start: Date, end: Date): CashFlowReport

  // Clientes
  customerReport(): CustomerReport[]
  customerLifetimeValue(): CLVReport[]

  // Empleados
  employeeActivity(userId: string, date: Date): ActivityLog[]
  employeePerformance(start: Date, end: Date): PerformanceReport[]
}
```

**Funcionalidades**:

- Actualización en tiempo real con WebSocket
- Filtros por fecha personalizados
- Comparación de períodos
- Exportación a PDF/Excel
- Programación de reportes automáticos por email
- Reportes personalizables
- Gráficos interactivos con zoom
- Drill-down en datos

**Tecnologías**:

- Recharts para gráficos
- TanStack Table para tablas
- date-fns para manejo de fechas
- Puppeteer para PDFs
- ExcelJS para exportar Excel

#### RF-012: Pedidos Online

**Prioridad**: Alta

**Descripción**: E-commerce integrado para pedidos online

**Flow del Usuario**:

1. Browse menú por categorías
2. Ver detalle de producto
3. Agregar al carrito
4. Ver carrito
5. Checkout (guest o registrado)
6. Ingresar datos de entrega
7. Aplicar cupón (opcional)
8. Seleccionar método de pago
9. Pagar con Stripe
10. Confirmación y tracking

**Schema**:

```prisma
model OnlineOrder {
  id              String       @id @default(cuid())
  orderNumber     String       @unique

  customerId      String?
  customer        Customer?    @relation(fields: [customerId], references: [id])

  // Datos de entrega
  customerName    String
  customerEmail   String
  customerPhone   String
  deliveryAddress String
  deliveryNotes   String?

  items           OrderItem[]

  subtotal        Decimal      @db.Decimal(10, 2)
  discount        Decimal      @default(0) @db.Decimal(10, 2)
  deliveryCost    Decimal      @db.Decimal(10, 2)
  tax             Decimal      @db.Decimal(10, 2)
  total           Decimal      @db.Decimal(10, 2)

  couponCode      String?

  status          OrderStatus  @default(PENDING)
  paymentStatus   PaymentStatus
  paymentMethod   String
  paymentIntentId String?      // Stripe

  estimatedDelivery DateTime?
  deliveredAt       DateTime?

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

model OrderItem {
  id          String      @id @default(cuid())
  orderId     String
  order       OnlineOrder @relation(fields: [orderId], references: [id])

  productId   String
  product     Product     @relation(fields: [productId], references: [id])

  priceTitle  String
  quantity    Int
  unitPrice   Decimal     @db.Decimal(10, 2)
  subtotal    Decimal     @db.Decimal(10, 2)

  notes       String?
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model Coupon {
  id          String      @id @default(cuid())
  code        String      @unique
  type        CouponType
  value       Decimal     @db.Decimal(10, 2)

  minPurchase Decimal?    @db.Decimal(10, 2)
  maxDiscount Decimal?    @db.Decimal(10, 2)

  usageLimit  Int?
  usageCount  Int         @default(0)

  validFrom   DateTime
  validUntil  DateTime

  isActive    Boolean     @default(true)

  createdAt   DateTime    @default(now())
}

enum CouponType {
  PERCENTAGE
  FIXED
  FREE_DELIVERY
}
```

**Funcionalidades**:

- Catálogo público con SSG/ISR
- Carrito persistente (localStorage + DB si auth)
- Checkout de invitado o con cuenta
- Integración con Stripe Checkout
- Webhooks de Stripe para confirmación
- Estados de pedido con timeline visual
- Notificaciones push al cliente
- Panel de gestión de pedidos
- Actualización de estado
- Sistema de cupones
- Cálculo de zona de entrega
- Estimación de tiempo de entrega
- Envío de confirmación por email
- Tracking page para cliente

**API Endpoints**:

```typescript
GET    /api/online/products       // Catálogo público
GET    /api/online/products/:id   // Detalle
POST   /api/online/cart           // Agregar al carrito
GET    /api/online/cart           // Ver carrito
POST   /api/online/checkout       // Iniciar checkout
POST   /api/online/payment        // Crear payment intent
POST   /api/webhooks/stripe       // Webhook de Stripe
GET    /api/online/orders/:id     // Tracking
```

#### RF-013: Sitio Web Público

**Prioridad**: Media

**Descripción**: Frontend público optimizado para SEO y conversión

**Páginas**:

- **Home** (SSG):
  - Hero section con CTA
  - Productos destacados
  - Categorías populares
  - Testimonios
  - Newsletter signup

- **Menú** (SSG/ISR):
  - Lista de categorías
  - Grid de productos con filtros
  - Búsqueda
  - Quick view

- **Producto** (SSG/ISR):
  - Galería de imágenes
  - Descripción completa
  - Selector de variantes
  - Add to cart
  - Productos relacionados

- **Acerca de** (SSG)
- **FAQ** (SSG)
- **Términos y Condiciones** (SSG)
- **Política de Privacidad** (SSG)
- **Contacto** (SSR)
- **Blog** (SSG/ISR) - opcional

**Funcionalidades**:

- SEO optimizado (meta tags, Open Graph, JSON-LD)
- Sitemap XML automático
- robots.txt
- PWA con service worker
- Lazy loading de imágenes
- Image optimization automático (Next.js Image)
- Dark mode
- Multiidioma (i18n)
- Formulario de contacto con validación
- Newsletter con confirmación
- Google Analytics
- Cookie consent
- Accesibilidad WCAG 2.1 AA

**CMS para Administrador**:

- Editor WYSIWYG para páginas
- Gestión de sliders/banners
- Gestión de menú de navegación
- Configuración de SEO por página
- Media library

#### RF-014: Gestión de Usuarios

**Prioridad**: Alta

**Schema**:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String    // Hashed con bcrypt

  avatar        String?
  phone         String?

  roleId        String
  role          Role      @relation(fields: [roleId], references: [id])

  isActive      Boolean   @default(true)
  emailVerified DateTime?

  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String?

  lastLoginAt   DateTime?
  lastLoginIp   String?

  sales         Sale[]
  activities    Activity[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Activity {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  action      String   // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  resource    String   // 'Product', 'Sale', 'User'
  resourceId  String?

  description String

  ipAddress   String?
  userAgent   String?

  metadata    Json?    // Datos adicionales

  createdAt   DateTime @default(now())
}
```

**Funcionalidades**:

- CRUD de usuarios
- Asignación de roles
- Subir avatar con crop
- Cambio de contraseña
- Reseteo de contraseña por admin
- Activar/desactivar usuario
- Ver historial de actividad
- Últimas sesiones
- 2FA opcional
- Importación de usuarios
- Exportación de lista

#### RF-015: Configuración del Sistema

**Prioridad**: Media

**Schema**:

```prisma
model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value Json

  updatedAt DateTime @updatedAt
}
```

**Configuraciones**:

```typescript
interface SystemSettings {
  // General
  siteName: string
  siteUrl: string
  logo: string
  favicon: string
  timezone: string
  dateFormat: string
  currency: string

  // Empresa
  businessName: string
  taxId: string
  address: string
  phone: string
  email: string

  // POS
  taxRate: number
  defaultPaymentMethod: PaymentMethod
  autoprint: boolean
  printerName: string
  receiptFooter: string

  // Inventario
  lowStockThreshold: number
  enableStockAlerts: boolean

  // Email
  emailProvider: 'resend' | 'smtp'
  emailFrom: string
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string

  // Pagos
  stripePublicKey: string
  stripeSecretKey: string
  stripeWebhookSecret: string

  // Delivery
  enableDelivery: boolean
  deliveryCost: number
  freeDeliveryThreshold: number

  // Notificaciones
  enableEmailNotifications: boolean
  enablePushNotifications: boolean

  // Reportes
  reportEmailRecipients: string[]
  dailyReportTime: string
  weeklyReportDay: number
}
```

**Funcionalidades**:

- Interfaz de configuración por secciones
- Validación de configuraciones críticas
- Test de conexión SMTP
- Test de API de Stripe
- Backup de configuración
- Historial de cambios

#### RF-016: API REST

**Prioridad**: Media

**Descripción**: API RESTful completa con TypeScript

**Arquitectura**:

```
/api
  /auth
    POST   /login
    POST   /logout
    POST   /register
    POST   /refresh
    POST   /forgot-password
    POST   /reset-password

  /users
    GET    /
    GET    /:id
    POST   /
    PUT    /:id
    DELETE /:id

  /roles
    GET    /
    POST   /
    PUT    /:id
    DELETE /:id

  /products
    GET    /
    GET    /:id
    POST   /
    PUT    /:id
    DELETE /:id
    GET    /search
    POST   /import
    GET    /export

  /categories
    GET    /
    POST   /
    PUT    /:id
    DELETE /:id

  /sales
    GET    /
    GET    /:id
    POST   /
    PUT    /:id
    DELETE /:id
    POST   /:id/hold
    POST   /:id/complete
    POST   /:id/cancel

  /customers
    GET    /
    GET    /:id
    POST   /
    PUT    /:id
    DELETE /:id
    GET    /search

  /suppliers
    [CRUD similar]

  /tables
    GET    /
    POST   /
    PUT    /:id
    DELETE /:id
    POST   /:id/assign
    POST   /:id/free

  /inventory
    /receivings
      [CRUD]
    /adjustments
      [CRUD]
    /logs
      GET /

  /expenses
    [CRUD]

  /reports
    GET /dashboard
    GET /sales
    GET /products
    GET /employees
    GET /inventory
    GET /financial

  /online
    GET    /products
    POST   /cart
    GET    /cart
    POST   /checkout
    GET    /orders/:id

  /settings
    GET    /
    PUT    /

  /webhooks
    POST /stripe
```

**Características de la API**:

- Autenticación JWT
- Rate limiting por endpoint
- Paginación estándar
- Filtros y búsqueda
- Ordenamiento
- Validación con Zod
- Manejo de errores consistente
- CORS configurado
- Logging de requests
- Swagger/OpenAPI docs
- Versionado (/api/v1)

**Response Format**:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page: number
    pageSize: number
    totalPages: number
    totalCount: number
  }
}
```

#### RF-017: Notificaciones

**Prioridad**: Media

**Tipos de Notificaciones**:

1. **Email**:
   - Confirmación de pedido online
   - Cambio de estado de pedido
   - Reseteo de contraseña
   - Alerta de stock bajo
   - Reportes programados
   - Newsletter

2. **Push Notifications** (PWA):
   - Nuevo pedido online
   - Estado de pedido actualizado
   - Mesa lista
   - Alerta de stock crítico

3. **In-App**:
   - Notificaciones en tiempo real en dashboard
   - Toast notifications
   - Badge count

**Schema**:

```prisma
model Notification {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  type        NotificationType
  title       String
  message     String

  link        String?

  isRead      Boolean  @default(false)
  readAt      DateTime?

  createdAt   DateTime @default(now())
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
}
```

**Funcionalidades**:

- Centro de notificaciones
- Marcar como leída
- Marcar todas como leídas
- Configuración de preferencias
- Subscripción push con service worker

#### RF-018: PWA (Progressive Web App)

**Prioridad**: Media

**Descripción**: Funcionalidad offline y app-like experience

**Características**:

- Service Worker para cache
- Manifiesto web
- Instalable en dispositivos
- Splash screen
- Iconos adaptativos
- Modo offline:
  - Cache de productos
  - Cache de categorías
  - Queue de ventas pendientes
  - Sincronización automática al reconectar
- Push notifications
- Background sync
- Actualización automática

**Estrategia de Cache**:

```typescript
// Network First: API calls
// Cache First: Assets estáticos
// Stale While Revalidate: Imágenes
```

### 3.2 Requisitos No Funcionales

#### RNF-001: Rendimiento

**Prioridad**: Alta

**Métricas**:

- **TTFB** (Time to First Byte): < 600ms
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms

**Optimizaciones**:

- Server-Side Rendering (SSR) para páginas dinámicas
- Static Site Generation (SSG) para contenido estático
- Incremental Static Regeneration (ISR)
- Code splitting automático (Next.js)
- Tree shaking
- Image optimization con Sharp
- Lazy loading de componentes
- Database query optimization con Prisma
- Database indexing
- Redis cache para datos frecuentes (opcional)
- CDN para assets estáticos
- Gzip/Brotli compression
- HTTP/2 o HTTP/3

**Capacidad**:

- Soportar 100+ usuarios concurrent
- 1000+ transacciones por día
- Base de datos escalable (PostgreSQL)
- Horizontal scaling con load balancer

#### RNF-002: Seguridad

**Prioridad**: Alta

**Autenticación**:

- JWT con refresh tokens
- Tokens con expiración (15min access, 7d refresh)
- Bcrypt para hash de passwords (salt rounds: 12)
- Rate limiting:
  - Login: 5 intentos / 15 min
  - API general: 100 req / min
  - API sensible: 10 req / min
- CORS configurado por dominio
- 2FA opcional (TOTP)

**Autorización**:

- RBAC (Role-Based Access Control)
- Middleware de verificación en cada route
- Validación de permisos por recurso y acción
- Token verification en cada request

**Protección**:

- HTTPS obligatorio en producción
- Helmet.js para headers de seguridad
- CSRF protection
- XSS protection (sanitización de inputs)
- SQL Injection protection (Prisma ORM)
- Input validation con Zod
- Output encoding
- Secrets en variables de entorno
- No exponer stack traces en producción
- Logs de auditoría
- Encriptación de datos sensibles en DB

**Compliance**:

- GDPR ready (consentimiento, derecho al olvido)
- PCI DSS compatible (Stripe)
- Política de privacidad
- Términos de servicio

#### RNF-003: Usabilidad

**Prioridad**: Alta

**UX**:

- Diseño responsive (mobile-first)
- Interfaz intuitiva y consistente
- Navegación clara
- Feedback visual inmediato
- Loading states
- Error messages descriptivos
- Confirmación en acciones destructivas
- Atajos de teclado en POS
- Tooltips informativos
- Onboarding para nuevos usuarios

**Accesibilidad**:

- WCAG 2.1 Level AA
- Navegación por teclado
- Screen reader friendly
- Alto contraste
- Focus visible
- Labels en inputs
- ARIA attributes
- Textos alternativos en imágenes

**Performance percibido**:

- Skeleton loaders
- Optimistic updates
- Animaciones smooth (60fps)
- Debounce en búsquedas

#### RNF-004: Mantenibilidad

**Prioridad**: Alta

**Código**:

- TypeScript strict mode
- ESLint + Prettier
- Arquitectura modular
- Componentes reutilizables
- Clean code principles
- SOLID principles
- DRY (Don't Repeat Yourself)
- Comentarios en lógica compleja
- Naming conventions consistentes
- Git flow (feature branches)

**Testing**:

- Unit tests (Jest + Testing Library): >80% coverage
- Integration tests (Playwright)
- E2E tests (Cypress/Playwright)
- API tests (Supertest)
- Visual regression tests (Percy/Chromatic)

**Documentación**:

- README completo
- API documentation (Swagger)
- Component documentation (Storybook)
- Architecture diagrams
- Setup instructions
- Deployment guide
- Troubleshooting guide

**Monitoreo**:

- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Database monitoring
- Logs centralizados
- Alertas automáticas

#### RNF-005: Disponibilidad

**Prioridad**: Alta

**Uptime**: 99.5% (objetivo)

**Estrategias**:

- Health check endpoint
- Auto-restart en crashes
- Database connection pooling
- Graceful shutdown
- Database backups automáticos:
  - Diarios: últimos 7 días
  - Semanales: último mes
  - Mensuales: último año
- Backup recovery testing
- Disaster recovery plan
- Redundancia de base de datos (replica)

#### RNF-006: Escalabilidad

**Prioridad**: Media

**Horizontal Scaling**:

- Stateless backend (JWT)
- Shared session store (Redis)
- CDN para assets
- Database read replicas
- Load balancer ready

**Vertical Scaling**:

- Database optimization
- Query optimization
- Indexing strategy
- Connection pooling
- Lazy loading de datos

**Crecimiento**:

- Diseño preparado para multi-tenant (futuro)
- Microservicios ready (separación de concerns)
- Message queue para tareas pesadas (opcional)

#### RNF-007: Compatibilidad

**Prioridad**: Media

**Navegadores**:

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- No IE11 ❌

**Dispositivos**:

- Desktop (1920x1080, 1366x768)
- Tablet (iPad, Android tablets)
- Mobile (375x667+, responsive)

**Plataformas**:

- Windows 10+
- macOS 11+
- Linux (Ubuntu, Debian)
- iOS 14+
- Android 10+

**Requisitos Mínimos del Servidor**:

- Node.js 20+ LTS
- PostgreSQL 15+
- 2GB RAM (mínimo)
- 4GB RAM (recomendado)
- 10GB espacio en disco
- CPU 2 cores (mínimo)

#### RNF-008: Integridad de Datos

**Prioridad**: Alta

**Base de Datos**:

- Transacciones ACID
- Foreign keys con ON DELETE CASCADE/RESTRICT
- Unique constraints
- Not null constraints
- Check constraints
- Default values
- Indexes para performance

**Validación**:

- Validación en frontend (UX)
- Validación en backend (seguridad)
- Schema validation con Zod
- Type safety con TypeScript
- Database-level constraints

**Auditoría**:

- Soft deletes donde aplique
- Timestamps (createdAt, updatedAt)
- Activity logs
- Change tracking para datos críticos
- Backup antes de operaciones masivas

#### RNF-009: Internacionalización (i18n)

**Prioridad**: Baja

**Idiomas soportados**:

- Español (default)
- Inglés

**Implementación**:

- next-i18next
- Archivos JSON de traducciones
- Detección automática de idioma
- Selector de idioma
- Formateo de fechas por locale
- Formateo de moneda por locale
- RTL ready (futuro)

#### RNF-010: Observabilidad

**Prioridad**: Media

**Logs**:

- Structured logging (JSON)
- Log levels (error, warn, info, debug)
- Request/response logging
- Error stack traces
- User context en logs
- Correlatio ID por request

**Métricas**:

- Response times
- Error rates
- Database query times
- API usage
- User engagement
- Business metrics (ventas, productos, etc.)

**Alertas**:

- Error rate > threshold
- Response time > threshold
- Disk space < 10%
- Memory usage > 80%
- Failed backups
- Stock crítico

---

## 4. MODELO DE DATOS

### 4.1 Diagrama ER (Simplificado)

```
User ──────┐
│          │
├──< Role ──< Permission
│
├──> Sale ──> SaleItem ──> Product ──> Category
│     │                      │
│     └──> Customer          └──> ProductPrice
│     └──> Table             └──> ProductImage
│
├──> OnlineOrder ──> OrderItem ──> Product
│
├──> Receiving ──> ReceivingItem ──> Product
│     └──> Supplier
│
├──> Adjustment ──> AdjustmentItem ──> Product
│
├──> Expense
│
├──> Activity
│
└──> Notification
```

### 4.2 Schema Completo (Prisma)

Ver secciones individuales de requisitos funcionales para schemas detallados.

### 4.3 Indexes Recomendados

```prisma
// User
@@index([email])
@@index([roleId])

// Product
@@index([categoryId])
@@index([name])
@@index([barcode])
@@index([isActive, isArchived])

// Sale
@@index([cashierId])
@@index([customerId])
@@index([status])
@@index([createdAt])
@@index([type])

// SaleItem
@@index([saleId])
@@index([productId])

// Customer
@@index([email])
@@index([phone])

// InventoryLog
@@index([productId, createdAt])

// Activity
@@index([userId, createdAt])
```

---

## 5. ARQUITECTURA DEL SISTEMA

### 5.1 Arquitectura de Frontend (Next.js)

```
src/
├── app/                      # App Router (Next.js 14+)
│   ├── (auth)/               # Auth group
│   │   ├── login/
│   │   └── register/
│   ├── (public)/             # Public site
│   │   ├── page.tsx          # Home
│   │   ├── menu/
│   │   ├── about/
│   │   └── contact/
│   ├── (dashboard)/          # Admin dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Dashboard home
│   │   ├── products/
│   │   ├── sales/
│   │   ├── customers/
│   │   ├── reports/
│   │   └── settings/
│   ├── api/                  # API routes
│   │   ├── auth/
│   │   ├── products/
│   │   ├── sales/
│   │   └── webhooks/
│   └── pos/                  # POS interface
│       └── page.tsx
│
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── layout/
│   ├── forms/
│   ├── tables/
│   └── charts/
│
├── lib/                      # Utilities
│   ├── prisma.ts             # Prisma client
│   ├── auth.ts               # Auth config
│   ├── utils.ts              # Helper functions
│   └── validations/          # Zod schemas
│
├── hooks/                    # Custom hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useDebounce.ts
│
├── store/                    # Global state
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── posStore.ts
│
├── types/                    # TypeScript types
│   └── index.ts
│
├── styles/
│   └── globals.css
│
└── middleware.ts             # Next.js middleware
```

### 5.2 Arquitectura de Backend (API)

**Opción 1: Next.js API Routes** (Recomendado para full-stack)

```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── refresh/route.ts
├── products/
│   ├── route.ts              # GET /api/products, POST /api/products
│   └── [id]/route.ts         # GET/PUT/DELETE /api/products/:id
└── sales/
    ├── route.ts
    └── [id]/
        ├── route.ts
        └── complete/route.ts
```

**Opción 2: Backend Separado (NestJS)**

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── strategies/
│   ├── users/
│   ├── products/
│   └── sales/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── prisma/
└── main.ts
```

### 5.3 Flujo de Datos

**Autenticación**:

```
Cliente → POST /api/auth/login → Validate → JWT → Response
      ← {accessToken, refreshToken, user}

Cliente → Request + Authorization Header → Middleware verify JWT → Route Handler
```

**Operación CRUD**:

```
Cliente → GET /api/products?page=1&search=pizza
       → Middleware: Auth + Permissions
       → Handler: Validate query (Zod)
       → Service: Prisma query
       → Database: PostgreSQL
       ← Response: {success, data, meta}
```

**Venta en POS**:

```
1. Cliente agrega productos al carrito (estado local)
2. POST /api/sales/hold (opcional)
3. POST /api/sales/complete
   → Validar stock
   → Crear transacción DB
     → Crear sale
     → Crear sale_items
     → Actualizar stock (reducir)
     → Crear inventory_logs
   → Commit transaction
   → Emitir WebSocket 'sale:created'
   → Generar PDF
4. Response: {sale, receiptUrl}
```

### 5.4 Integración con Servicios Externos

**Stripe**:

```typescript
// Crear Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: total * 100,
  currency: 'usd',
  metadata: { orderId }
})

// Webhook handler
POST /api/webhooks/stripe
→ Verificar signature
→ Switch event.type
  case 'payment_intent.succeeded':
    → Actualizar orden a PAID
    → Enviar confirmación
```

**Cloudinary** (Imágenes):

```typescript
// Upload
const result = await cloudinary.uploader.upload(file, {
  folder: 'products',
  transformation: [{ width: 800, height: 800, crop: 'fill' }, { quality: 'auto' }],
})
```

**Resend** (Email):

```typescript
await resend.emails.send({
  from: 'no-reply@restaurante.com',
  to: customer.email,
  subject: 'Confirmación de Pedido',
  react: OrderConfirmationEmail({ order }),
})
```

### 5.5 WebSocket (Socket.io)

**Server**:

```typescript
// server/socket.ts
io.on('connection', (socket) => {
  // Join room por restaurante
  socket.join(`restaurant_${restaurantId}`)

  socket.on('sale:create', async (data) => {
    const sale = await createSale(data)
    io.to(`restaurant_${restaurantId}`).emit('sale:created', sale)
  })
})
```

**Client**:

```typescript
// hooks/useSocket.ts
const socket = io()

socket.on('sale:created', (sale) => {
  // Update UI
  queryClient.invalidateQueries(['sales'])
  toast.success('Nueva venta registrada')
})
```

---

## 6. INTERFACES EXTERNAS

### 6.1 Interfaces de Usuario

#### Dashboard Administrativo

- Layout con sidebar
- Header con notificaciones y perfil
- Breadcrumbs
- Tablas con sorting, filtering, pagination
- Formularios modales
- Charts interactivos

#### POS

- Fullscreen layout
- Split view (productos | carrito)
- Touch-friendly buttons
- Calculadora visual
- Quick actions

#### Sitio Público

- Responsive navbar
- Hero section
- Product grid
- Footer con links

### 6.2 Interfaces de Hardware

**Impresora Térmica**:

- Comunicación vía USB o red
- Comandos ESC/POS
- Librería: `node-thermal-printer`

**Lector de Código de Barras**:

- Input automático al campo activo
- Detección por patrón (prefijo/sufijo)

**Terminal de Pago**:

- Integración vía Stripe Terminal SDK (opcional)

### 6.3 Interfaces de Software

**Base de Datos**:

- PostgreSQL vía Prisma ORM
- Connection string en `.env`
- Connection pooling

**APIs Externas**:

- Stripe API v2023-10-16
- Cloudinary API
- Resend API

### 6.4 Interfaces de Comunicación

**Protocolos**:

- HTTP/HTTPS (REST API)
- WebSocket (tiempo real)
- Webhooks (callbacks)

**Formatos**:

- JSON para API
- FormData para uploads
- Server-Sent Events para streaming (opcional)

---

## 7. OTROS REQUISITOS

### 7.1 Requisitos de Instalación

**Prerrequisitos**:

- Node.js 20+ LTS
- npm, yarn o pnpm
- PostgreSQL 15+
- Git

**Instalación Local**:

```bash
# Clonar repositorio
git clone https://github.com/tu-org/restaurante-pos.git
cd restaurante-pos

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
# Editar .env con tus credenciales

# Generar Prisma Client
npx prisma generate

# Correr migraciones
npx prisma migrate dev

# Seed de datos iniciales
npx prisma db seed

# Iniciar desarrollo
npm run dev
```

**Variables de Entorno**:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/restaurante"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-muy-seguro"
JWT_SECRET="otro-secret-muy-seguro"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@tudominio.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud"
CLOUDINARY_API_KEY="123456"
CLOUDINARY_API_SECRET="secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 7.2 Deployment

**Opción 1: Vercel** (Recomendado)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables en dashboard
```

**Opción 2: Railway**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**Opción 3: VPS (Ubuntu)**

```bash
# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Clonar y configurar app
git clone ...
cd restaurante-pos
npm install
npm run build

# PM2 para proceso en background
npm install -g pm2
pm2 start npm --name "restaurante-pos" -- start
pm2 startup
pm2 save

# Nginx como reverse proxy
sudo apt-get install nginx
# Configurar nginx.conf

# SSL con Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com
```

### 7.3 Monitoreo y Mantenimiento

**Monitoreo**:

- Sentry para error tracking
- Vercel Analytics para performance
- Google Analytics para uso
- Uptime monitoring (UptimeRobot)

**Backups**:

- Database backup diario automático
- Backup de archivos subidos
- Retention policy: 30 días

**Actualizaciones**:

- Dependencias: revisar semanalmente
- Security patches: aplicar inmediatamente
- Features: ciclos de 2 semanas (sprints)

### 7.4 Testing

**Setup**:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

**Estrategia**:

- Unit tests para utils y servicios
- Integration tests para API routes
- E2E tests para flujos críticos:
  - Login
  - Crear venta
  - Crear producto
  - Pedido online completo

---

## 8. PLAN DE DESARROLLO

### 8.1 Fases del Proyecto

**Fase 1: Setup e Infraestructura** (Semana 1-2)

- [ ] Setup Next.js con TypeScript
- [ ] Configurar Prisma con PostgreSQL
- [ ] Setup Tailwind + shadcn/ui
- [ ] Configurar ESLint + Prettier
- [ ] Setup Git + GitHub
- [ ] Definir schema de base de datos
- [ ] Migraciones iniciales
- [ ] Seeds de datos

**Fase 2: Autenticación y Usuarios** (Semana 3-4)

- [ ] NextAuth.js setup
- [ ] Login/Logout
- [ ] Registro de usuarios
- [ ] Sistema de roles y permisos
- [ ] CRUD de usuarios
- [ ] Perfil de usuario
- [ ] Cambio de contraseña

**Fase 3: Catálogo de Productos** (Semana 5-6)

- [ ] CRUD de categorías
- [ ] CRUD de productos
- [ ] Upload de imágenes
- [ ] Múltiples precios
- [ ] Búsqueda y filtros
- [ ] Gestión de stock

**Fase 4: Punto de Venta (POS)** (Semana 7-9)

- [ ] Interfaz de POS
- [ ] Carrito de compras
- [ ] Cálculos (subtotal, descuento, tax, total)
- [ ] Hold orders
- [ ] Completar venta
- [ ] Reducción de stock
- [ ] Generación de recibo PDF
- [ ] Integración con impresora

**Fase 5: Clientes y Mesas** (Semana 10)

- [ ] CRUD de clientes
- [ ] Búsqueda de clientes
- [ ] Gestión de mesas
- [ ] Asignación de mesa a venta

**Fase 6: Inventario** (Semana 11-12)

- [ ] Recepciones
- [ ] Ajustes de inventario
- [ ] Logs de inventario
- [ ] Alertas de stock bajo

**Fase 7: Reportes** (Semana 13-14)

- [ ] Dashboard con KPIs
- [ ] Gráficos de ventas
- [ ] Reporte de productos más vendidos
- [ ] Reporte de ventas por empleado
- [ ] Exportación PDF/Excel

**Fase 8: Pedidos Online** (Semana 15-17)

- [ ] Sitio público con menú
- [ ] Carrito de compras online
- [ ] Checkout
- [ ] Integración con Stripe
- [ ] Webhooks de Stripe
- [ ] Panel de gestión de pedidos
- [ ] Emails de confirmación

**Fase 9: Features Adicionales** (Semana 18-19)

- [ ] Gestión de gastos
- [ ] Sistema de cupones
- [ ] Newsletter
- [ ] CMS para páginas
- [ ] Multiidioma

**Fase 10: PWA y Optimización** (Semana 20-21)

- [ ] Service Worker
- [ ] Modo offline
- [ ] Push notifications
- [ ] Optimización de performance
- [ ] Optimización SEO

**Fase 11: Testing** (Semana 22-23)

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Bug fixing

**Fase 12: Deployment y Documentación** (Semana 24)

- [ ] Deploy a producción
- [ ] Configurar dominio y SSL
- [ ] Documentación de usuario
- [ ] Documentación técnica
- [ ] Training

### 8.2 Stack de Desarrollo

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@prisma/client": "^5.14.0",
    "next-auth": "^4.24.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.0",
    "stripe": "^15.4.0",
    "@stripe/stripe-js": "^3.4.0",
    "socket.io": "^4.7.0",
    "socket.io-client": "^4.7.0",
    "recharts": "^2.12.0",
    "@tanstack/react-table": "^8.16.0",
    "date-fns": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "sharp": "^0.33.0",
    "puppeteer": "^22.7.0",
    "exceljs": "^4.4.0",
    "resend": "^3.2.0",
    "react-hot-toast": "^2.4.0",
    "framer-motion": "^11.1.0",
    "lucide-react": "^0.378.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "prisma": "^5.14.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "playwright": "^1.43.0",
    "ts-node": "^10.9.0"
  }
}
```

---

## 9. APÉNDICES

### 9.1 Glosario de Términos

- **Next.js**: Framework React para producción con SSR/SSG
- **Prisma**: ORM moderno para TypeScript/Node.js
- **shadcn/ui**: Colección de componentes reutilizables
- **Zustand**: State management minimalista
- **Zod**: Schema validation library
- **SSR**: Server-Side Rendering
- **SSG**: Static Site Generation
- **ISR**: Incremental Static Regeneration
- **tRPC**: TypeScript RPC framework (alternativa a REST)

### 9.2 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Socket.io Documentation](https://socket.io/docs/)

### 9.3 Comparación PHP vs JavaScript Stack

| Aspecto                  | Laravel (PHP)                     | Next.js (JavaScript)  |
| ------------------------ | --------------------------------- | --------------------- |
| **Lenguaje**             | PHP                               | TypeScript/JavaScript |
| **Runtime**              | Apache/Nginx + PHP-FPM            | Node.js               |
| **Framework**            | Laravel 5.5                       | Next.js 14+           |
| **ORM**                  | Eloquent                          | Prisma                |
| **Templates**            | Blade                             | React JSX/TSX         |
| **Auth**                 | Laravel Auth                      | NextAuth.js           |
| **Validación**           | FormRequest                       | Zod                   |
| **Real-time**            | Pusher/Laravel Echo               | Socket.io             |
| **Type Safety**          | No (PHP no es tipado fuertemente) | Sí (TypeScript)       |
| **Performance**          | Bueno                             | Excelente (SSR/SSG)   |
| **SEO**                  | Regular                           | Excelente             |
| **Ecosistema**           | Packagist                         | npm (más grande)      |
| **Learning Curve**       | Media                             | Media-Alta            |
| **Developer Experience** | Bueno                             | Excelente             |
| **Modernidad**           | Framework maduro                  | Stack moderno         |

### 9.4 Ventajas del Stack JavaScript

1. **Unified Language**: JavaScript en frontend y backend
2. **Type Safety**: TypeScript previene errores en desarrollo
3. **Performance**: SSR/SSG para carga ultra-rápida
4. **SEO**: Mejor indexación con contenido pre-renderizado
5. **DX**: Hot reload, auto-completion, mejor tooling
6. **Ecosystem**: npm tiene el mayor ecosistema de paquetes
7. **Real-time**: WebSocket nativo con Socket.io
8. **PWA**: Service workers para funcionalidad offline
9. **Scaling**: Vercel/Netlify para deploy sin configuración
10. **Community**: Comunidad activa y en crecimiento

---

## 10. CONTROL DE VERSIONES

| Versión | Fecha      | Autor                | Descripción                                     |
| ------- | ---------- | -------------------- | ----------------------------------------------- |
| 1.0     | 2025-09-30 | Equipo de Desarrollo | Documento inicial con stack JavaScript completo |

---

**Fin del documento**

---

## NOTAS FINALES

Este documento describe un sistema POS completo y moderno utilizando el stack tecnológico JavaScript más actual. La implementación real puede ajustarse según:

- Presupuesto disponible
- Tiempo de desarrollo
- Equipo de desarrollo disponible
- Priorización de features

Se recomienda iniciar con un MVP (Minimum Viable Product) que incluya:

1. Autenticación
2. Productos y categorías
3. POS básico
4. Reportes esenciales

Y luego iterar agregando features adicionales en sprints de 2 semanas.

El stack propuesto (Next.js + Prisma + PostgreSQL) es **production-ready**, escalable y mantenible a largo plazo.

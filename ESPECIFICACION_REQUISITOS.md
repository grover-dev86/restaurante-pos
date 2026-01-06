# Especificación de Requisitos de Software (SRS)
## Sistema POS para Restaurante

---

## 1. INTRODUCCIÓN

### 1.1 Propósito
Este documento describe los requisitos funcionales y no funcionales del Sistema de Punto de Venta (POS) para Restaurante. El sistema está diseñado para gestionar operaciones de ventas, inventario, clientes, pedidos online y administración de un restaurante.

### 1.2 Alcance
El sistema **POS para Restaurante** es una aplicación web desarrollada en Laravel 5.5 que permite:
- Gestión de ventas en punto de venta físico
- Control de inventario y productos
- Gestión de mesas y pedidos
- Pedidos online con pasarela de pago
- Reportes y análisis de ventas
- Administración de usuarios con roles y permisos
- Sitio web público con menú digital

### 1.3 Definiciones, Acrónimos y Abreviaciones
- **POS**: Point of Sale (Punto de Venta)
- **SRS**: Software Requirements Specification
- **CRUD**: Create, Read, Update, Delete
- **API REST**: Interfaz de programación de aplicaciones con arquitectura REST
- **VAT**: Value Added Tax (Impuesto al Valor Agregado)

### 1.4 Referencias
- Framework: Laravel 5.5
- PHP: >= 7.0
- Base de datos: MySQL
- Servidor web: Apache (XAMPP)

---

## 2. DESCRIPCIÓN GENERAL

### 2.1 Perspectiva del Producto
El sistema es una solución integral para restaurantes que combina:
- Backend administrativo para gestión interna
- Sistema POS para cajeros y meseros
- Frontend público para clientes
- API REST para integración con aplicaciones móviles

### 2.2 Funciones del Producto
Las principales funciones son:
1. **Gestión de Ventas (POS)**
   - Registro de ventas en tiempo real
   - Asignación de mesas
   - Cálculo automático de impuestos y descuentos
   - Generación de facturas/recibos
   - Sistema de "hold orders" (pedidos en espera)

2. **Gestión de Inventario**
   - Control de productos y categorías
   - Tracking de inventario
   - Recepciones de mercancía
   - Ajustes de stock

3. **Gestión Comercial**
   - Administración de clientes
   - Administración de proveedores
   - Registro de gastos

4. **Reportes y Análisis**
   - Ventas por período (día, semana, mes, año)
   - Productos más vendidos
   - Ventas por empleado
   - Gráficos de ingresos
   - Registro de actividad del personal

5. **Pedidos Online**
   - Catálogo de productos públicos
   - Carrito de compras
   - Pago con Stripe
   - Gestión de pedidos online

6. **Sitio Web Público**
   - Menú digital
   - Páginas institucionales (Acerca de, FAQ, Términos)
   - Formulario de contacto
   - Newsletter

7. **Administración de Sistema**
   - Gestión de usuarios
   - Roles y permisos (Admin, Cajero, etc.)
   - Configuración general
   - Gestión de mesas
   - Personalización de contenido web

### 2.3 Características de los Usuarios

| Tipo de Usuario | Descripción | Permisos |
|-----------------|-------------|----------|
| **Administrador** | Acceso total al sistema | Todas las funcionalidades |
| **Cajero/Mesero** | Opera el POS y registra ventas | Crear ventas, ver productos, gestionar pedidos |
| **Staff** | Personal operativo con acceso limitado | Según rol asignado |
| **Cliente** | Usuario del sitio web público | Ver menú, realizar pedidos online |

### 2.4 Restricciones
- Requiere conexión a internet para pedidos online y pagos
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- Servidor con PHP >= 7.0 y MySQL
- Laravel 5.5 (versión desactualizada, sin soporte oficial)

### 2.5 Suposiciones y Dependencias
- Conexión estable a base de datos MySQL
- Servidor XAMPP configurado correctamente
- Credenciales de Stripe válidas para pagos online
- Servidor SMTP configurado para envío de emails

---

## 3. REQUISITOS ESPECÍFICOS

### 3.1 Requisitos Funcionales

#### RF-001: Autenticación y Autorización
- **Prioridad**: Alta
- **Descripción**: El sistema debe permitir login/logout con validación de credenciales
- **Entradas**: Email, contraseña
- **Proceso**: Validación contra base de datos, creación de sesión
- **Salidas**: Redirección según rol de usuario
- **Requisitos relacionados**: RF-002

#### RF-002: Gestión de Roles y Permisos
- **Prioridad**: Alta
- **Descripción**: Sistema de roles con permisos granulares usando Entrust
- **Funcionalidades**:
  - Crear/editar/eliminar roles
  - Asignar permisos a roles
  - Asignar roles a usuarios

#### RF-003: Gestión de Productos
- **Prioridad**: Alta
- **Descripción**: CRUD completo de productos
- **Atributos del producto**:
  - Nombre (único, requerido)
  - Código de barras
  - Precios (múltiples precios en JSON)
  - Títulos de precios
  - Categoría
  - Descripción
  - Imagen (con crop)
  - Estado (activo/archivado)
- **Funcionalidades adicionales**:
  - Búsqueda por nombre o código de barras
  - Carga y recorte de imágenes
  - Soft delete
  - Paginación

#### RF-004: Gestión de Categorías
- **Prioridad**: Media
- **Descripción**: Organización de productos por categorías
- **Funcionalidades**:
  - Crear/editar/eliminar categorías
  - Asignar imagen a categoría
  - Visualización jerárquica

#### RF-005: Punto de Venta (POS)
- **Prioridad**: Alta
- **Descripción**: Interfaz para registro de ventas
- **Funcionalidades**:
  - Selección de productos por categoría
  - Búsqueda rápida de productos
  - Agregar productos al carrito
  - Modificar cantidades
  - Aplicar descuentos
  - Calcular IVA (10%)
  - Selección de cliente
  - Asignación de mesa
  - Métodos de pago (efectivo, tarjeta)
  - Cálculo de cambio
  - "Hold orders" - guardar pedidos pendientes
  - Recuperar pedidos en espera
  - Generación de recibo/factura
  - Cancelación de ventas

#### RF-006: Gestión de Clientes
- **Prioridad**: Media
- **Descripción**: Administración de base de datos de clientes
- **Atributos**:
  - Nombre (requerido)
  - Email (único, requerido)
  - Teléfono (requerido)
  - Dirección (requerido)
  - Barrio/Colonia
  - Comentarios
- **Funcionalidades**:
  - CRUD completo
  - Búsqueda por nombre
  - Creación rápida desde POS

#### RF-007: Gestión de Proveedores
- **Prioridad**: Media
- **Descripción**: Administración de proveedores
- **Funcionalidades**: CRUD completo similar a clientes

#### RF-008: Gestión de Mesas
- **Prioridad**: Media
- **Descripción**: Control de mesas del restaurante
- **Funcionalidades**:
  - Crear/editar/eliminar mesas
  - Asignar venta a mesa
  - Estado de mesas (ocupada/disponible)

#### RF-009: Control de Inventario
- **Prioridad**: Media
- **Descripción**: Tracking de movimientos de inventario
- **Funcionalidades**:
  - Recepciones de mercancía
  - Ajustes de inventario (aumentos/disminuciones)
  - Historial de movimientos

#### RF-010: Gestión de Gastos
- **Prioridad**: Media
- **Descripción**: Registro de gastos operativos
- **Funcionalidades**:
  - Crear/editar/eliminar gastos
  - Categorización de gastos
  - Fecha y monto

#### RF-011: Sistema de Reportes
- **Prioridad**: Alta
- **Descripción**: Generación de reportes analíticos
- **Tipos de reportes**:
  - **Dashboard principal**:
    - Ventas de hoy
    - Ventas de ayer
    - Ventas última semana
    - Ventas último mes
    - Total histórico
    - Gráficos de tendencias (7, 30, 365 días)
    - Top 10 productos más vendidos
    - Últimas 10 ventas
  - **Ventas por producto**: Detalle de ventas por producto
  - **Ventas por empleado**: Performance del personal
  - **Reportes de gastos**: Análisis de gastos
  - **Gráficos**: Visualizaciones de datos
  - **Log de actividad**: Registro de acciones del personal

#### RF-012: Pedidos Online
- **Prioridad**: Alta
- **Descripción**: Sistema de pedidos a través del sitio web
- **Funcionalidades**:
  - Menú público con categorías
  - Agregar productos al carrito
  - Formulario de datos del cliente
  - Aplicar descuentos
  - Costo de delivery
  - Pago con Stripe
  - Notificación por email
  - Panel de gestión de pedidos
  - Cambio de estado de pedidos

#### RF-013: Sitio Web Público
- **Prioridad**: Media
- **Descripción**: Frontend para clientes
- **Páginas**:
  - Home con slider
  - Menú digital (categorías + productos)
  - Acerca de
  - FAQ
  - Términos y condiciones
  - Contacto
- **Funcionalidades**:
  - Gestión de sliders
  - Editor de contenido HTML
  - Gestión de páginas dinámicas
  - Formulario de contacto con envío de email
  - Suscripción a newsletter
  - Multiidioma (inglés/español)

#### RF-014: Gestión de Usuarios
- **Prioridad**: Alta
- **Descripción**: Administración de usuarios del sistema
- **Funcionalidades**:
  - CRUD de usuarios
  - Asignación de roles
  - Cambio de contraseña
  - Perfil de usuario

#### RF-015: Configuración del Sistema
- **Prioridad**: Media
- **Descripción**: Ajustes generales del sistema
- **Funcionalidades**:
  - Configuración general (nombre, logo, datos de contacto)
  - Configuración de homepage
  - Gestión de menú de navegación
  - Configuración de perfil
  - Cambio de contraseña

#### RF-016: API REST
- **Prioridad**: Media
- **Descripción**: Endpoints para integración externa
- **Endpoints disponibles**:
  - `/api/categories` - Listado de categorías
  - `/api/products` - Gestión de productos
  - `/api/sales` - Registro de ventas
  - `/api/users` - Información de usuarios

#### RF-017: Notificaciones por Email
- **Prioridad**: Media
- **Descripción**: Sistema de envío de emails
- **Tipos de emails**:
  - Confirmación de pedido online
  - Contacto desde formulario web
  - Reportes automáticos (ventas diarias, ventas por staff)
  - Email de prueba

### 3.2 Requisitos No Funcionales

#### RNF-001: Rendimiento
- El sistema debe responder en menos de 2 segundos para operaciones comunes
- Soporte para al menos 50 transacciones concurrentes
- Paginación en listados largos (15-25 registros por página)

#### RNF-002: Seguridad
- Autenticación requerida para áreas administrativas
- Protección CSRF en formularios
- Validación de datos en servidor
- Encriptación de contraseñas
- Sesiones con timeout
- Middleware de autenticación y autorización

#### RNF-003: Usabilidad
- Interfaz responsive con Bootstrap
- Búsqueda rápida en listados
- Mensajes de éxito/error claros
- Confirmación en acciones destructivas
- Navegación intuitiva

#### RNF-004: Mantenibilidad
- Arquitectura MVC (Laravel)
- Código modular y reutilizable
- Migraciones de base de datos
- Seeders para datos iniciales
- Comentarios en código
- Validaciones centralizadas en Request classes

#### RNF-005: Disponibilidad
- Disponibilidad del 99% en horario operativo
- Backups automáticos de base de datos
- Recuperación ante fallos

#### RNF-006: Escalabilidad
- Arquitectura preparada para crecimiento
- Caché de archivos (Laravel)
- Optimización de consultas SQL
- Soft deletes para preservar datos históricos

#### RNF-007: Compatibilidad
- PHP >= 7.0
- MySQL 5.7+
- Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- Responsive design para tablets y móviles

#### RNF-008: Integridad de Datos
- Transacciones de base de datos para operaciones críticas
- Validación de datos en backend
- Relaciones de integridad referencial
- Soft deletes para evitar pérdida de datos

---

## 4. MODELO DE DATOS

### 4.1 Entidades Principales

#### users
- id, name, email, password, role_id, remember_token, timestamps

#### roles
- id, name, display_name, description, timestamps

#### permissions
- id, name, display_name, description, timestamps

#### categories
- id, name, timestamps

#### products
- id, name, barcode, prices (JSON), titles (JSON), category_id, description, is_delete, deleted_at, timestamps

#### customers
- id, name, email, phone, address, neighborhood, comments, timestamps

#### suppliers
- id, name, email, phone, address, comments, timestamps

#### sales
- id, customer_id, cashier_id, name, email, phone, address, type (pos/order), status, amount, discount, vat, total_given, change, payment_with, delivery_cost, comments, timestamps

#### sale_items
- id, sale_id, product_id, quantity, price, timestamps

#### tables
- id, name, status, timestamps

#### expenses
- id, name, amount, category, date, description, timestamps

#### receivings
- id, supplier_id, reference_no, total, note, timestamps

#### receiving_items
- id, receiving_id, product_id, quantity, cost, timestamps

#### adjustments
- id, reference_no, note, timestamps

#### adjustment_items
- id, adjustment_id, product_id, quantity, type (addition/subtraction), timestamps

#### inventory_tracking
- id, product_id, sale_id, receiving_id, adjustment_id, quantity, type, timestamps

#### pages
- id, title, slug, content, meta_description, meta_keywords, timestamps

#### sliders
- id, title, image, link, order, status, timestamps

#### activities
- id, user_id, action, description, timestamps

### 4.2 Relaciones
- **User** belongsTo **Role**
- **Role** belongsToMany **Permission**
- **Product** belongsTo **Category**
- **Sale** hasMany **SaleItem**
- **Sale** belongsTo **Customer**
- **Sale** belongsTo **User** (cashier)
- **Receiving** hasMany **ReceivingItem**
- **Receiving** belongsTo **Supplier**
- **Adjustment** hasMany **AdjustmentItem**

---

## 5. INTERFACES EXTERNAS

### 5.1 Interfaces de Usuario
- **Panel administrativo**: Interfaz completa con menú lateral, listados, formularios
- **POS**: Interfaz optimizada para ventas rápidas
- **Sitio web público**: Frontend responsive con menú, páginas institucionales

### 5.2 Interfaces de Hardware
- Impresora térmica para tickets (recomendada)
- Lector de código de barras (opcional)
- Terminal de pago (opcional)

### 5.3 Interfaces de Software
- **Base de datos**: MySQL vía PDO
- **Pasarela de pago**: Stripe API
- **Servidor SMTP**: Gmail/otro para envío de emails
- **Procesamiento de imágenes**: Intervention/Image

### 5.4 Interfaces de Comunicación
- HTTP/HTTPS para comunicación web
- API REST JSON para integraciones
- WebSockets (Pusher) configurado para tiempo real

---

## 6. OTROS REQUISITOS

### 6.1 Requisitos de Instalación
1. Servidor web con PHP >= 7.0
2. MySQL 5.7+
3. Composer instalado
4. Extensiones PHP: OpenSSL, PDO, Mbstring, Tokenizer, XML, GD
5. Configuración de `.env` con credenciales
6. Ejecución de migraciones: `php artisan migrate`
7. Generación de clave: `php artisan key:generate`
8. Permisos de escritura en `storage/` y `bootstrap/cache/`

### 6.2 Requisitos de Configuración
- **Stripe**: APP_STRIPE_KEY y APP_STRIPE_SECRET
- **Email**: Configuración SMTP en `.env`
- **Base de datos**: Credenciales en `.env`
- **URL base**: APP_URL configurada correctamente

### 6.3 Dependencias del Sistema
- **Laravel Framework**: 5.5.*
- **barryvdh/laravel-dompdf**: Generación de PDFs
- **intervention/image**: Procesamiento de imágenes
- **stripe/stripe-php**: Integración con Stripe
- **zizaco/entrust**: Roles y permisos
- **barryvdh/laravel-translation-manager**: Gestión de traducciones

---

## 7. APÉNDICES

### 7.1 Estructura de Directorios
```
restaurante/
├── app/                    # Modelos, controladores, middleware
│   ├── Http/Controllers/   # Controladores
│   ├── Models/             # Modelos Eloquent
│   └── Helpers/            # Funciones auxiliares
├── resources/              # Vistas Blade, assets
│   └── views/              # Templates
├── routes/                 # Definición de rutas
│   ├── web.php             # Rutas web
│   └── api.php             # Rutas API
├── database/               # Migraciones, seeders
├── public/                 # Punto de entrada, assets públicos
├── storage/                # Logs, caché, uploads
├── config/                 # Archivos de configuración
└── vendor/                 # Dependencias Composer
```

### 7.2 Rutas Principales del Sistema

#### Rutas Públicas
- `/` - Homepage
- `/our-menu` - Menú del restaurante
- `/about` - Acerca de
- `/contact-us` - Contacto
- `/faq` - Preguntas frecuentes
- `/terms-condition` - Términos y condiciones

#### Rutas Administrativas (requieren autenticación)
- `/dashboard` - Panel principal
- `/sales/create` - POS
- `/sales` - Listado de ventas
- `/products` - Gestión de productos
- `/categories` - Gestión de categorías
- `/customers` - Gestión de clientes
- `/suppliers` - Gestión de proveedores
- `/tables` - Gestión de mesas
- `/expenses` - Gestión de gastos
- `/online-orders` - Pedidos online
- `/reports/*` - Reportes
- `/settings/*` - Configuración
- `/users` - Gestión de usuarios
- `/roles` - Gestión de roles

### 7.3 Consideraciones de Migración
El proyecto incluye documentos de planes de migración:
- `MIGRATION_PLAN.md` - Plan general de migración
- `MIGRATION_PLAN_NEXTJS.md` - Plan de migración a Next.js

Se recomienda considerar actualización del stack tecnológico debido a:
- Laravel 5.5 sin soporte oficial desde 2019
- Vulnerabilidades de seguridad conocidas
- Falta de características modernas

### 7.4 Notas Importantes
⚠️ **Advertencias de Seguridad**:
- El sistema usa Laravel 5.5, versión obsoleta con vulnerabilidades conocidas
- Se recomienda actualizar a Laravel 11.x (versión actual)
- Base de datos configurada con usuario `root` sin contraseña (solo desarrollo)
- Emails de prueba con credenciales hardcodeadas en código

---

## 8. CONTROL DE VERSIONES

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0 | 2025-09-30 | Análisis de código | Documento inicial generado a partir del código fuente |

---

**Fin del documento**
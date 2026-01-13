# Historias de Usuario - Sistema POS para Restaurante

## Proyecto: Next.js 14 + TypeScript + Prisma + PostgreSQL

---

## 📋 Índice de Épicas

1. [Autenticación y Gestión de Usuarios](#épica-1-autenticación-y-gestión-de-usuarios)
2. [Catálogo de Productos](#épica-2-catálogo-de-productos)
3. [Punto de Venta (POS)](#épica-3-punto-de-venta-pos)
4. [Gestión de Clientes](#épica-4-gestión-de-clientes)
5. [Gestión de Mesas](#épica-5-gestión-de-mesas)
6. [Control de Inventario](#épica-6-control-de-inventario)
7. [Reportes y Analytics](#épica-7-reportes-y-analytics)
8. [Pedidos Online](#épica-8-pedidos-online)
9. [Sitio Web Público](#épica-9-sitio-web-público)
10. [Configuración del Sistema](#épica-10-configuración-del-sistema)

---

## Épica 1: Autenticación y Gestión de Usuarios

### HU-001: Login de Usuario

**Como** usuario del sistema
**Quiero** iniciar sesión con mi email y contraseña
**Para** acceder a las funcionalidades según mi rol

**Criterios de Aceptación:**
- El sistema muestra un formulario con campos email y contraseña
- Valida que ambos campos sean requeridos
- Muestra error si las credenciales son incorrectas
- Redirige al dashboard correspondiente según el rol del usuario
- Mantiene la sesión activa con JWT
- Implementa rate limiting (5 intentos por 15 minutos)

**Subtareas:**
- [ ] Crear schema de User en Prisma
- [ ] Configurar NextAuth.js v5
- [ ] Crear página `/login` con formulario
- [ ] Implementar validación con Zod
- [ ] Crear API route `/api/auth/login`
- [ ] Implementar hash de contraseñas con bcrypt
- [ ] Generar JWT con información del usuario
- [ ] Configurar middleware de autenticación
- [ ] Implementar rate limiting con Redis o memoria
- [ ] Crear tests unitarios para autenticación
- [ ] Agregar mensajes de error amigables

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-002: Logout de Usuario

**Como** usuario autenticado
**Quiero** cerrar sesión de forma segura
**Para** proteger mi cuenta cuando no esté usando el sistema

**Criterios de Aceptación:**
- Botón de logout visible en el header
- Invalida el token JWT al cerrar sesión
- Redirige a la página de login
- Limpia datos de sesión del cliente

**Subtareas:**
- [ ] Crear botón de logout en navbar
- [ ] Implementar API route `/api/auth/logout`
- [ ] Invalidar token en el servidor
- [ ] Limpiar localStorage/cookies
- [ ] Redirigir a `/login`
- [ ] Agregar confirmación opcional

**Estimación:** 3 puntos
**Prioridad:** Alta

---

### HU-003: Recuperación de Contraseña

**Como** usuario que olvidó su contraseña
**Quiero** poder restablecerla mediante email
**Para** recuperar el acceso a mi cuenta

**Criterios de Aceptación:**
- Formulario "Olvidé mi contraseña" en página de login
- Envía email con link de recuperación (válido 1 hora)
- Permite establecer nueva contraseña
- Valida que la nueva contraseña cumpla requisitos de seguridad

**Subtareas:**
- [ ] Crear página `/forgot-password`
- [ ] Crear API route `/api/auth/forgot-password`
- [ ] Generar token único de recuperación
- [ ] Configurar servicio de email (Resend)
- [ ] Crear template de email con React Email
- [ ] Crear página `/reset-password/:token`
- [ ] Validar token de recuperación
- [ ] Actualizar contraseña en base de datos
- [ ] Enviar email de confirmación de cambio
- [ ] Agregar expiración de token (1 hora)

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-004: Gestión de Roles y Permisos

**Como** administrador del sistema
**Quiero** crear y asignar roles con permisos específicos
**Para** controlar el acceso de los usuarios a diferentes funcionalidades

**Criterios de Aceptación:**
- CRUD completo de roles
- Asignación de permisos por recurso y acción (create, read, update, delete)
- Asignación de roles a usuarios
- Middleware verifica permisos antes de permitir acciones
- Roles predefinidos: Admin, Manager, Cashier, Waiter

**Subtareas:**
- [ ] Crear schemas de Role y Permission en Prisma
- [ ] Crear página `/dashboard/roles`
- [ ] Implementar tabla de roles con TanStack Table
- [ ] Crear formulario modal para crear/editar rol
- [ ] Implementar selector de permisos (checkboxes agrupados)
- [ ] Crear API routes CRUD para roles
- [ ] Implementar middleware de autorización RBAC
- [ ] Crear hook personalizado `usePermissions()`
- [ ] Crear componente `<PermissionGate>` para UI
- [ ] Seed de roles y permisos iniciales
- [ ] Agregar tests de autorización

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-005: CRUD de Usuarios

**Como** administrador
**Quiero** gestionar los usuarios del sistema
**Para** controlar quién tiene acceso y con qué permisos

**Criterios de Aceptación:**
- Listar usuarios con paginación, búsqueda y filtros
- Crear nuevo usuario con validación de email único
- Editar información del usuario
- Asignar rol al usuario
- Activar/desactivar usuario
- Eliminar usuario (soft delete)
- Ver historial de actividad del usuario

**Subtareas:**
- [ ] Crear página `/dashboard/users`
- [ ] Implementar tabla de usuarios con TanStack Table
- [ ] Agregar búsqueda con debounce
- [ ] Agregar filtros (rol, activo/inactivo)
- [ ] Crear modal de crear usuario
- [ ] Crear formulario con React Hook Form + Zod
- [ ] Implementar upload de avatar con Cloudinary
- [ ] Crear API routes CRUD `/api/users`
- [ ] Implementar paginación en backend
- [ ] Agregar soft delete con campo `deletedAt`
- [ ] Crear página de detalle de usuario
- [ ] Mostrar historial de actividad
- [ ] Agregar confirmación para eliminar

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-006: Perfil de Usuario

**Como** usuario autenticado
**Quiero** ver y editar mi perfil
**Para** mantener mi información actualizada

**Criterios de Aceptación:**
- Ver información personal (nombre, email, teléfono)
- Editar información personal
- Cambiar avatar
- Cambiar contraseña
- Ver estadísticas personales (ventas realizadas, última sesión)

**Subtareas:**
- [ ] Crear página `/dashboard/profile`
- [ ] Mostrar información del usuario actual
- [ ] Crear formulario de edición de perfil
- [ ] Implementar upload de avatar con crop
- [ ] Crear sección de cambio de contraseña
- [ ] Validar contraseña actual antes de cambiar
- [ ] Crear API route `/api/users/me`
- [ ] Crear API route `/api/users/me/password`
- [ ] Mostrar estadísticas del usuario
- [ ] Agregar notificación de éxito

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-007: Registro de Actividad

**Como** administrador
**Quiero** ver un log de todas las acciones realizadas por los usuarios
**Para** auditar el sistema y detectar problemas

**Criterios de Aceptación:**
- Registra automáticamente acciones importantes (create, update, delete)
- Incluye: usuario, acción, recurso, fecha, IP, descripción
- Filtros por usuario, acción, recurso, fecha
- Búsqueda por descripción
- Paginación
- Exportación a CSV

**Subtareas:**
- [ ] Crear schema de Activity en Prisma
- [ ] Crear middleware para logging automático
- [ ] Implementar función `logActivity()`
- [ ] Crear página `/dashboard/activity-log`
- [ ] Implementar tabla con filtros
- [ ] Agregar selector de rango de fechas
- [ ] Crear API route `/api/activity`
- [ ] Implementar exportación a CSV
- [ ] Agregar paginación
- [ ] Optimizar consultas con índices

**Estimación:** 8 puntos
**Prioridad:** Baja

---

## Épica 2: Catálogo de Productos

### HU-008: CRUD de Categorías

**Como** administrador
**Quiero** gestionar las categorías de productos
**Para** organizar el menú del restaurante

**Criterios de Aceptación:**
- Listar categorías con imagen e indicador de cantidad de productos
- Crear nueva categoría con nombre único
- Editar categoría (nombre, imagen, descripción, orden)
- Eliminar categoría (solo si no tiene productos)
- Drag and drop para reordenar categorías
- Activar/desactivar categoría

**Subtareas:**
- [ ] Crear schema de Category en Prisma
- [ ] Crear página `/dashboard/categories`
- [ ] Implementar grid de categorías con cards
- [ ] Crear modal de crear/editar categoría
- [ ] Implementar formulario con validación Zod
- [ ] Agregar upload de imagen con preview
- [ ] Implementar drag and drop con dnd-kit
- [ ] Crear API routes CRUD `/api/categories`
- [ ] Validar que categoría no tenga productos antes de eliminar
- [ ] Generar slug automático desde nombre
- [ ] Agregar contador de productos por categoría
- [ ] Implementar activar/desactivar

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-009: CRUD de Productos

**Como** administrador
**Quiero** gestionar el catálogo de productos
**Para** mantener actualizado el menú del restaurante

**Criterios de Aceptación:**
- Listar productos con imagen, precio, stock, categoría
- Búsqueda por nombre o código de barras
- Filtros por categoría, estado, stock bajo
- Crear producto con validación
- Múltiples precios por producto (Pequeño, Mediano, Grande)
- Galería de imágenes (máximo 5)
- Editar producto
- Duplicar producto
- Archivar/desarchivar producto
- Eliminar producto (soft delete)

**Subtareas:**
- [ ] Crear schemas Product, ProductPrice, ProductImage en Prisma
- [ ] Crear página `/dashboard/products`
- [ ] Implementar tabla de productos con TanStack Table
- [ ] Agregar búsqueda con debounce
- [ ] Agregar filtros (categoría, activo, stock bajo)
- [ ] Crear modal/página de crear producto
- [ ] Implementar formulario complejo con secciones
- [ ] Agregar campo dinámico para múltiples precios
- [ ] Implementar upload de múltiples imágenes
- [ ] Agregar drag and drop para ordenar imágenes
- [ ] Implementar crop de imágenes con Sharp
- [ ] Crear API routes CRUD `/api/products`
- [ ] Generar thumbnails automáticamente
- [ ] Validar nombre y barcode únicos
- [ ] Implementar duplicar producto
- [ ] Agregar indicador visual de stock bajo
- [ ] Implementar soft delete
- [ ] Optimizar imágenes al subir

**Estimación:** 21 puntos
**Prioridad:** Alta

---

### HU-010: Importación Masiva de Productos

**Como** administrador
**Quiero** importar productos desde un archivo CSV/Excel
**Para** agilizar la carga inicial del catálogo

**Criterios de Aceptación:**
- Upload de archivo CSV o Excel
- Preview de datos antes de importar
- Validación de datos (nombres únicos, precios válidos, etc.)
- Muestra errores por fila con descripción
- Importa solo filas válidas o cancela todo si hay errores críticos
- Muestra resumen: X importados, Y con errores

**Subtareas:**
- [ ] Crear página `/dashboard/products/import`
- [ ] Implementar upload de archivo
- [ ] Parsear CSV con papaparse o xlsx
- [ ] Crear tabla de preview de datos
- [ ] Validar cada fila con Zod
- [ ] Mostrar errores inline en tabla
- [ ] Crear API route `/api/products/import`
- [ ] Implementar importación transaccional
- [ ] Asociar productos a categorías existentes
- [ ] Generar slugs automáticos
- [ ] Mostrar resumen de importación
- [ ] Descargar template CSV de ejemplo
- [ ] Agregar documentación de formato

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-011: Exportación de Catálogo

**Como** administrador
**Quiero** exportar el catálogo de productos a Excel/CSV
**Para** tener un respaldo o trabajar con los datos externamente

**Criterios de Aceptación:**
- Botón de exportar en listado de productos
- Respeta filtros aplicados
- Genera archivo Excel con columnas: nombre, código, categoría, precios, stock, estado
- Descarga automática del archivo
- Nombre de archivo con fecha: `productos_2025-01-12.xlsx`

**Subtareas:**
- [ ] Agregar botón "Exportar" en `/dashboard/products`
- [ ] Crear API route `/api/products/export`
- [ ] Implementar generación de Excel con ExcelJS
- [ ] Incluir headers y estilos
- [ ] Aplicar filtros activos a la exportación
- [ ] Generar nombre de archivo dinámico
- [ ] Retornar archivo con headers correctos
- [ ] Agregar loading state durante exportación
- [ ] Agregar opción de exportar todo o solo filtrados

**Estimación:** 5 puntos
**Prioridad:** Baja

---

### HU-012: Alertas de Stock Bajo

**Como** administrador
**Quiero** recibir alertas cuando un producto tenga stock bajo
**Para** reabastecerlo a tiempo

**Criterios de Aceptación:**
- Indicador visual en listado de productos (badge rojo)
- Widget en dashboard con productos con stock bajo
- Notificación in-app cuando stock llega al mínimo
- Email diario con resumen de productos con stock bajo (opcional)
- Configuración del umbral de stock bajo por producto

**Subtareas:**
- [ ] Agregar campo `minStock` en schema Product
- [ ] Crear query para productos con stock bajo
- [ ] Agregar badge en tabla de productos
- [ ] Crear widget en dashboard
- [ ] Implementar notificación in-app
- [ ] Crear cron job para email diario (node-cron)
- [ ] Crear template de email de alerta
- [ ] Agregar configuración de umbral en formulario de producto
- [ ] Crear API route `/api/products/low-stock`

**Estimación:** 8 puntos
**Prioridad:** Media

---

## Épica 3: Punto de Venta (POS)

### HU-013: Interfaz de POS

**Como** cajero
**Quiero** una interfaz rápida e intuitiva para registrar ventas
**Para** atender clientes eficientemente

**Criterios de Aceptación:**
- Layout dividido: productos (izquierda 70%) | carrito (derecha 30%)
- Categorías en pestañas superiores
- Grid de productos con imagen, nombre y precio
- Click en producto lo agrega al carrito
- Carrito muestra: producto, cantidad, precio unitario, subtotal
- Calculadora de cantidades
- Búsqueda rápida de productos (debounce 300ms)
- Atajos de teclado (F1-F12 para productos frecuentes)
- Responsive para tablets

**Subtareas:**
- [ ] Crear página `/pos` (layout fullscreen)
- [ ] Implementar layout con split view
- [ ] Crear componente de categorías (tabs)
- [ ] Crear grid de productos con cards
- [ ] Implementar búsqueda con autocomplete
- [ ] Crear store Zustand para carrito de POS
- [ ] Implementar componente de carrito
- [ ] Agregar botones +/- para cantidades
- [ ] Crear calculadora numérica modal
- [ ] Implementar atajos de teclado
- [ ] Agregar imágenes lazy load
- [ ] Optimizar para tablets
- [ ] Crear skeleton loaders

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-014: Agregar Productos al Carrito

**Como** cajero
**Quiero** agregar productos al carrito de venta
**Para** construir el pedido del cliente

**Criterios de Aceptación:**
- Click en producto lo agrega al carrito (cantidad 1)
- Si el producto ya está, incrementa cantidad
- Permite seleccionar precio/tamaño (Pequeño, Mediano, Grande)
- Valida stock disponible antes de agregar
- Permite agregar notas al item
- Muestra feedback visual al agregar
- Actualiza totales automáticamente

**Subtareas:**
- [ ] Implementar acción `addToCart` en store
- [ ] Validar stock disponible
- [ ] Mostrar modal de selección de precio si aplica
- [ ] Agregar animación al agregar item
- [ ] Mostrar toast de confirmación
- [ ] Actualizar cantidades si producto ya existe
- [ ] Implementar modal de notas de item
- [ ] Calcular subtotal por item
- [ ] Recalcular total del carrito
- [ ] Persistir carrito en localStorage (opcional)

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-015: Modificar y Eliminar Items del Carrito

**Como** cajero
**Quiero** modificar cantidades o eliminar items del carrito
**Para** corregir errores o cambios del cliente

**Criterios de Aceptación:**
- Botones +/- para incrementar/decrementar cantidad
- Input manual de cantidad
- Validar stock al aumentar cantidad
- Botón de eliminar item con confirmación
- Actualiza totales automáticamente
- Permite editar precio/tamaño del item
- Permite editar notas del item

**Subtareas:**
- [ ] Implementar botones +/- con validación
- [ ] Permitir input directo de cantidad
- [ ] Validar stock al modificar
- [ ] Implementar acción `removeFromCart`
- [ ] Agregar confirmación para eliminar
- [ ] Permitir cambiar precio/tamaño de item
- [ ] Mostrar modal para editar notas
- [ ] Recalcular totales al modificar
- [ ] Agregar animación al eliminar

**Estimación:** 5 puntos
**Prioridad:** Alta

---

### HU-016: Aplicar Descuentos

**Como** cajero
**Quiero** aplicar descuentos a la venta
**Para** ofrecer promociones a los clientes

**Criterios de Aceptación:**
- Descuento en porcentaje (%)
- Descuento en monto fijo ($)
- Se aplica al subtotal (antes de impuestos)
- Muestra descuento desglosado en resumen
- Permite remover descuento
- Valida que descuento no exceda el subtotal
- Registra el descuento en la base de datos

**Subtareas:**
- [ ] Crear componente de panel de descuentos
- [ ] Agregar selector de tipo (% o $)
- [ ] Implementar input de cantidad/porcentaje
- [ ] Validar que descuento sea válido
- [ ] Actualizar cálculos del carrito
- [ ] Mostrar descuento en resumen
- [ ] Implementar acción `applyDiscount`
- [ ] Implementar acción `removeDiscount`
- [ ] Guardar descuento en venta

**Estimación:** 5 puntos
**Prioridad:** Media

---

### HU-017: Seleccionar Cliente

**Como** cajero
**Quiero** asociar la venta a un cliente
**Para** llevar registro de compras por cliente

**Criterios de Aceptación:**
- Búsqueda rápida de clientes (nombre, teléfono, email)
- Muestra sugerencias mientras escribe
- Permite seleccionar cliente de la lista
- Permite crear cliente rápido desde POS
- Muestra datos del cliente seleccionado
- Permite remover cliente (venta anónima)
- Cliente opcional

**Subtareas:**
- [ ] Crear componente de búsqueda de clientes
- [ ] Implementar autocomplete con debounce
- [ ] Crear API route `/api/customers/search`
- [ ] Mostrar lista de sugerencias
- [ ] Implementar selección de cliente
- [ ] Crear modal de cliente rápido
- [ ] Agregar acción `setCustomer` al store
- [ ] Mostrar datos del cliente en POS
- [ ] Permitir remover cliente

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-018: Asignar Mesa

**Como** cajero/mesero
**Quiero** asignar la venta a una mesa
**Para** llevar control de pedidos por mesa

**Criterios de Aceptación:**
- Lista visual de mesas (grid)
- Indica estado: disponible, ocupada, reservada
- Permite seleccionar mesa disponible
- Marca mesa como ocupada al asignar
- Permite cambiar mesa durante la venta
- Permite liberar mesa sin venta
- Mesa opcional (para pedidos para llevar)

**Subtareas:**
- [ ] Crear componente selector de mesas
- [ ] Crear query para obtener mesas con estado
- [ ] Mostrar grid visual de mesas
- [ ] Usar colores según estado
- [ ] Implementar selección de mesa
- [ ] Crear API route `/api/tables/:id/assign`
- [ ] Actualizar estado de mesa en tiempo real (WebSocket)
- [ ] Permitir cambiar mesa
- [ ] Agregar acción `setTable` al store

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-019: Calcular Totales (Subtotal, IVA, Total)

**Como** cajero
**Quiero** que el sistema calcule automáticamente los totales
**Para** evitar errores de cálculo

**Criterios de Aceptación:**
- Calcula subtotal (suma de items)
- Aplica descuento si existe
- Calcula IVA (10% por defecto, configurable)
- Calcula total final
- Muestra desglose claro en pantalla
- Actualiza en tiempo real al modificar items

**Subtareas:**
- [ ] Implementar función `calculateSubtotal()`
- [ ] Implementar función `applyDiscount()`
- [ ] Implementar función `calculateTax()`
- [ ] Implementar función `calculateTotal()`
- [ ] Crear computed values en store Zustand
- [ ] Mostrar desglose en panel de resumen
- [ ] Actualizar automáticamente con cada cambio
- [ ] Obtener tasa de IVA desde configuración

**Estimación:** 3 puntos
**Prioridad:** Alta

---

### HU-020: Seleccionar Método de Pago

**Como** cajero
**Quiero** seleccionar el método de pago
**Para** registrarlo correctamente en el sistema

**Criterios de Aceptación:**
- Opciones: Efectivo, Tarjeta, Transferencia
- Solo una opción seleccionable
- Si es efectivo, permite ingresar monto recibido
- Calcula cambio automáticamente
- Valida que monto recibido >= total
- Si es tarjeta/transferencia, no requiere monto recibido

**Subtareas:**
- [ ] Crear componente selector de método de pago
- [ ] Implementar radio buttons para métodos
- [ ] Mostrar input de monto recibido si es efectivo
- [ ] Implementar cálculo de cambio
- [ ] Validar monto recibido
- [ ] Mostrar cambio en grande y claro
- [ ] Agregar acción `setPaymentMethod` al store
- [ ] Deshabilitar completar venta si falta método

**Estimación:** 5 puntos
**Prioridad:** Alta

---

### HU-021: Guardar Pedido en Espera (Hold)

**Como** cajero
**Quiero** guardar un pedido en espera
**Para** atender a otro cliente y retomarlo después

**Criterios de Aceptación:**
- Botón "Guardar en espera"
- Solicita nombre o número de referencia
- Guarda carrito completo en base de datos
- Limpia el POS actual
- Lista de pedidos en espera visible
- Permite recuperar pedido posteriormente

**Subtareas:**
- [ ] Crear botón "Hold" en POS
- [ ] Mostrar modal para nombre de referencia
- [ ] Crear API route `/api/sales/hold`
- [ ] Guardar venta con status PENDING
- [ ] Limpiar carrito después de guardar
- [ ] Crear componente de lista de held orders
- [ ] Mostrar badge con cantidad de held orders
- [ ] Implementar búsqueda de held orders
- [ ] Agregar notificación de éxito

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-022: Recuperar Pedido en Espera

**Como** cajero
**Quiero** recuperar un pedido guardado
**Para** continuar con la venta

**Criterios de Aceptación:**
- Lista de pedidos en espera
- Búsqueda por nombre/número
- Click en pedido lo carga al POS
- Restaura carrito completo (items, cliente, mesa, descuentos)
- Elimina el pedido de la lista de espera
- Confirmación si hay carrito actual activo

**Subtareas:**
- [ ] Crear modal/sidebar con held orders
- [ ] Implementar búsqueda de held orders
- [ ] Mostrar tarjetas de cada held order
- [ ] Crear API route `/api/sales/hold/:id`
- [ ] Implementar acción `loadHeldOrder`
- [ ] Restaurar todos los datos al carrito
- [ ] Marcar pedido como en proceso
- [ ] Agregar confirmación si hay carrito activo
- [ ] Actualizar UI en tiempo real

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-023: Completar Venta

**Como** cajero
**Quiero** completar y registrar la venta
**Para** generar la factura y actualizar inventario

**Criterios de Aceptación:**
- Botón "Completar Venta" habilitado solo si todo está correcto
- Valida que haya items en el carrito
- Valida que haya método de pago seleccionado
- Crea registro de venta en base de datos (transaccional)
- Reduce stock de productos vendidos
- Genera número de factura único
- Libera mesa si estaba asignada
- Genera recibo en PDF
- Muestra modal de confirmación con opción de imprimir
- Limpia el POS para nueva venta
- Registra en activity log

**Subtareas:**
- [ ] Crear botón "Completar Venta"
- [ ] Validar datos antes de completar
- [ ] Crear API route `/api/sales/complete`
- [ ] Iniciar transacción de base de datos
- [ ] Crear registro de Sale
- [ ] Crear registros de SaleItem
- [ ] Reducir stock de productos (update atómico)
- [ ] Crear registros de InventoryLog
- [ ] Generar número de factura único
- [ ] Liberar mesa si aplica
- [ ] Commit de transacción
- [ ] Emitir evento WebSocket 'sale:created'
- [ ] Generar PDF con Puppeteer o PDFKit
- [ ] Mostrar modal de confirmación
- [ ] Limpiar carrito
- [ ] Agregar opción de imprimir
- [ ] Registrar actividad
- [ ] Manejar errores y rollback

**Estimación:** 21 puntos
**Prioridad:** Alta

---

### HU-024: Imprimir Ticket

**Como** cajero
**Quiero** imprimir el ticket de venta
**Para** entregarlo al cliente

**Criterios de Aceptación:**
- Genera ticket en formato térmico (80mm)
- Incluye: logo, nombre restaurante, dirección, teléfono
- Número de factura y fecha
- Lista de items (nombre, cantidad, precio, subtotal)
- Subtotal, descuento, IVA, total
- Método de pago
- Monto recibido y cambio (si aplica)
- Mensaje de agradecimiento
- Opción de imprimir o enviar por email
- Compatible con impresoras térmicas ESC/POS

**Subtareas:**
- [ ] Crear template de ticket con HTML/CSS
- [ ] Implementar generación de PDF térmico
- [ ] Agregar logo y datos del restaurante
- [ ] Incluir todos los datos de la venta
- [ ] Crear función de impresión automática
- [ ] Configurar impresora por defecto
- [ ] Implementar comandos ESC/POS (opcional)
- [ ] Agregar opción de enviar por email
- [ ] Crear vista previa de ticket
- [ ] Permitir reimpresión desde historial

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-025: Cancelar Venta

**Como** cajero con permisos
**Quiero** cancelar una venta registrada
**Para** corregir errores o solicitudes de clientes

**Criterios de Aceptación:**
- Solo usuarios con permiso pueden cancelar
- Solicita confirmación y razón
- Cambia status de venta a CANCELLED
- Restaura stock de productos
- Libera mesa si estaba ocupada
- Registra en activity log
- No permite cancelar ventas antiguas (>24hrs)

**Subtareas:**
- [ ] Agregar botón "Cancelar" en detalle de venta
- [ ] Verificar permiso de usuario
- [ ] Mostrar modal de confirmación
- [ ] Solicitar razón de cancelación
- [ ] Crear API route `/api/sales/:id/cancel`
- [ ] Cambiar status a CANCELLED
- [ ] Iniciar transacción
- [ ] Restaurar stock de productos
- [ ] Crear registros de InventoryLog
- [ ] Liberar mesa si aplica
- [ ] Commit de transacción
- [ ] Registrar actividad con razón
- [ ] Validar que venta no sea antigua
- [ ] Emitir evento WebSocket

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-026: Modo Offline del POS

**Como** cajero
**Quiero** que el POS funcione sin internet
**Para** no interrumpir ventas si hay problemas de conexión

**Criterios de Aceptación:**
- Service Worker cachea productos y categorías
- Permite crear ventas offline
- Guarda ventas en queue local (IndexedDB)
- Sincroniza automáticamente cuando vuelve conexión
- Indica claramente cuando está offline
- Muestra estado de sincronización
- No permite operaciones críticas offline (cancelaciones, reportes)

**Subtareas:**
- [ ] Configurar service worker de Next.js
- [ ] Implementar estrategia de cache para productos
- [ ] Crear queue de ventas pendientes (IndexedDB)
- [ ] Implementar detección de conexión
- [ ] Mostrar indicador de estado offline
- [ ] Crear función de sincronización
- [ ] Agregar botón de sincronizar manualmente
- [ ] Manejar conflictos de sincronización
- [ ] Mostrar progreso de sincronización
- [ ] Deshabilitar funciones no disponibles offline
- [ ] Agregar tests de modo offline

**Estimación:** 21 puntos
**Prioridad:** Baja

---

## Épica 4: Gestión de Clientes

### HU-027: CRUD de Clientes

**Como** administrador
**Quiero** gestionar la base de datos de clientes
**Para** mantener información actualizada de mis clientes

**Criterios de Aceptación:**
- Listar clientes con paginación
- Búsqueda por nombre, email, teléfono
- Crear nuevo cliente con validación
- Email y teléfono únicos
- Editar información del cliente
- Eliminar cliente (soft delete)
- Ver historial de compras del cliente
- Calcular totales: compras, monto gastado, última compra

**Subtareas:**
- [ ] Crear schema Customer en Prisma
- [ ] Crear página `/dashboard/customers`
- [ ] Implementar tabla con TanStack Table
- [ ] Agregar búsqueda con debounce
- [ ] Crear modal de crear/editar cliente
- [ ] Implementar formulario con validación Zod
- [ ] Validar email y teléfono únicos
- [ ] Crear API routes CRUD `/api/customers`
- [ ] Implementar paginación
- [ ] Agregar soft delete
- [ ] Crear página de detalle de cliente
- [ ] Mostrar historial de compras
- [ ] Calcular estadísticas del cliente
- [ ] Agregar confirmación para eliminar

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-028: Crear Cliente Rápido desde POS

**Como** cajero
**Quiero** crear un cliente rápido desde el POS
**Para** no interrumpir el flujo de venta

**Criterios de Aceptación:**
- Botón "+ Nuevo Cliente" en selector de clientes
- Modal con campos esenciales (nombre, teléfono)
- Email opcional
- Validación mínima
- Guarda y selecciona automáticamente
- Cierra modal y regresa a POS

**Subtareas:**
- [ ] Agregar botón en selector de clientes
- [ ] Crear modal compacto
- [ ] Formulario con campos mínimos
- [ ] Validación básica
- [ ] Usar mismo endpoint `/api/customers`
- [ ] Seleccionar cliente creado automáticamente
- [ ] Cerrar modal
- [ ] Agregar al autocomplete inmediatamente

**Estimación:** 5 puntos
**Prioridad:** Media

---

### HU-029: Importar Clientes desde CSV

**Como** administrador
**Quiero** importar clientes desde CSV
**Para** migrar datos de otro sistema

**Criterios de Aceptación:**
- Upload de CSV con columnas: nombre, email, teléfono, dirección
- Preview de datos
- Validación (email único, teléfono válido)
- Muestra errores por fila
- Opción de importar solo válidos o cancelar
- Resumen de importación

**Subtareas:**
- [ ] Crear página `/dashboard/customers/import`
- [ ] Implementar upload de CSV
- [ ] Parsear CSV con papaparse
- [ ] Validar cada fila
- [ ] Mostrar preview en tabla
- [ ] Crear API route `/api/customers/import`
- [ ] Importación transaccional
- [ ] Manejo de duplicados
- [ ] Mostrar resumen
- [ ] Descargar template

**Estimación:** 8 puntos
**Prioridad:** Baja

---

### HU-030: Historial de Compras del Cliente

**Como** administrador
**Quiero** ver el historial de compras de un cliente
**Para** conocer sus preferencias y patrones

**Criterios de Aceptación:**
- Tabla de compras ordenadas por fecha
- Muestra: fecha, items, total, método de pago
- Filtro por rango de fechas
- Total gastado en el período
- Productos más comprados
- Frecuencia de compra
- Última compra

**Subtareas:**
- [ ] Crear sección de historial en detalle de cliente
- [ ] Query de ventas por cliente
- [ ] Implementar tabla de ventas
- [ ] Agregar selector de rango de fechas
- [ ] Calcular total gastado
- [ ] Query de productos más comprados
- [ ] Calcular frecuencia de compra
- [ ] Crear gráfico de compras en el tiempo
- [ ] Agregar exportación de historial

**Estimación:** 8 puntos
**Prioridad:** Baja

---

## Épica 5: Gestión de Mesas

### HU-031: CRUD de Mesas

**Como** administrador
**Quiero** gestionar las mesas del restaurante
**Para** controlar las zonas y capacidades

**Criterios de Aceptación:**
- Listar mesas con número, capacidad, estado
- Crear mesa con número único
- Editar número y capacidad
- Eliminar mesa (solo si no está ocupada)
- Ver ventas asociadas a la mesa
- Generar código QR para la mesa

**Subtareas:**
- [ ] Crear schema Table en Prisma
- [ ] Crear página `/dashboard/tables`
- [ ] Implementar grid de mesas
- [ ] Crear modal de crear/editar mesa
- [ ] Validar número único
- [ ] Crear API routes CRUD `/api/tables`
- [ ] Validar que mesa no esté ocupada antes de eliminar
- [ ] Generar código QR con qrcode
- [ ] Mostrar historial de ventas por mesa
- [ ] Agregar indicador visual de estado

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-032: Mapa Visual de Mesas

**Como** mesero/administrador
**Quiero** ver un mapa visual del estado de las mesas
**Para** saber rápidamente cuáles están disponibles u ocupadas

**Criterios de Aceptación:**
- Vista en grid con tarjetas de mesas
- Código de colores: verde (disponible), rojo (ocupada), amarillo (reservada), gris (limpieza)
- Muestra número de mesa y capacidad
- Click en mesa muestra detalles
- Actualización en tiempo real con WebSocket
- Vista responsive para tablets

**Subtareas:**
- [ ] Crear página `/dashboard/tables/map`
- [ ] Implementar grid responsive de mesas
- [ ] Crear componente TableCard con estados
- [ ] Aplicar colores según estado
- [ ] Agregar iconos y badges
- [ ] Implementar detalle al hacer click
- [ ] Conectar WebSocket para updates
- [ ] Actualizar UI en tiempo real
- [ ] Agregar filtros por estado
- [ ] Optimizar para tablets

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-033: Asignar y Liberar Mesa

**Como** mesero
**Quiero** asignar y liberar mesas manualmente
**Para** controlar el flujo de clientes

**Criterios de Aceptación:**
- Click en mesa disponible la marca como ocupada
- Solicita número de personas
- Permite liberar mesa ocupada
- Confirmación antes de liberar
- Valida si tiene venta activa
- Actualiza en tiempo real para todos los usuarios

**Subtareas:**
- [ ] Implementar click en mesa del mapa
- [ ] Mostrar modal de confirmación
- [ ] Solicitar número de personas
- [ ] Crear API route `/api/tables/:id/assign`
- [ ] Cambiar status a OCCUPIED
- [ ] Crear API route `/api/tables/:id/free`
- [ ] Validar que no tenga venta activa
- [ ] Cambiar status a AVAILABLE
- [ ] Emitir evento WebSocket 'table:updated'
- [ ] Actualizar UI en tiempo real

**Estimación:** 5 puntos
**Prioridad:** Media

---

### HU-034: Transferir Pedido entre Mesas

**Como** mesero
**Quiero** transferir un pedido de una mesa a otra
**Para** acomodar solicitudes de clientes

**Criterios de Aceptación:**
- Botón "Transferir" en detalle de mesa ocupada
- Muestra lista de mesas disponibles
- Selecciona mesa destino
- Transfiere la venta activa
- Libera mesa origen
- Ocupa mesa destino
- Notifica a otros usuarios en tiempo real

**Subtareas:**
- [ ] Agregar botón "Transferir Mesa"
- [ ] Mostrar modal con mesas disponibles
- [ ] Implementar selección de mesa destino
- [ ] Crear API route `/api/tables/transfer`
- [ ] Actualizar sale con nueva tableId
- [ ] Liberar mesa origen (status AVAILABLE)
- [ ] Ocupar mesa destino (status OCCUPIED)
- [ ] Emitir eventos WebSocket
- [ ] Registrar en activity log
- [ ] Mostrar confirmación

**Estimación:** 8 puntos
**Prioridad:** Baja

---

### HU-035: Unir Mesas

**Como** mesero
**Quiero** unir dos o más mesas
**Para** acomodar grupos grandes

**Criterios de Aceptación:**
- Seleccionar múltiples mesas
- Crear mesa virtual con nombre (ej: "Mesa 5-6-7")
- Transfiere capacidades sumadas
- Pedidos se unifican bajo mesa principal
- Al liberar, separa mesas nuevamente
- Estado sincronizado

**Subtareas:**
- [ ] Agregar modo de selección múltiple
- [ ] Mostrar mesas seleccionadas
- [ ] Botón "Unir Mesas"
- [ ] Crear mesa virtual o grupo
- [ ] Sumar capacidades
- [ ] Asociar ventas a mesa principal
- [ ] Crear API route `/api/tables/merge`
- [ ] Implementar lógica de unión
- [ ] Permitir separar mesas
- [ ] Actualizar UI en tiempo real

**Estimación:** 13 puntos
**Prioridad:** Baja

---

### HU-036: Código QR para Pedidos desde Mesa

**Como** administrador
**Quiero** generar códigos QR para cada mesa
**Para** que los clientes puedan ver el menú y pedir desde su teléfono

**Criterios de Aceptación:**
- Genera QR único por mesa
- QR redirige a `/menu/table/:qrCode`
- Cliente escanea y ve menú digital
- Puede agregar productos al carrito
- Envía pedido asociado a la mesa
- Mesero recibe notificación del pedido

**Subtareas:**
- [ ] Generar QR único por mesa con qrcode
- [ ] Guardar qrCode en tabla Table
- [ ] Crear endpoint público `/menu/table/:qrCode`
- [ ] Validar qrCode y obtener mesa
- [ ] Mostrar menú público
- [ ] Permitir agregar al carrito
- [ ] Asociar pedido a mesa
- [ ] Enviar notificación a meseros
- [ ] Agregar botón para descargar/imprimir QR
- [ ] Crear PDF con QR para imprimir

**Estimación:** 13 puntos
**Prioridad:** Baja

---

## Épica 6: Control de Inventario

### HU-037: Registrar Recepción de Mercancía

**Como** encargado de almacén
**Quiero** registrar las recepciones de mercancía
**Para** actualizar el inventario con las compras

**Criterios de Aceptación:**
- Formulario de recepción con número de referencia
- Seleccionar proveedor
- Agregar productos con cantidad y costo unitario
- Calcula subtotal, IVA y total
- Guarda recepción en base de datos
- Incrementa stock de productos
- Registra en logs de inventario
- Genera PDF de recepción

**Subtareas:**
- [ ] Crear schemas Receiving, ReceivingItem en Prisma
- [ ] Crear página `/dashboard/inventory/receivings`
- [ ] Listar recepciones con tabla
- [ ] Crear página `/dashboard/inventory/receivings/new`
- [ ] Implementar selector de proveedor
- [ ] Crear tabla dinámica para agregar items
- [ ] Autocomplete de productos
- [ ] Calcular totales automáticamente
- [ ] Crear API route `/api/inventory/receivings`
- [ ] Implementar transacción de BD
- [ ] Incrementar stock de productos
- [ ] Crear registros de InventoryLog
- [ ] Generar número de referencia único
- [ ] Crear PDF de recepción
- [ ] Agregar validaciones

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-038: Ajustes de Inventario

**Como** administrador
**Quiero** realizar ajustes de inventario
**Para** corregir diferencias de stock

**Criterios de Aceptación:**
- Formulario de ajuste con número de referencia
- Tipos: Daño, Pérdida, Encontrado, Devolución, Corrección
- Agregar productos con cantidad a ajustar (+/-)
- Solicita razón del ajuste
- Actualiza stock según el ajuste
- Registra en logs de inventario
- Genera reporte de ajuste

**Subtareas:**
- [ ] Crear schemas Adjustment, AdjustmentItem en Prisma
- [ ] Crear página `/dashboard/inventory/adjustments`
- [ ] Listar ajustes con tabla
- [ ] Crear página `/dashboard/inventory/adjustments/new`
- [ ] Implementar selector de tipo de ajuste
- [ ] Campo de razón (textarea)
- [ ] Tabla dinámica de items
- [ ] Indicar si suma (+) o resta (-)
- [ ] Crear API route `/api/inventory/adjustments`
- [ ] Validar que producto tenga stock suficiente si resta
- [ ] Actualizar stock de productos
- [ ] Crear registros de InventoryLog
- [ ] Generar reporte PDF
- [ ] Requerir autorización para ajustes grandes

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-039: Historial de Movimientos de Inventario

**Como** administrador
**Quiero** ver el historial completo de movimientos de inventario
**Para** auditar cambios de stock

**Criterios de Aceptación:**
- Lista de movimientos ordenados por fecha (desc)
- Muestra: fecha, producto, tipo (venta/recepción/ajuste), cantidad, usuario
- Filtros por producto, tipo, usuario, fecha
- Muestra stock antes y después del movimiento
- Paginación
- Exportación a Excel

**Subtareas:**
- [ ] Crear schema InventoryLog en Prisma
- [ ] Crear página `/dashboard/inventory/logs`
- [ ] Implementar tabla con filtros
- [ ] Query optimizada con joins
- [ ] Agregar filtros múltiples
- [ ] Selector de rango de fechas
- [ ] Crear API route `/api/inventory/logs`
- [ ] Implementar paginación
- [ ] Mostrar stock antes/después
- [ ] Implementar exportación a Excel
- [ ] Agregar índices en BD para performance

**Estimación:** 8 punts
**Prioridad:** Media

---

### HU-040: Reporte de Valor de Inventario

**Como** administrador
**Quiero** ver el valor total del inventario
**Para** conocer el capital invertido

**Criterios de Aceptación:**
- Muestra valor total del inventario (costo × stock)
- Desglose por categoría
- Filtra por categoría
- Muestra productos con mayor valor
- Muestra productos sin stock
- Exportación a PDF

**Subtareas:**
- [ ] Crear página `/dashboard/inventory/value`
- [ ] Query para calcular valor por producto
- [ ] Agrupar por categoría
- [ ] Crear cards con totales
- [ ] Tabla de productos con valor individual
- [ ] Gráfico de valor por categoría
- [ ] Crear API route `/api/inventory/value`
- [ ] Implementar exportación PDF
- [ ] Agregar filtros
- [ ] Optimizar consultas

**Estimación:** 8 puntos
**Prioridad:** Baja

---

### HU-041: Alertas Automáticas de Stock Bajo

**Como** administrador
**Quiero** recibir alertas automáticas cuando un producto alcance su stock mínimo
**Para** reordenar a tiempo

**Criterios de Aceptación:**
- Cron job diario que revisa stock
- Envía email con lista de productos con stock bajo
- Notificación in-app
- Lista de productos en dashboard
- Configuración del umbral por producto
- Permite desactivar alertas

**Subtareas:**
- [ ] Crear cron job con node-cron
- [ ] Query de productos con stock <= minStock
- [ ] Crear template de email de alerta
- [ ] Configurar envío con Resend
- [ ] Crear notificaciones in-app
- [ ] Widget en dashboard con productos
- [ ] Crear página de configuración de alertas
- [ ] Agregar campo `minStock` en productos
- [ ] Permitir deshabilitar alertas
- [ ] Agregar tests del cron job

**Estimación:** 8 puntos
**Prioridad:** Media

---

## Épica 7: Reportes y Analytics

### HU-042: Dashboard Principal con KPIs

**Como** administrador
**Quiero** ver un dashboard con métricas clave
**Para** monitorear el desempeño del negocio

**Criterios de Aceptación:**
- Cards con KPIs: ventas hoy, ventas semana, ventas mes, total histórico
- Comparación con período anterior (%, flecha ↑↓)
- Ticket promedio
- Total de productos vendidos
- Clientes atendidos hoy
- Actualización en tiempo real (WebSocket opcional)
- Gráfico de ventas últimos 30 días
- Top 5 productos más vendidos
- Últimas 10 ventas

**Subtareas:**
- [ ] Crear página `/dashboard` (ya existe)
- [ ] Crear queries de estadísticas
- [ ] Implementar KPI cards con iconos
- [ ] Calcular comparaciones con período anterior
- [ ] Agregar indicadores visuales (↑↓)
- [ ] Crear API route `/api/reports/dashboard`
- [ ] Implementar gráfico de líneas con Recharts
- [ ] Query de productos más vendidos
- [ ] Tabla de últimas ventas
- [ ] Optimizar queries con agregaciones
- [ ] Cachear datos (opcional)
- [ ] Conectar WebSocket para updates (opcional)

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-043: Reporte de Ventas por Período

**Como** administrador
**Quiero** ver un reporte de ventas por período personalizado
**Para** analizar el desempeño en diferentes rangos de tiempo

**Criterios de Aceptación:**
- Selector de rango de fechas
- Presets: Hoy, Ayer, Esta semana, Este mes, Este año
- Muestra: total de ventas, cantidad de transacciones, ticket promedio
- Gráfico de ventas por día
- Desglose por método de pago
- Desglose por tipo (POS, Online, Delivery)
- Exportación a PDF y Excel

**Subtareas:**
- [ ] Crear página `/dashboard/reports/sales`
- [ ] Implementar selector de fechas con presets
- [ ] Crear queries con filtros de fecha
- [ ] Mostrar tarjetas de KPIs del período
- [ ] Crear gráfico de líneas por día
- [ ] Gráfico de pastel por método de pago
- [ ] Gráfico de pastel por tipo de venta
- [ ] Crear API route `/api/reports/sales`
- [ ] Implementar exportación PDF
- [ ] Implementar exportación Excel
- [ ] Optimizar queries con índices

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-044: Reporte de Productos Más Vendidos

**Como** administrador
**Quiero** ver un reporte de productos más vendidos
**Para** identificar los productos estrella

**Criterios de Aceptación:**
- Selector de rango de fechas
- Tabla con: producto, categoría, cantidad vendida, ingresos generados
- Ordenamiento por cantidad o ingresos
- Top 10, 20, 50 o todos
- Gráfico de barras horizontal
- Filtro por categoría
- Exportación a Excel

**Subtareas:**
- [ ] Crear página `/dashboard/reports/products`
- [ ] Implementar selector de fechas
- [ ] Query de productos con sum de cantidades
- [ ] Implementar tabla con ordenamiento
- [ ] Selector de top N productos
- [ ] Crear gráfico de barras con Recharts
- [ ] Agregar filtro por categoría
- [ ] Crear API route `/api/reports/products`
- [ ] Implementar exportación Excel
- [ ] Optimizar query con agregaciones

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-045: Reporte de Ventas por Empleado

**Como** administrador
**Quiero** ver un reporte de ventas por empleado
**Para** evaluar el desempeño del personal

**Criterios de Aceptación:**
- Selector de rango de fechas
- Tabla con: empleado, cantidad de ventas, total vendido, ticket promedio
- Ordenamiento por total vendido
- Gráfico de barras comparativo
- Desglose por método de pago por empleado
- Filtro por rol (cajero, mesero)
- Exportación a Excel

**Subtareas:**
- [ ] Crear página `/dashboard/reports/employees`
- [ ] Query de ventas agrupadas por cajero
- [ ] Implementar tabla con estadísticas
- [ ] Calcular ticket promedio por empleado
- [ ] Crear gráfico de barras comparativo
- [ ] Agregar desglose por método de pago
- [ ] Crear API route `/api/reports/employees`
- [ ] Implementar filtro por rol
- [ ] Implementar exportación Excel
- [ ] Agregar comparación con mes anterior

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-046: Reporte de Ingresos vs Gastos

**Como** administrador
**Quiero** ver un reporte financiero de ingresos y gastos
**Para** analizar la rentabilidad

**Criterios de Aceptación:**
- Selector de rango de fechas
- Total de ingresos (ventas)
- Total de gastos por categoría
- Utilidad bruta (ingresos - gastos)
- Gráfico de líneas de ingresos vs gastos
- Gráfico de pastel de gastos por categoría
- Comparación con período anterior
- Exportación a PDF

**Subtareas:**
- [ ] Crear página `/dashboard/reports/financial`
- [ ] Query de total de ingresos
- [ ] Query de gastos agrupados por categoría
- [ ] Calcular utilidad bruta
- [ ] Crear cards de KPIs
- [ ] Gráfico de líneas de ingresos y gastos
- [ ] Gráfico de pastel de gastos
- [ ] Crear API route `/api/reports/financial`
- [ ] Calcular comparaciones
- [ ] Implementar exportación PDF
- [ ] Agregar margen de utilidad (%)

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-047: Reporte de Ventas por Hora

**Como** administrador
**Quiero** ver las ventas agrupadas por hora del día
**Para** identificar las horas pico

**Criterios de Aceptación:**
- Selector de fecha (un día específico)
- Gráfico de barras con ventas por hora (0-23)
- Tabla con hora, cantidad de ventas, total
- Identifica hora pico
- Comparación con promedio semanal
- Útil para planificar turnos del personal

**Subtareas:**
- [ ] Crear página `/dashboard/reports/hourly`
- [ ] Query de ventas agrupadas por hora
- [ ] Extraer hora de timestamp
- [ ] Crear gráfico de barras por hora
- [ ] Implementar tabla de detalles
- [ ] Identificar y destacar hora pico
- [ ] Calcular promedio semanal
- [ ] Crear API route `/api/reports/hourly`
- [ ] Agregar comparación con día anterior

**Estimación:** 8 puntos
**Prioridad:** Baja

---

### HU-048: Exportación de Reportes

**Como** administrador
**Quiero** exportar los reportes en diferentes formatos
**Para** compartirlos o trabajar con los datos externamente

**Criterios de Aceptación:**
- Botón "Exportar" en cada reporte
- Opciones: PDF, Excel (XLSX), CSV
- PDF incluye gráficos e imágenes
- Excel incluye datos tabulares formateados
- CSV para importar en otras herramientas
- Nombre de archivo con fecha y tipo de reporte

**Subtareas:**
- [ ] Implementar exportación PDF con Puppeteer
- [ ] Crear templates HTML de reportes
- [ ] Implementar exportación Excel con ExcelJS
- [ ] Formatear hojas de Excel (headers, estilos)
- [ ] Implementar exportación CSV con papaparse
- [ ] Agregar botón de exportar con menú
- [ ] Generar nombres de archivo dinámicos
- [ ] Aplicar filtros activos a exportación
- [ ] Agregar loading state durante exportación
- [ ] Manejar errores de generación

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-049: Envío Automático de Reportes por Email

**Como** administrador
**Quiero** recibir reportes automáticos por email
**Para** estar informado sin ingresar al sistema

**Criterios de Aceptación:**
- Configuración de reportes programados
- Frecuencia: Diario, Semanal, Mensual
- Seleccionar tipo de reporte
- Lista de destinatarios
- Envío automático en hora configurada
- Email incluye resumen y PDF adjunto

**Subtareas:**
- [ ] Crear página `/dashboard/settings/scheduled-reports`
- [ ] Formulario de configuración
- [ ] Selección de frecuencia y hora
- [ ] Lista de destinatarios (emails)
- [ ] Crear schema de ScheduledReport en Prisma
- [ ] Implementar cron job para envío
- [ ] Generar reporte según configuración
- [ ] Crear template de email con resumen
- [ ] Adjuntar PDF al email
- [ ] Configurar envío con Resend
- [ ] Registrar envíos en log
- [ ] Permitir pausar/reanudar reporte

**Estimación:** 13 puntos
**Prioridad:** Baja

---

## Épica 8: Pedidos Online

### HU-050: Catálogo Público de Productos

**Como** cliente visitante
**Quiero** ver el menú del restaurante online
**Para** conocer los productos disponibles

**Criterios de Aceptación:**
- Página pública en `/menu`
- Grid de productos con imagen, nombre, precio, descripción
- Filtro por categoría
- Búsqueda de productos
- Responsive para móviles
- Productos activos e con stock
- SEO optimizado (SSG/ISR)

**Subtareas:**
- [ ] Crear página `/menu` (SSG o ISR)
- [ ] Query de productos activos con stock
- [ ] Implementar grid responsive
- [ ] Crear cards de productos atractivas
- [ ] Agregar filtro por categorías
- [ ] Implementar búsqueda con debounce
- [ ] Optimizar imágenes con Next/Image
- [ ] Agregar meta tags para SEO
- [ ] Generar sitemap.xml
- [ ] Implementar skeleton loaders
- [ ] Agregar lazy loading

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-051: Agregar Productos al Carrito Online

**Como** cliente
**Quiero** agregar productos al carrito
**Para** preparar mi pedido

**Criterios de Aceptación:**
- Botón "Agregar al carrito" en cada producto
- Modal para seleccionar cantidad y tamaño
- Permite agregar notas al producto
- Validar stock disponible
- Feedback visual al agregar
- Badge en icono de carrito con cantidad
- Carrito persistente en localStorage

**Subtareas:**
- [ ] Crear store Zustand para carrito online
- [ ] Botón "Agregar al carrito"
- [ ] Modal de configuración de producto
- [ ] Selector de cantidad
- [ ] Selector de tamaño/precio
- [ ] Campo de notas
- [ ] Validar stock al agregar
- [ ] Actualizar badge de carrito
- [ ] Persistir carrito en localStorage
- [ ] Animación al agregar
- [ ] Sincronizar con BD si está autenticado

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-052: Carrito de Compras Online

**Como** cliente
**Quiero** ver y modificar mi carrito
**Para** revisar mi pedido antes de pagar

**Criterios de Aceptación:**
- Página `/cart` con productos agregados
- Muestra: imagen, nombre, tamaño, precio, cantidad, subtotal
- Permite modificar cantidad
- Permite eliminar items
- Muestra subtotal, delivery y total
- Botón "Continuar comprando"
- Botón "Proceder al checkout"
- Carrito vacío muestra mensaje y CTA

**Subtareas:**
- [ ] Crear página `/cart`
- [ ] Listar items del carrito
- [ ] Implementar botones +/-
- [ ] Implementar eliminar item
- [ ] Calcular subtotal, delivery, total
- [ ] Mostrar resumen de costos
- [ ] Agregar código de cupón (placeholder)
- [ ] Botón continuar comprando (link a /menu)
- [ ] Botón proceder al checkout
- [ ] Manejar carrito vacío
- [ ] Persistir cambios en localStorage
- [ ] Validar stock antes de checkout

**Estimación:** 8 puntos
**Prioridad:** Alta

---

### HU-053: Checkout y Datos de Entrega

**Como** cliente
**Quiero** ingresar mis datos de entrega
**Para** recibir mi pedido

**Criterios de Aceptación:**
- Página `/checkout`
- Formulario: nombre, email, teléfono, dirección, notas
- Validación de campos requeridos
- Opción: Entrega a domicilio o Recoger en tienda
- Si es delivery, calcula costo según zona
- Si es pickup, muestra dirección del restaurante
- Permite seleccionar hora de entrega
- Permite aplicar código de cupón
- Resumen del pedido visible
- Botón "Continuar al pago"

**Subtareas:**
- [ ] Crear página `/checkout`
- [ ] Implementar formulario con React Hook Form
- [ ] Validación con Zod
- [ ] Radio buttons para tipo de entrega
- [ ] Calcular costo de delivery según zona
- [ ] Mostrar dirección del restaurante si pickup
- [ ] Selector de fecha y hora de entrega
- [ ] Campo de código de cupón
- [ ] Validar cupón con API
- [ ] Aplicar descuento del cupón
- [ ] Mostrar resumen del pedido
- [ ] Guardar datos en store
- [ ] Botón continuar al pago

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-054: Integración con Stripe Checkout

**Como** cliente
**Quiero** pagar mi pedido con tarjeta de forma segura
**Para** completar mi compra

**Criterios de Aceptación:**
- Redirige a Stripe Checkout
- Muestra resumen del pedido en Stripe
- Soporta tarjetas de crédito/débito
- Redirige a página de éxito tras pago exitoso
- Redirige a página de error si pago falla
- Usa webhooks para confirmar pago

**Subtareas:**
- [ ] Configurar Stripe account
- [ ] Instalar @stripe/stripe-js
- [ ] Crear API route `/api/checkout/create-session`
- [ ] Crear PaymentIntent con monto total
- [ ] Incluir metadata (items, cliente, dirección)
- [ ] Redirigir a Stripe Checkout
- [ ] Crear página de éxito `/order/success`
- [ ] Crear página de cancelación `/order/cancel`
- [ ] Configurar webhook `/api/webhooks/stripe`
- [ ] Verificar signature del webhook
- [ ] Manejar evento `checkout.session.completed`
- [ ] Crear pedido en BD tras confirmación
- [ ] Enviar email de confirmación
- [ ] Limpiar carrito

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-055: Confirmación de Pedido y Tracking

**Como** cliente
**Quiero** recibir confirmación de mi pedido
**Para** estar seguro de que fue recibido

**Criterios de Aceptación:**
- Página de confirmación con número de pedido
- Muestra resumen completo del pedido
- Estado: Recibido, Preparando, En camino, Entregado
- Timeline visual del estado
- Tiempo estimado de entrega
- Email de confirmación con detalles
- Link para rastrear pedido

**Subtareas:**
- [ ] Crear página `/order/:id`
- [ ] Generar número de pedido único
- [ ] Query de pedido con detalles
- [ ] Mostrar resumen completo
- [ ] Implementar timeline de estados
- [ ] Calcular tiempo estimado
- [ ] Crear template de email de confirmación
- [ ] Enviar email con Resend
- [ ] Incluir link de tracking
- [ ] Actualizar automáticamente con polling o WebSocket
- [ ] Permitir cancelación (tiempo limitado)

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-056: Panel de Gestión de Pedidos Online

**Como** administrador
**Quiero** gestionar los pedidos online
**Para** procesarlos y actualizarlos

**Criterios de Aceptación:**
- Página `/dashboard/online-orders`
- Lista de pedidos con filtros por estado
- Muestra: número, cliente, total, estado, método de entrega, fecha
- Notificación sonora al recibir nuevo pedido
- Click en pedido muestra detalles
- Permite cambiar estado del pedido
- Opciones: Confirmar, Preparando, Listo, En camino, Entregado, Cancelar
- Envía notificación al cliente al cambiar estado
- Tiempo transcurrido desde pedido
- Impresión de orden para cocina

**Subtareas:**
- [ ] Crear página `/dashboard/online-orders`
- [ ] Implementar tabla con filtros de estado
- [ ] Query de pedidos online con joins
- [ ] Conectar WebSocket para nuevos pedidos
- [ ] Reproducir sonido al recibir pedido
- [ ] Crear modal de detalle de pedido
- [ ] Implementar selector de estado
- [ ] Crear API route `/api/orders/:id/status`
- [ ] Actualizar estado en BD
- [ ] Emitir evento WebSocket al cliente
- [ ] Enviar email/SMS de actualización
- [ ] Mostrar tiempo transcurrido
- [ ] Botón imprimir orden de cocina
- [ ] Permitir cancelar con razón

**Estimación:** 13 puntos
**Prioridad:** Alta

---

### HU-057: Sistema de Cupones de Descuento

**Como** administrador
**Quiero** crear y gestionar cupones de descuento
**Para** ofrecer promociones a clientes

**Criterios de Aceptación:**
- CRUD de cupones
- Código único
- Tipo: Porcentaje, Monto fijo, Envío gratis
- Valor del descuento
- Compra mínima requerida
- Límite de usos (total o por usuario)
- Fecha de inicio y fin
- Activo/inactivo
- Cliente puede aplicar cupón en checkout
- Valida cupón al aplicar

**Subtareas:**
- [ ] Crear schema Coupon en Prisma
- [ ] Crear página `/dashboard/coupons`
- [ ] Implementar tabla de cupones
- [ ] Crear modal de crear/editar cupón
- [ ] Formulario con todos los campos
- [ ] Validar código único
- [ ] Crear API routes CRUD `/api/coupons`
- [ ] Implementar campo de cupón en checkout
- [ ] Crear API route `/api/coupons/validate`
- [ ] Validar código, fechas, límites, compra mínima
- [ ] Aplicar descuento al total
- [ ] Incrementar contador de usos
- [ ] Mostrar cupón aplicado en resumen

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-058: Notificaciones Push para Pedidos

**Como** cliente
**Quiero** recibir notificaciones push del estado de mi pedido
**Para** estar informado sin revisar constantemente

**Criterios de Aceptación:**
- Solicita permiso de notificaciones
- Envía push al cambiar estado del pedido
- Título y mensaje descriptivos
- Click en notificación abre tracking
- Funciona en PWA

**Subtareas:**
- [ ] Configurar service worker para push
- [ ] Solicitar permiso de notificaciones
- [ ] Guardar subscription en BD
- [ ] Crear schema PushSubscription
- [ ] Implementar envío de push desde servidor
- [ ] Usar web-push library
- [ ] Enviar push al cambiar estado
- [ ] Personalizar mensaje según estado
- [ ] Agregar acción de abrir tracking
- [ ] Manejar click en notificación
- [ ] Testear en diferentes navegadores

**Estimación:** 13 puntos
**Prioridad:** Baja

---

## Épica 9: Sitio Web Público

### HU-059: Landing Page del Restaurante

**Como** visitante
**Quiero** ver una página de inicio atractiva
**Para** conocer el restaurante

**Criterios de Aceptación:**
- Hero section con imagen de fondo y CTA
- Sección "Acerca de nosotros"
- Galería de platos destacados
- Testimonios de clientes
- Call to action para ver menú o pedir
- Footer con enlaces y redes sociales
- Responsive y optimizada (SSG)
- SEO optimizado

**Subtareas:**
- [ ] Crear página `/` (SSG)
- [ ] Implementar hero section
- [ ] Agregar sección "Acerca de"
- [ ] Crear galería con imágenes optimizadas
- [ ] Implementar slider de testimonios
- [ ] Agregar CTAs estratégicos
- [ ] Crear footer con enlaces
- [ ] Agregar iconos de redes sociales
- [ ] Optimizar para móviles
- [ ] Agregar meta tags SEO
- [ ] Implementar schema.org markup
- [ ] Agregar animaciones con Framer Motion
- [ ] Optimizar Core Web Vitals

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-060: Página "Acerca de"

**Como** visitante
**Quiero** conocer la historia del restaurante
**Para** conectar con la marca

**Criterios de Aceptación:**
- Página `/about`
- Historia del restaurante
- Equipo (fotos y descripción)
- Valores y misión
- Imágenes del local
- SEO optimizado (SSG)

**Subtareas:**
- [ ] Crear página `/about` (SSG)
- [ ] Implementar sección de historia
- [ ] Agregar galería del equipo
- [ ] Sección de valores
- [ ] Agregar imágenes del local
- [ ] Optimizar para SEO
- [ ] Responsive design

**Estimación:** 5 puntos
**Prioridad:** Baja

---

### HU-061: Formulario de Contacto

**Como** visitante
**Quiero** enviar un mensaje al restaurante
**Para** hacer consultas o reservas

**Criterios de Aceptación:**
- Página `/contact`
- Formulario: nombre, email, teléfono, mensaje
- Validación de campos
- Envía email al restaurante
- Copia del mensaje al cliente
- Muestra mapa con ubicación
- Datos de contacto (dirección, teléfono, email)

**Subtareas:**
- [ ] Crear página `/contact`
- [ ] Implementar formulario con validación
- [ ] Crear API route `/api/contact`
- [ ] Validar datos con Zod
- [ ] Implementar envío de email
- [ ] Template de email de contacto
- [ ] Enviar copia al cliente
- [ ] Integrar Google Maps
- [ ] Mostrar datos de contacto
- [ ] Agregar captcha (opcional)
- [ ] Mostrar mensaje de éxito

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-062: FAQ (Preguntas Frecuentes)

**Como** visitante
**Quiero** encontrar respuestas a preguntas comunes
**Para** resolver mis dudas rápidamente

**Criterios de Aceptación:**
- Página `/faq`
- Lista de preguntas con respuestas
- Acordeón expandible
- Categorías: Pedidos, Entrega, Pagos, Productos
- Búsqueda de preguntas
- SEO optimizado

**Subtareas:**
- [ ] Crear página `/faq` (SSG)
- [ ] Implementar componente de acordeón
- [ ] Organizar por categorías
- [ ] Agregar preguntas y respuestas
- [ ] Implementar búsqueda
- [ ] Optimizar para SEO
- [ ] Responsive design

**Estimación:** 5 puntos
**Prioridad:** Baja

---

### HU-063: Newsletter

**Como** administrador
**Quiero** capturar emails de clientes interesados
**Para** enviarles promociones y novedades

**Criterios de Aceptación:**
- Formulario de suscripción en footer
- Solo requiere email
- Validación de email válido
- Double opt-in (envía email de confirmación)
- Guarda en base de datos
- Integración con servicio de email marketing (opcional)

**Subtareas:**
- [ ] Crear schema Newsletter en Prisma
- [ ] Implementar formulario en footer
- [ ] Validar email
- [ ] Crear API route `/api/newsletter/subscribe`
- [ ] Generar token de confirmación
- [ ] Enviar email de confirmación
- [ ] Crear página `/newsletter/confirm/:token`
- [ ] Activar suscripción al confirmar
- [ ] Mostrar mensaje de éxito
- [ ] Permitir darse de baja
- [ ] Integrar con Mailchimp/SendGrid (opcional)

**Estimación:** 8 puntos
**Prioridad:** Baja

---

### HU-064: Política de Privacidad y Términos

**Como** visitante
**Quiero** leer la política de privacidad y términos
**Para** conocer mis derechos y responsabilidades

**Criterios de Aceptación:**
- Página `/privacy` con política de privacidad
- Página `/terms` con términos y condiciones
- Lenguaje claro
- Cumple con GDPR/leyes locales
- Links en footer
- SEO optimizado (SSG)

**Subtareas:**
- [ ] Crear página `/privacy` (SSG)
- [ ] Redactar política de privacidad
- [ ] Crear página `/terms` (SSG)
- [ ] Redactar términos y condiciones
- [ ] Formatear contenido con markdown
- [ ] Agregar links en footer
- [ ] Revisar cumplimiento legal
- [ ] Optimizar para SEO

**Estimación:** 5 puntos
**Prioridad:** Media

---

### HU-065: PWA (Progressive Web App)

**Como** usuario
**Quiero** instalar el sitio como app
**Para** acceso rápido desde mi dispositivo

**Criterios de Aceptación:**
- Manifiesto web configurado
- Iconos en diferentes tamaños
- Service worker para cache
- Instalable en dispositivos móviles y desktop
- Splash screen personalizado
- Funciona offline (básico)
- Actualización automática

**Subtareas:**
- [ ] Crear manifest.json
- [ ] Generar iconos en múltiples tamaños
- [ ] Configurar service worker
- [ ] Implementar estrategia de cache
- [ ] Cache de assets estáticos
- [ ] Cache de productos (opcional)
- [ ] Configurar splash screen
- [ ] Agregar meta tags para PWA
- [ ] Implementar prompt de instalación
- [ ] Detectar actualizaciones
- [ ] Notificar al usuario de updates
- [ ] Testear en iOS y Android

**Estimación:** 13 puntos
**Prioridad:** Baja

---

### HU-066: Multiidioma (i18n)

**Como** visitante internacional
**Quiero** ver el sitio en mi idioma
**Para** entender mejor el contenido

**Criterios de Aceptación:**
- Soporta Español e Inglés
- Selector de idioma en navbar
- Detecta idioma del navegador
- Traduce interfaz completa
- Traduce productos (descripción)
- URLs con prefijo de idioma (/es, /en)
- SEO optimizado por idioma

**Subtareas:**
- [ ] Instalar next-intl o similar
- [ ] Configurar locales (es, en)
- [ ] Crear archivos de traducción JSON
- [ ] Traducir todas las strings de UI
- [ ] Implementar selector de idioma
- [ ] Detectar idioma del navegador
- [ ] Configurar rutas con prefijo
- [ ] Traducir meta tags SEO
- [ ] Agregar hreflang tags
- [ ] Formatear fechas según locale
- [ ] Formatear moneda según locale
- [ ] Traducir emails
- [ ] Permitir productos multiidioma (opcional)

**Estimación:** 13 puntos
**Prioridad:** Baja

---

## Épica 10: Configuración del Sistema

### HU-067: Configuración General

**Como** administrador
**Quiero** configurar los datos generales del sistema
**Para** personalizar el restaurante

**Criterios de Aceptación:**
- Página `/dashboard/settings/general`
- Nombre del restaurante
- Logo y favicon
- Dirección, teléfono, email
- Horarios de atención
- Redes sociales
- Zona horaria
- Formato de fecha
- Moneda
- Guarda en base de datos (tabla settings)

**Subtareas:**
- [ ] Crear schema Setting en Prisma
- [ ] Crear página `/dashboard/settings/general`
- [ ] Implementar formulario con tabs
- [ ] Upload de logo con preview
- [ ] Upload de favicon
- [ ] Campos de datos de contacto
- [ ] Campo de horarios (JSON)
- [ ] Campos de redes sociales
- [ ] Selector de timezone
- [ ] Selector de formato de fecha
- [ ] Selector de moneda
- [ ] Crear API route `/api/settings`
- [ ] Validar configuraciones
- [ ] Guardar en BD como key-value JSON
- [ ] Cargar configuración globalmente

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-068: Configuración del POS

**Como** administrador
**Quiero** configurar parámetros del POS
**Para** adaptarlo a mi operación

**Criterios de Aceptación:**
- Página `/dashboard/settings/pos`
- Tasa de IVA (%)
- Método de pago por defecto
- Auto-impresión de tickets
- Nombre de impresora
- Texto de pie de ticket
- Permitir ventas sin cliente
- Permitir descuentos sin autorización
- Habilitar/deshabilitar hold orders

**Subtareas:**
- [ ] Crear sección POS en settings
- [ ] Campo de tasa de IVA
- [ ] Radio buttons para método de pago default
- [ ] Checkbox de auto-impresión
- [ ] Selector de impresora
- [ ] Textarea para pie de ticket
- [ ] Checkboxes de permisos
- [ ] Guardar en tabla settings
- [ ] Cargar configuración en POS
- [ ] Aplicar tasa de IVA dinámica

**Estimación:** 5 puntos
**Prioridad:** Media

---

### HU-069: Configuración de Inventario

**Como** administrador
**Quiero** configurar alertas de inventario
**Para** automatizar notificaciones

**Criterios de Aceptación:**
- Página `/dashboard/settings/inventory`
- Umbral de stock bajo global (default para productos)
- Habilitar/deshabilitar alertas
- Email para recibir alertas
- Frecuencia de emails (diario, semanal)
- Hora de envío
- Habilitar notificaciones in-app

**Subtareas:**
- [ ] Crear sección Inventory en settings
- [ ] Campo de umbral de stock bajo
- [ ] Checkbox de habilitar alertas
- [ ] Campo de email para alertas
- [ ] Selector de frecuencia
- [ ] Selector de hora
- [ ] Checkbox de notificaciones in-app
- [ ] Guardar configuración
- [ ] Usar configuración en cron job

**Estimación:** 5 puntos
**Prioridad:** Baja

---

### HU-070: Configuración de Emails

**Como** administrador
**Quiero** configurar el envío de emails
**Para** usar mi propio servicio

**Criterios de Aceptación:**
- Página `/dashboard/settings/emails`
- Proveedor: Resend, SMTP personalizado
- Email "From" (remitente)
- Credenciales SMTP (si aplica)
- Botón "Enviar email de prueba"
- Valida conexión
- Templates de emails editables (opcional)

**Subtareas:**
- [ ] Crear sección Emails en settings
- [ ] Selector de proveedor
- [ ] Campo de email remitente
- [ ] Campos de configuración SMTP
- [ ] Validar formato de email
- [ ] Crear API route `/api/settings/emails/test`
- [ ] Implementar envío de email de prueba
- [ ] Mostrar resultado de prueba
- [ ] Guardar configuración
- [ ] Usar configuración en envíos
- [ ] Editor de templates (opcional)

**Estimación:** 8 puntos
**Prioridad:** Baja

---

### HU-071: Configuración de Pagos (Stripe)

**Como** administrador
**Quiero** configurar mis claves de Stripe
**Para** recibir pagos online

**Criterios de Aceptación:**
- Página `/dashboard/settings/payments`
- Habilitar/deshabilitar pagos online
- Stripe Publishable Key
- Stripe Secret Key
- Stripe Webhook Secret
- Botón "Probar conexión"
- Modo test/producción
- Instrucciones de configuración

**Subtareas:**
- [ ] Crear sección Payments en settings
- [ ] Checkbox de habilitar pagos online
- [ ] Campos de claves de Stripe
- [ ] Input de webhook secret
- [ ] Selector de modo (test/live)
- [ ] Crear API route `/api/settings/payments/test`
- [ ] Validar claves con Stripe API
- [ ] Mostrar resultado de validación
- [ ] Guardar configuración encriptada
- [ ] Agregar instrucciones de setup
- [ ] Link a documentación de Stripe

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-072: Configuración de Delivery

**Como** administrador
**Quiero** configurar opciones de entrega
**Para** ofrecer delivery a clientes

**Criterios de Aceptación:**
- Página `/dashboard/settings/delivery`
- Habilitar/deshabilitar delivery
- Costo fijo de delivery
- Compra mínima para delivery gratis
- Radio de entrega (km)
- Tiempo estimado de entrega (min)
- Zonas de entrega con costos personalizados (avanzado)

**Subtareas:**
- [ ] Crear sección Delivery en settings
- [ ] Checkbox de habilitar delivery
- [ ] Campo de costo de delivery
- [ ] Campo de compra mínima
- [ ] Campo de radio de entrega
- [ ] Campo de tiempo estimado
- [ ] Tabla de zonas con costos (avanzado)
- [ ] Guardar configuración
- [ ] Aplicar en checkout
- [ ] Calcular costo dinámicamente

**Estimación:** 8 puntos
**Prioridad:** Media

---

### HU-073: Gestión de Backups

**Como** administrador
**Quiero** crear y gestionar backups de la base de datos
**Para** proteger mis datos

**Criterios de Aceptación:**
- Página `/dashboard/settings/backups`
- Botón "Crear backup ahora"
- Lista de backups con fecha y tamaño
- Descargar backup
- Eliminar backup
- Restaurar desde backup (con confirmación)
- Programar backups automáticos
- Retención: últimos 7 días

**Subtareas:**
- [ ] Crear página `/dashboard/settings/backups`
- [ ] Implementar creación de backup manual
- [ ] Usar pg_dump para PostgreSQL
- [ ] Guardar backups en almacenamiento
- [ ] Listar backups disponibles
- [ ] Implementar descarga de backup
- [ ] Implementar eliminación de backup
- [ ] Implementar restauración (psql)
- [ ] Agregar confirmación para restaurar
- [ ] Configurar cron job para backups automáticos
- [ ] Implementar política de retención
- [ ] Mostrar progreso de operaciones

**Estimación:** 13 puntos
**Prioridad:** Media

---

### HU-074: Logs del Sistema

**Como** desarrollador/admin
**Quiero** ver los logs del sistema
**Para** diagnosticar errores

**Criterios de Aceptación:**
- Página `/dashboard/settings/logs`
- Lista de logs con timestamp, nivel, mensaje
- Niveles: Error, Warning, Info, Debug
- Filtro por nivel
- Búsqueda por mensaje
- Paginación
- Descarga de logs
- Integración con Sentry para errores críticos

**Subtareas:**
- [ ] Configurar Winston o Pino para logging
- [ ] Implementar niveles de log
- [ ] Guardar logs en archivo o BD
- [ ] Crear página `/dashboard/settings/logs`
- [ ] Query de logs con filtros
- [ ] Implementar tabla de logs
- [ ] Agregar filtros por nivel y fecha
- [ ] Implementar búsqueda
- [ ] Implementar descarga de logs
- [ ] Configurar Sentry para errores
- [ ] Integrar Sentry en app
- [ ] Mostrar errores de Sentry

**Estimación:** 8 puntos
**Prioridad:** Baja

---

## Resumen de Estimación

### Por Épica

| Épica | Cantidad de HU | Puntos Totales |
|-------|----------------|----------------|
| 1. Autenticación y Usuarios | 7 | 55 |
| 2. Catálogo de Productos | 5 | 52 |
| 3. Punto de Venta (POS) | 14 | 156 |
| 4. Gestión de Clientes | 4 | 34 |
| 5. Gestión de Mesas | 6 | 55 |
| 6. Control de Inventario | 5 | 50 |
| 7. Reportes y Analytics | 8 | 84 |
| 8. Pedidos Online | 9 | 109 |
| 9. Sitio Web Público | 8 | 70 |
| 10. Configuración del Sistema | 8 | 70 |
| **TOTAL** | **74 HU** | **735 puntos** |

### Estimación de Tiempo

- **Velocidad promedio**: 13-21 puntos por sprint (2 semanas)
- **Duración estimada**: 35-56 sprints ≈ **18-28 meses**
- **Equipo recomendado**: 3-4 desarrolladores full-stack

### Priorización Sugerida

#### MVP (Mínimo Producto Viable) - ~200 puntos

1. Autenticación básica (HU-001, HU-002, HU-004, HU-005)
2. Productos y categorías (HU-008, HU-009)
3. POS completo (HU-013 a HU-023)
4. Reportes básicos (HU-042)
5. Clientes (HU-027)

#### Fase 2 - ~250 puntos

6. Inventario (HU-037 a HU-041)
7. Mesas (HU-031 a HU-033)
8. Reportes avanzados (HU-043 a HU-046)
9. Configuración (HU-067, HU-068)

#### Fase 3 - ~285 puntos

10. Pedidos online completo (HU-050 a HU-056)
11. Sitio público (HU-059 a HU-064)
12. Features avanzadas restantes

---

## Leyenda

- **Estimación en Puntos de Historia (Story Points)**:
  - 1-3: Muy simple (< 4 horas)
  - 5: Simple (< 1 día)
  - 8: Medio (1-2 días)
  - 13: Complejo (3-5 días)
  - 21: Muy complejo (1-2 semanas)

- **Prioridad**:
  - Alta: Crítico para MVP
  - Media: Importante para producto completo
  - Baja: Nice to have o mejoras

---

**Documento creado el:** 2026-01-12
**Versión:** 1.0
**Proyecto:** Sistema POS para Restaurante - Next.js 14

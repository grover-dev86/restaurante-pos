// Esta línea indica que este componente se ejecuta en el navegador del usuario
'use client'

import { useState } from 'react'

interface ProductoBase {
	id: number
	nombre: string
	precio: number
}

interface Producto extends ProductoBase {
	descripcion: string
	categoria: string
}

interface ItemCarrito extends ProductoBase {
	cantidad: number
	subtotal: number
}

interface Categoria {
	id: string
	nombre: string
	emoji: string
}

function ProductPage() {

	const [busqueda, setBusqueda] = useState('')
	const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas')
	const [carrito, setCarrito] = useState<ItemCarrito[]>([])
	const [mostrarCarrito, setMostrarCarrito] = useState(false)
	
	// Datos de prueba (más adelante vendrán de la base de datos)
	const productos: Producto[] = [
		{
			id: 1,
			nombre: 'Pizza Margarita',
			precio: 10.50,
			descripcion: 'Deliciosa pizza con queso mozzarella',
			categoria: 'pizzas'
		},
				{
			id: 2,
			nombre: 'Hamburguesa Clásica',
			precio: 8,
			descripcion: 'Deliciosa pizza con queso mozzarella',
			categoria: 'comida'
		},
		{
			id: 3,
			nombre: 'Tacos al Pastor',
			precio: 5.50,
			descripcion: 'Tres tacos con carne al pastor',
			categoria: 'comida'
		},
		{
			id: 4,
			nombre: 'Pizza Pepperoni',
			precio: 12.00,
			descripcion: 'Pizza con pepperoni y extra queso',
			categoria: 'pizzas'
		},
		{
			id: 5,
			nombre: 'Ensalada César',
			precio: 7.50,
			descripcion: 'Ensalada fresca con aderezo césar',
			categoria: 'ensaladas'
		}
	]

	// definimos las categorias disponibles
	const categorias: Categoria[] = [
		{id: 'todas', nombre: 'Todas', emoji: '📦'},
		{id: 'pizzas', nombre: 'Pizzas', emoji: '🍕'},
		{id: 'comida', nombre: 'Comida', emoji: '🍔'},
		{id: 'ensaladas', nombre: 'Ensaladas', emoji: '🥗'},
	]

	// 🆕 NUEVO: Filtrar productos según lo que escriba el usuario
	const productosFiltrados = productos.filter(producto => {
		// Convertimos todo a minúsculas para que no importe mayúsculas/minúsculas
		const nombreMinusculas = producto.nombre.toLowerCase()
		const busquedaMinusculas = busqueda.toLowerCase()
		const cumpleBusqueda = nombreMinusculas.includes(busquedaMinusculas)
		const cumpleCategoria = categoriaSeleccionada === 'todas' || producto.categoria === categoriaSeleccionada

		// Se deben cumplir ambos filtros
		return cumpleBusqueda && cumpleCategoria
	})

	// =================================================
	// 🛒 FUNCIONES DEL CARRITO
	// =================================================

	const agregarAlCarrito = (producto: Producto) => {
		// Buscar si el producto existe en el carrito
		const productoExiste = carrito.find(item => item.id === producto.id)

		if (productoExiste) {
			// Si ya existe, aumentar la cantidad
			const carritoActualizado = carrito.map(item =>
				item.id === producto.id
					? {
						...item,
						cantidad: item.cantidad + 1,
						subtotal: (item.cantidad + 1) * item.precio
					}
					: item
			)
			setCarrito(carritoActualizado)
		} else {
			// Si no existe, agregarlo como nuevo
			const nuevoItem: ItemCarrito = {
				...producto,  // ← Copia: id, nombre, precio, descripcion, categoria
				cantidad: 1,	// ← Agrega cantidad
				subtotal: producto.precio	// ← Agrega cantidad
			}
			setCarrito([...carrito, nuevoItem])
		}
	}

	const aumentarCantidad = (id: number) => {
		// 🎓 EXPLICACIÓN:
		// 1. Recorremos todos los items del carrito
		// 2. Si encontramos el que queremos (por id), le sumamos 1
		// 3. Recalculamos el subtotal
		// 4. Los demás items quedan igual
		const carritoActualizado = carrito.map(item => (
			// Compara el id del producto que está recorriendo el .map() (conocido como item.id) con el id que se recibe al hacer clic en el botón +
			item.id === id
				? {
					...item,
					cantidad: item.cantidad + 1,
					subtotal: (item.cantidad + 1) * item.precio
				}
				: item
		))
		setCarrito(carritoActualizado)
	}

	const disminuirCantidad = (id: number) => {
		const carritoActualizado = carrito.map(item => (
		item.id === id
			? {
				...item,
				cantidad: item.cantidad - 1,
				subtotal: (item.cantidad - 1) * item.precio
			}
			: item
		))
		// Filtrar items con cantidad > 0
		const carritoFiltrado = carritoActualizado.filter(item => item.cantidad > 0)
		setCarrito(carritoFiltrado)
	}

	const eliminarDelCarrito = (id: number) => {
		const carritoActualizado = carrito.filter(item => item.id !== id)
		setCarrito(carritoActualizado)
	}

	const vaciarCarrito = () => {
		if (confirm('¿Estás seguro de vaciar el carrito?')) {
			setCarrito([])
		}
	}

	 // =================================================
  // 🧮 CÁLCULOS DEL CARRITO
	// =================================================
	
	// Total de items (suma de todas las cantidades)
	const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0)
	// Subtotal (suma de todos los subtotales)
	const subTotal = carrito.reduce((total, item) => total + item.subtotal, 0)
	// IGV (18%)
	const igv = subTotal * 0.18
	// Total final
	const total = subTotal + igv


	// =================================================
	// 🎨 RENDER
	// =================================================

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='bg-white shadow-sm sticky top-0 z-10 p-4'>
				<div className='max-w-7xl mx-auto flex justify-between items-center'>
					<h1 className='text-2xl md:text-3xl font-bold'>
						📦 Productos
					</h1>

					{/* Contador de productos agregados */}
					<button
						className='relative bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'
						onClick={() => setMostrarCarrito(!mostrarCarrito)}
					>
						🛒 Carrito
						{totalItems > 0 && (
							<span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold'>
								{totalItems}
							</span>
						)}
					</button>
				</div>
			</div>

			<div className='max-w-7xl mx-auto p-4 md:p-8'>
				{/* Búsqueda */}
				<div className='mb-6 relative'>
					<input
						type='text'
						className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none'
						placeholder='🔍 Buscar productos...'
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
						// sincronizar input con estado (Inputs controlados)
					/>

					<p className='text-gray-600 mt-2 text-sm md:text-base'>
						{categoriaSeleccionada === 'todas' && !busqueda // !busqueda => si búsqueda está vacía es true
							? `Mostrando todos los productos (${productosFiltrados.length})`
							: `Encontrados: ${productosFiltrados.length} de ${productos.length} productos`
						}
					</p>

					{busqueda && (
						<button
							onClick={() => setBusqueda('')}
							className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer'
						>
							X
						</button>
					)}
				</div>

				{/* botones de categorias */}
				<div className='mb-6 flex flex-wrap gap-2'>
					{categorias.map(categoria => (
						<button
							key={categoria.id}
							onClick={() => setCategoriaSeleccionada(categoria.id)}
							className={
								`px-3 py-2 md:px-4 rounded-lg font-medium transition-all text-sm md:text-base
								${categoriaSeleccionada === categoria.id
									? 'bg-blue-500 text-white shadow-lg scale-105'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
							}
						>
							{categoria.emoji} {categoria.nombre}
						</button>
					))}
				</div>

				{/* Grid: organiza los productos en columnas */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{/* .map() recorre el array y crea una tarjeta por cada producto */}
					{productosFiltrados.map(producto => (
						<div
							key={producto.id}
							className='bg-white border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition'
						>
							<h2 className='text-lg md:text-xl font-semibold mb-2'>
								{producto.nombre}
							</h2>

							{/* badge de categoría */}
							<span className='inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full mb-2'>
								{producto.categoria}
							</span>

							<p className='text-gray-600 text-sm mb-3'>
								{producto.descripcion}
							</p>

							<p className='text-xl md:text-2xl font-bold text-green-600 mb-3'>
								S/ {producto.precio.toFixed(2)}
							</p>

							<button
								className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer'
								onClick={() => agregarAlCarrito(producto)}>
								Agregar al carrito
							</button>
						</div>
					))}
				</div>

				{/* No hay resultados */}
				{productosFiltrados.length === 0 && (
					<div className='text-center py-12'>
						<p className='text-2xl text-gray-400'>
							😕 No se encontraron productos
						</p>
						<p className='text-gray-500 mt-2'>
							Intenta con otro término de búsqueda
						</p>
					</div>
				)}
			</div>

			{/* Overlay oscuro cuando el carrito está abierto */}
			{mostrarCarrito && (
				<div
					className='fixed inset-0 bg-black opacity-50 z-40'
					onClick={() => setMostrarCarrito(false)}
				/>
			)}

			{/* Sidebar del carrito - Fijo por encima de todo */}
			<div className={`
				fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50
				transform transition-transform duration-300 ease-in-out
				${mostrarCarrito ? 'translate-x-0' : 'translate-x-full'}
				overflow-y-auto
			`}>
				<div className='p-6'>
					 {/* ==========================================
							📋 HEADER DEL CARRITO
						========================================== */}
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-2xl font-bold'>
							🛒 Mi Carrito
						</h2>
						<button
							className='text-gray-500 hover:text-gray-700 text-2xl font-bold'
							onClick={() => setMostrarCarrito(false)}
						>
							✕
						</button>
					</div>

					{/* ==========================================
						📦 CONTENIDO DEL CARRITO
					========================================== */}
					{carrito.length === 0 ? (
						// ==========================================
						// 🎯 CARRITO VACÍO
						// ==========================================
						<div className='text-center py-12'>
							<p className='text-6xl mb-4'>🛒</p>
							<p className='text-gray-500 text-lg'>
								Tu carrito está vacío
							</p>
							<p className='text-sm text-gray-400 mt-2'>
								Agrega productos para comenzar
							</p>
						</div>
					) : (
							// ==========================================
							// 🎯 CARRITO CON PRODUCTOS
							// ==========================================
							<>
								<div className='space-y-4 mb-6'>
									{carrito.map(item => (
										<div
											key={item.id}
											className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition'
										>
											<div className='flex justify-between items-start mb-2'>
												<h3 className='font-semibold text-gray-800'>
													{item.nombre}
												</h3>
												<button
													className='text-red-500 hover:text-red-700 text-xl'
													title='Eliminar'
													onClick={() => eliminarDelCarrito(item.id)}
												>
													🗑️
												</button>
											</div>

											<p className='text-sm text-gray-600 mb-3'>
												S/ {item.precio.toFixed(2)} c/u
											</p>

											{/* Controles de cantidad y subtotal */}
											<div className='flex items-center justify-between'>
												{/* Botones +/- y cantidad */}
												<div className='flex items-center gap-2'>
													<button
														className='bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold transition'
														onClick={() => disminuirCantidad(item.id)}
													>
														-
													</button>
													<span className='font-bold text-lg w-8 text-center'>
														{item.cantidad}
													</span>
													<button
														className='bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold transition'
														onClick={() => aumentarCantidad(item.id)}
													>
														+
													</button>
												</div>

												{/* Subtotal del item */}
												<p>{item.subtotal.toFixed(2)}</p>
											</div>
										</div>
									))}
								</div>

								{/* ==========================================
                  💰 RESUMEN DE TOTALES
                	========================================== */}
								<div className='border-t-2 border-gray-200 pt-4 space-y-3'>
									{/* Subtotal */}
									<div className='flex justify-between text-gray-700'>
										<span className='font-medium'>Subtotal: </span>
										<span className='font-semibold'>
											S/ {subTotal.toFixed(2)}
										</span>
									</div>

									{/* IGV */}
									<div className='flex justify-between text-gray-700'>
										<span className='font-medium'>IGV (18%):</span>
										<span className='font-semibold'>
											S/ {igv.toFixed(2)}
										</span>
									</div>

									{/* Total */}
									<div className='flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-3'>
										<span>Total:</span>
										<span className='text-green-600'>
											S/ {total.toFixed(2)}
										</span>
									</div>
								</div>

								{/* ==========================================
										🎬 BOTONES DE ACCIÓN
										========================================== */}
								<div className='mt-6 space-y-3'>
									{/* Botón proceder al pago */}
									<button className='w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-bold text-lg shadow-lg hover:shadow-xl'>
										💳 Proceder al pago
									</button>
									
									{/* Botón vaciar carrito */}
									<button
										className='w-full bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition font-medium'
										onClick={vaciarCarrito}
									>
										🗑️ Vaciar carrito
									</button>
								</div>
							</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProductPage
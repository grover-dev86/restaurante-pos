// Esta línea indica que este componente se ejecuta en el navegador del usuario
'use client'

import { useState } from 'react'

function ProductPage() {

	// useState: Guarda un número que representa cuántos productos agregamos
  // productosAgregados = el número actual
  // setProductosAgregados = función para cambiar ese número
	const [productosAgregados, setProductosAgregados] = useState(0)
	
	// Datos de prueba (más adelante vendrán de la base de datos)
	const productos = [
		{
			id: 1,
			nombre: 'Pizza Margarita',
			precio: 10.50,
			descripcion: 'Deliciosa pizza con queso mozzarella'
		},
				{
			id: 2,
			nombre: 'Hamburguesa Clásica',
			precio: 8,
			descripcion: 'Deliciosa pizza con queso mozzarella'
		},
		{
			id: 3,
			nombre: 'Tacos al Pastor',
			precio: 5.50,
			descripcion: 'Tres tacos con carne al pastor'
		}
	]

	const agregarAlCarrito = (nombreProducto: string) => {
		setProductosAgregados(productosAgregados + 1)

		alert(`✅ ${nombreProducto} agregado al carrito`)
	}

	return (
		<div className='p-8'>
			<h1 className='text-3xl font-bold mb-6'>
				📦 Lista de Productos
			</h1>

			{/* Contador de productos agregados */}
			<div className='bg-blue-500 text-white px-4 py-2 rounded-full mb-4'>
				🛒 Carrito: {productosAgregados}
			</div>

			{/* Grid: organiza los productos en columnas */}
			<div className='grid grid-cols-3 gap-4'>
				{/* .map() recorre el array y crea una tarjeta por cada producto */}
				{productos.map(producto => (
					<div
						key={producto.id}
						className='border rounded-lg p-4 shadow hover:shadow-lg'
					>
						<h2 className='text-xl font-semibold mb-2'>
							{producto.nombre}
						</h2>

						<p className='text-gray-600 mb-3'>
							{producto.descripcion}
						</p>
						
						<p className='text-2xl font-bold text-green-600'>
							S/ {producto.precio.toFixed(2)}
						</p>

						<button
							className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer'
							onClick={() => agregarAlCarrito(producto.nombre)}>
							Agregar al carrito
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default ProductPage
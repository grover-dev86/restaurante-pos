// Esta línea indica que este componente se ejecuta en el navegador del usuario
'use client'

function ProductPage() {
	
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
	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">
				📦 Lista de Productos
			</h1>

			{/* Grid: organiza los productos en columnas */}
			<div className="grid grid-cols-3 gap-4">
				{/* .map() recorre el array y crea una tarjeta por cada producto */}
				{productos.map(producto => (
					<div
						key={producto.id}
						className="border rounded-lg p-4 shadow hover:shadow-lg"
					>
						<h2 className="text-xl font-semibold mb-2">
							{producto.nombre}
						</h2>

						<p className="text-gray-600 mb-3">
							{producto.descripcion}
						</p>
						
						<p className="text-2xl font-bold text-green-600">
							S/ {producto.precio.toFixed(2)}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default ProductPage
import React, { useEffect, useState } from "react";
// Asegúrate de que este import apunte a tu configuración de Axios
import api from "../api/axios"; 

export default function VentasApp() {
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false); // Cambiado a false inicial para evitar carga eterna si no hay useEffect inicial

  // Lógica de búsqueda y Debounce unificada
  useEffect(() => {
    // Definimos la función dentro para evitar advertencias de dependencias
    const fetchProductos = async () => {
      setLoading(true);
      try {
        // CORRECCIÓN 1: Axios devuelve la data directamente en response.data
        const response = await api.get(`/productos/?search=${search}`);
        setProductos(response.data); // Usamos .data, no .json()
      } catch (error) {
        console.error("Error al buscar:", error);
      } finally {
        setLoading(false);
      }
    };

    // CORRECCIÓN 2: Un solo temporizador. Si el usuario escribe, se cancela el anterior.
    const timerId = setTimeout(() => {
      fetchProductos();
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]); // Solo se ejecuta cuando 'search' cambia

  const agregarAlCarrito = (producto) => {
    // Validar stock antes de agregar (Opcional pero recomendado)
    if (producto.stock <= 0) {
        alert("No hay stock disponible");
        return;
    }

    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const crearVenta = async () => {
    if (carrito.length === 0) return;

    const detalles = carrito.map((item) => ({
      producto: item.id,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad,
    }));

    // Calcular total
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    try {
      // CORRECCIÓN: Axios usa response.data, no necesitamos parsear nada
      await api.post('/ventas/', { total, detalles });
      setCarrito([]);
      alert("Venta realizada con éxito");
      
      // Opcional: Recargar productos para actualizar el stock visualmente
      // setBusqueda(search); // Esto dispararía el useEffect de nuevo
    } catch (e) {
      console.error(e);
      alert("Error al procesar la venta");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* SECCIÓN IZQUIERDA: Buscador y Lista */}
      <div className="border p-4 rounded-xl shadow bg-gray-50">
        
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Buscador de Inventario</h2>
          
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full mb-6 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {loading ? (
            <div className="text-center text-gray-500 py-4">Buscando...</div>
          ) : (
            <ul className="space-y-3">
              {productos.map((prod) => (
                <li
                  key={prod.id}
                  className="border p-4 rounded shadow hover:shadow-md transition bg-white flex flex-col sm:flex-row justify-between items-center gap-4"
                >
                  {/* Info Producto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {prod.nombre}
                    </h3>
                    <p className="text-blue-600 font-bold">
                      ${prod.precio}
                    </p>
                  </div>

                  {/* Stock y Botón */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        prod.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.stock > 0 ? `Stock: ${prod.stock}` : "Agotado"}
                    </span>
                    
                    <button
                      className={`text-white px-4 py-2 rounded text-sm transition ${
                          prod.stock > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => agregarAlCarrito(prod)}
                      disabled={prod.stock <= 0}
                    >
                      Agregar
                    </button>
                  </div>
                </li>
              ))}

              {productos.length === 0 && search !== "" && !loading && (
                <p className="text-center text-gray-500">
                  No se encontraron productos.
                </p>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: Carrito */}
      <div className="border p-4 rounded-xl shadow bg-white h-fit sticky top-4">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Carrito de Compras</h2>

        {carrito.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="space-y-3">
            {carrito.map((item) => {
              const subtotal = item.precio * item.cantidad;
              return (
                <div
                  key={item.id}
                  className="border p-3 rounded-xl shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
                    <div className="text-sm text-gray-600">
                        {item.cantidad} x ${item.precio}
                    </div>
                    <p className="font-bold text-blue-600">Subtotal: ${subtotal.toFixed(2)}</p>
                  </div>
                  <button
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded transition"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}
            
            <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total:</span>
                    <span>${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</span>
                </div>
                <button
                className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold shadow-lg transition transform active:scale-95"
                onClick={crearVenta}
                >
                Confirmar Venta
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
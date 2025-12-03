import React, { useEffect, useState } from "react";
// Asegúrate de que este import apunte a tu configuración de Axios
import api from "../api/axios"; 

export default function VentasApp() {
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Nuevo estado para manejar las pestañas: 'productos' o 'carrito'
  const [activeTab, setActiveTab] = useState("productos");

  // Lógica de búsqueda y Debounce unificada
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const endpoint = search 
          ? `/productos/?search=${encodeURIComponent(search)}` 
          : '/productos/';
          
        const response = await api.get(endpoint);
        setProductos(response.data);
      } catch (error) {
        console.error("Error al buscar:", error);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchProductos();
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  const agregarAlCarrito = (producto) => {
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

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    try {
      await api.post('/ventas/', { total, detalles });
      setCarrito([]);
      alert("Venta realizada con éxito");
    } catch (e) {
      console.error(e);
      alert("Error al procesar la venta");
    }
  };

  // Calculamos la cantidad total de items para mostrar en la pestaña del carrito
  const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* --- BARRA DE PESTAÑAS --- */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-6 font-medium transition-colors duration-200 outline-none ${
            activeTab === "productos"
              ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("productos")}
        >
          Lista Productos
        </button>
        <button
          className={`py-2 px-6 font-medium transition-colors duration-200 outline-none flex items-center gap-2 ${
            activeTab === "carrito"
              ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("carrito")}
        >
          Carrito de Compra
          {totalItemsCarrito > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItemsCarrito}
            </span>
          )}
        </button>
      </div>

      {/* --- CONTENIDO DE LAS PESTAÑAS --- */}
      
      {/* PESTAÑA 1: Buscador y Lista */}
      {activeTab === "productos" && (
        <div className="border p-4 rounded-b-xl rounded-tr-xl shadow bg-gray-50 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Buscador de Inventario</h2>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 rounded-lg w-full mb-6 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {loading ? (
              <div className="text-center text-gray-500 py-10">Buscando productos...</div>
            ) : (
              <ul className="space-y-3">
                {productos.map((prod) => (
                  <li
                    key={prod.id}
                    className="border p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {prod.nombre}
                      </h3>
                      <p className="text-blue-600 font-bold text-lg">
                        ${prod.precio}
                      </p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-medium ${
                          prod.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {prod.stock > 0 ? `Stock: ${prod.stock}` : "Agotado"}
                      </span>
                      
                      <button
                        className={`text-white px-6 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto ${
                            prod.stock > 0 ? 'bg-blue-600 hover:bg-blue-700 shadow-sm' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => agregarAlCarrito(prod)}
                        disabled={prod.stock <= 0}
                      >
                        Agregar al Carrito
                      </button>
                    </div>
                  </li>
                ))}

                {productos.length === 0 && search !== "" && !loading && (
                  <div className="text-center py-10 text-gray-500">
                    <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                  </div>
                )}
                
                {productos.length === 0 && search === "" && !loading && (
                   <div className="text-center py-10 text-gray-400">
                    <p>Escribe algo para buscar productos.</p>
                  </div>
                )}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: Carrito */}
      {activeTab === "carrito" && (
        <div className="border p-6 rounded-b-xl rounded-tr-xl shadow bg-white animate-fade-in">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
             <h2 className="text-2xl font-bold text-gray-800">Carrito de Compras</h2>
             <span className="text-gray-500">{totalItemsCarrito} articulos</span>
          </div>

          {carrito.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
              <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
              <button 
                onClick={() => setActiveTab("productos")}
                className="text-blue-600 font-medium hover:underline"
              >
                Ir a agregar productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {carrito.map((item) => {
                const subtotal = item.precio * item.cantidad;
                return (
                  <div
                    key={item.id}
                    className="border p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{item.nombre}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                          <span className="bg-white px-2 py-1 rounded border">
                            {item.cantidad} unidades
                          </span> 
                          <span className="mx-2">x</span> 
                          <span>${item.precio} c/u</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <p className="font-bold text-blue-600 text-lg">${subtotal.toFixed(2)}</p>
                        <button
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                            onClick={() => eliminarDelCarrito(item.id)}
                            title="Eliminar del carrito"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-end mb-6">
                      <span className="text-gray-600 text-lg">Total a Pagar:</span>
                      <span className="text-3xl font-bold text-gray-900">${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4">
                      <button
                        className="w-full bg-gray-200 text-gray-700 p-4 rounded-lg font-bold hover:bg-gray-300 transition"
                        onClick={() => setActiveTab("productos")}
                      >
                        Seguir Comprando
                      </button>
                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-bold shadow-lg transition transform active:scale-[0.98]"
                        onClick={crearVenta}
                      >
                        Confirmar Venta
                      </button>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function VentasApp() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/productos/")
      .then((res) => setProductos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const agregarAlCarrito = (producto) => {
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
    const detalles = carrito.map((item) => ({
      producto: item.id,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad,
    }));((item) => ({
      producto: item.id,
      cantidad: item.cantidad,
    }));

    try {
       const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
     await api.post('/ventas/', { total, detalles });
      setCarrito([]);
      alert("Venta realizada con éxito");
    } catch (e) {
      alert("Error al procesar la venta");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Productos */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map((prod) => (
            <div key={prod.id} className="border p-3 rounded-xl shadow">
              <h3 className="font-semibold text-lg">{prod.nombre}</h3>
              <p>Precio: ${prod.precio}</p>
              <p>Stock: {prod.stock}</p>
              <button
                className="w-full bg-blue-500 text-white p-2 rounded mt-3"
                onClick={() => agregarAlCarrito(prod)}
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Carrito</h2>

        {carrito.length === 0 ? (
          <p>No hay productos</p>
        ) : (
          <div className="space-y-3">
            {carrito.map((item) => {
              const subtotal = item.precio * item.cantidad;
              return (
                <div
                  key={item.id}
                  className="border p-3 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{item.nombre}</h3>
                    <p>Cantidad: {item.cantidad}</p>
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                  </div>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {carrito.length > 0 && (
          <button
            className="w-full bg-green-600 text-white p-3 rounded mt-4"
            onClick={crearVenta}
          >
            Confirmar Venta
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api from "../api/axios";
// Nota: Verifica que tus rutas de importación sean correctas, 
// parece que los nombres de archivo estaban invertidos en tu original.
import { CatalogoProductos } from "../components/ventas/CatalogoProductos";
import { DatosVentaForm } from "../components/ventas/DatosVentaForm";
import { TablaCarrito } from "../components/ventas/ResumenTotales"; 
import { ResumenTotales } from "../components/ventas/TablaCarrito";

export default function VentasApp() {
  // ----------------------------------------------------
  // 1. LÓGICA Y ESTADO (INTACTO)
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState("productos");
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vendedor: "", 
    tipoDocumento: "boleta",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    const timerId = setTimeout(() => fetchProductos(), 500);
    return () => clearTimeout(timerId);
  }, [search]);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const crearVenta = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío.");
    if (!formData.vendedor.trim()) return alert("⚠️ Falta el vendedor.");

    const detalles = carrito.map((item) => ({
      producto: item.id,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad,
    }));

    const payload = {
      vendedor: formData.vendedor,
      tipo_documento: formData.tipoDocumento, // <--- CAMBIO CRÍTICO
      subtotal,
      iva,
      total,
      detalles
    };

    try {
      await api.post('/ventas/', payload);
      setCarrito([]);
      setFormData(prev => ({ ...prev, vendedor: "" })); 
      alert("✅ Venta realizada con éxito");
      setActiveTab("productos");
    } catch (e) {
      console.error(e);
      alert("❌ Error al procesar la venta");
    }
  };

  // ----------------------------------------------------
  // 2. RENDERIZADO CON BOOTSTRAP
  // ----------------------------------------------------
  return (
    <div className="container py-5">
      {/* Encabezado Principal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark m-0">
          <i className="bi bi-shop me-2"></i>Punto de Venta
        </h2>
        {/* Indicador de items totales visible en header */}
        <span className="badge bg-secondary">
            Total Items: {totalItems}
        </span>
      </div>

      {/* --- NAVEGACIÓN TIPO TABS --- */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "productos" ? "active fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("productos")}
          >
            <i className="bi bi-grid-3x3-gap-fill me-2"></i>
            Catálogo
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "carrito" ? "active fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("carrito")}
          >
            <div className="d-flex align-items-center">
                <i className="bi bi-cart-fill me-2"></i>
                Carrito
                {totalItems > 0 && (
                <span className="badge bg-danger rounded-pill ms-2">
                    {totalItems}
                </span>
                )}
            </div>
          </button>
        </li>
      </ul>

      {/* --- CONTENIDO DE LAS PESTAÑAS --- */}
      <div className="tab-content">
        
        {/* CASO A: CATÁLOGO */}
        {activeTab === "productos" ? (
          <div className="fade show active">
            {/* Aquí se renderiza tu componente hijo */}
            <CatalogoProductos
              search={search}
              setSearch={setSearch}
              loading={loading}
              productos={productos}
              onAdd={agregarAlCarrito}
            />
          </div>
        ) : (
          
          /* CASO B: CARRITO (Dentro de una Card) */
          <div className="fade show active">
            <div className="card shadow border-0">
              <div className="card-header bg-white py-3">
                 <h5 className="m-0 text-primary fw-bold">Resumen de Venta</h5>
              </div>
              
              <div className="card-body">
                {/* Formulario de Datos */}
                <div className="mb-4">
                    <DatosVentaForm
                    formData={formData} 
                    onChange={handleChange} 
                    />
                </div>

                <hr className="my-4" />

                {/* Tabla de Items */}
                <div className="mb-4">
                    <TablaCarrito
                    carrito={carrito} 
                    onRemove={eliminarDelCarrito} 
                    />
                </div>

                {/* Totales y Botón Pagar */}
                <div className="bg-light p-3 rounded">
                    <ResumenTotales
                    subtotal={subtotal}
                    iva={iva}
                    total={total}
                    tipoDocumento={formData.tipoDocumento}
                    onSubmit={crearVenta}
                    />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
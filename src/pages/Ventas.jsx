// pages/VentasPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import { useCaja } from '../context/CajaContext'; 

// Importamos los módulos
import ProductSearch from '../components/ventas/ProductSearch';
import ProductTable from '../components/ventas/ProductTable';
import CartSidebar from '../components/ventas/CartSidebar';

const VentasPage = () => {
  const { cajaAbierta, loadingCaja } = useCaja();
  const navigate = useNavigate();

  // Estados de Negocio
  const [query, setQuery] = useState('');
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  
  // Estados de Facturación
  const [tipoVenta, setTipoVenta] = useState('boleta'); 
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [datosFactura, setDatosFactura] = useState({
    rut_cliente: '', razon_social: '', giro: '', direccion: ''
  });

  // --- LOGICA DE PRODUCTOS ---
  const cargarProductos = async (termino = '') => {
    try {
        const url = termino ? `productos/?search=${termino}` : 'productos/';
        const response = await api.get(url);
        setProductos(response.data);
    } catch (error) {
        console.error("Error productos:", error);
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  const handleSearch = (termino) => {
    setQuery(termino);
    // Lógica opcional para evitar buscar con 1 solo caracter
    if (termino.length > 0 && termino.length < 2 && isNaN(termino)) return;
    cargarProductos(termino);
  };

  // --- LOGICA DEL CARRITO ---
  // Ahora recibimos la cantidad directamente del hijo (ProductTable)
  const agregarAlCarrito = (producto, cantidad) => {
    if (cantidad > producto.stock) {
      alert(`Solo quedan ${producto.stock} unidades.`);
      return;
    }

    const existe = carrito.find(item => item.producto.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => 
        item.producto.id === producto.id 
          ? { ...item, cantidad: item.cantidad + cantidad } 
          : item
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.producto.id !== id));
  };

  // --- LOGICA DE TOTALES ---
  const total = carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  // --- PROCESAR VENTA ---
  const realizarVenta = async () => {
    if (carrito.length === 0) return alert("Carrito vacío");
    setLoadingVenta(true);

    const payload = {
      detalles: carrito.map(item => ({
        producto: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio 
      })),
      ...(tipoVenta === 'boleta' 
          ? { numero_boleta: `BOL-${Date.now()}` } 
          : { ...datosFactura, numero_factura: `FAC-${Date.now()}` }
      )
    };

    try {
      const endpoint = tipoVenta === 'boleta' ? 'boletas/' : 'facturas/';
      const response = await api.post(endpoint, payload);
      navigate(`/venta/detalle/${tipoVenta}/${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert("Error al procesar la venta.");
    } finally {
      setLoadingVenta(false);
    }
  };

  if (loadingCaja) return <div>Cargando...</div>;
  if (!cajaAbierta) return <div>Caja Cerrada</div>;

  return (
    <div className="container-fluid mt-4 pb-5 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="mb-0 text-primary fw-bold">Punto de Venta</h2>
        <div className="text-muted">Fecha: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="row">
        {/* COLUMNA IZQUIERDA: Buscador y Tabla */}
        <div className="col-md-8">
          <ProductSearch query={query} onSearch={handleSearch} />
          <ProductTable productos={productos} onAdd={agregarAlCarrito} />
        </div>

        {/* COLUMNA DERECHA: Sidebar Carrito */}
        <div className="col-md-4">
          <CartSidebar 
            carrito={carrito} 
            onDelete={eliminarDelCarrito}
            total={total} neto={neto} iva={iva}
            tipoVenta={tipoVenta} setTipoVenta={setTipoVenta}
            datosFactura={datosFactura} setDatosFactura={setDatosFactura}
            onPagar={realizarVenta} loadingVenta={loadingVenta}
          />
        </div>
      </div>
    </div>
  );
};

export default VentasPage;
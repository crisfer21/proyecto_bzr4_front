import React, { useState } from 'react';
// IMPORTANTE: Importa tu instancia personalizada en lugar de la librería por defecto
// Ajusta la ruta '../api/axios' según donde guardaste tu archivo axios.js
import api from '../api/axios'; 

const Ventas = () => {
  // --- Estados ---
  const [query, setQuery] = useState('');
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [tipoVenta, setTipoVenta] = useState('boleta'); // 'boleta' o 'factura'
  const [loading, setLoading] = useState(false);
  
  // Datos específicos para Factura
  const [datosFactura, setDatosFactura] = useState({
    rut_cliente: '',
    razon_social: '',
    giro: '',
    direccion: ''
  });

  // --- 1. Buscar Productos ---
  const buscarProductos = async (termino) => {
    setQuery(termino);
    if (termino.length < 2) return; 

    try {
      // Usamos 'api' y una ruta relativa. El token se inyecta solo.
      const response = await api.get(`productos/?search=${termino}`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error buscando productos:", error);
    }
  };

  // --- 2. Gestión del Carrito ---
  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.producto.id === producto.id);
    
    if (existe) {
      setCarrito(carrito.map(item => 
        item.producto.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  };

  // --- 3. Manejo de Inputs de Factura ---
  const handleFacturaChange = (e) => {
    setDatosFactura({
      ...datosFactura,
      [e.target.name]: e.target.value
    });
  };

  // --- 4. Procesar Venta (Checkout) ---
  const realizarVenta = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    setLoading(true);

    // Preparamos el array de detalles
    const detallesPayload = carrito.map(item => ({
      producto: item.producto.id,
      cantidad: item.cantidad,
      precio_unitario: item.producto.precio 
    }));

    // Datos base
    let payload = {
      detalles: detallesPayload,
    };

    // Endpoint relativo (sin http://localhost...)
    let endpoint = '';
    
    if (tipoVenta === 'boleta') {
      endpoint = 'boletas/';
      payload.numero_boleta = `BOL-${Date.now()}`; 
    } else {
      endpoint = 'facturas/';
      payload = { ...payload, ...datosFactura }; 
      payload.numero_factura = `FAC-${Date.now()}`;
    }

    try {
      // --- CAMBIO PRINCIPAL AQUÍ ---
      // Ya no configuramos headers manuales ni leemos localStorage.
      // Tu instancia 'api' lo hace automáticamente.
      await api.post(endpoint, payload);
      
      alert(`Venta realizada con éxito! (${tipoVenta.toUpperCase()})`);
      setCarrito([]); 
      setDatosFactura({ rut_cliente: '', razon_social: '', giro: '', direccion: '' });
      setProductos([]); // Opcional: limpiar búsqueda
      setQuery('');
      
    } catch (error) {
      console.error("Error en la venta:", error.response?.data || error);
      alert("Hubo un error al procesar la venta. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado ---
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Punto de Venta (POS)</h2>

      <div className="row">
        {/* COLUMNA IZQUIERDA: BUSCADOR Y RESULTADOS */}
        <div className="col-md-7">
          <div className="card p-3 mb-3">
            <h4>Buscar Producto</h4>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Escribe nombre del producto..." 
              value={query}
              onChange={(e) => buscarProductos(e.target.value)}
            />
          </div>

          <div className="row">
            {productos.map(prod => (
              <div key={prod.id} className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{prod.nombre}</h5>
                    <p className="card-text text-primary fw-bold">${prod.precio}</p>
                    <p className="small text-muted">Stock: {prod.stock}</p>
                    <button 
                      className="btn btn-success btn-sm w-100"
                      onClick={() => agregarAlCarrito(prod)}
                      disabled={prod.stock <= 0}
                    >
                      {prod.stock > 0 ? '+ Agregar' : 'Sin Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: CARRITO Y CHECKOUT */}
        <div className="col-md-5">
          <div className="card p-3 shadow-sm">
            <h4 className="d-flex justify-content-between align-items-center">
              Carrito
              <span className="badge bg-primary rounded-pill">{carrito.length}</span>
            </h4>
            
            <ul className="list-group mb-3 mt-3">
              {carrito.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item.producto.nombre}</h6>
                    <small className="text-muted">Cantidad: {item.cantidad}</small>
                  </div>
                  <div className="text-end">
                    <span className="text-muted">${item.producto.precio * item.cantidad}</span>
                    <button 
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => eliminarDelCarrito(item.producto.id)}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (CLP)</span>
                <strong>${calcularTotal()}</strong>
              </li>
            </ul>

            <hr />

            {/* SELECCIÓN TIPO VENTA */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tipo de Documento:</label>
              <div className="btn-group w-100" role="group">
                <input 
                  type="radio" className="btn-check" name="btnradio" id="btnradio1" 
                  autoComplete="off" checked={tipoVenta === 'boleta'}
                  onChange={() => setTipoVenta('boleta')} 
                />
                <label className="btn btn-outline-primary" htmlFor="btnradio1">Boleta</label>

                <input 
                  type="radio" className="btn-check" name="btnradio" id="btnradio2" 
                  autoComplete="off" checked={tipoVenta === 'factura'}
                  onChange={() => setTipoVenta('factura')}
                />
                <label className="btn btn-outline-primary" htmlFor="btnradio2">Factura</label>
              </div>
            </div>

            {/* FORMULARIO FACTURA (CONDICIONAL) */}
            {tipoVenta === 'factura' && (
              <div className="border p-2 rounded bg-light mb-3">
                <h6 className="mb-2">Datos Cliente</h6>
                <input name="rut_cliente" placeholder="RUT" className="form-control mb-2 form-control-sm" onChange={handleFacturaChange} value={datosFactura.rut_cliente}/>
                <input name="razon_social" placeholder="Razón Social" className="form-control mb-2 form-control-sm" onChange={handleFacturaChange} value={datosFactura.razon_social}/>
                <input name="giro" placeholder="Giro" className="form-control mb-2 form-control-sm" onChange={handleFacturaChange} value={datosFactura.giro}/>
                <input name="direccion" placeholder="Dirección" className="form-control mb-2 form-control-sm" onChange={handleFacturaChange} value={datosFactura.direccion}/>
              </div>
            )}

            <button 
              className="btn btn-primary w-100 btn-lg" 
              onClick={realizarVenta}
              disabled={loading || carrito.length === 0}
            >
              {loading ? 'Procesando...' : 'FINALIZAR VENTA'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
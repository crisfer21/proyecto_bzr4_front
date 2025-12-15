// components/ventas/CartSidebar.jsx
import React from 'react';

const CartSidebar = ({ 
  carrito, onDelete, total, neto, iva, 
  tipoVenta, setTipoVenta, datosFactura, setDatosFactura, 
  onPagar, loadingVenta 
}) => {

  const handleFacturaChange = (e) => {
    setDatosFactura({ ...datosFactura, [e.target.name]: e.target.value });
  };

  return (
    <div className="card shadow border-0 h-100" style={{ maxHeight: '85vh' }}>
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0 d-flex justify-content-between">
          <span>Resumen de Venta</span>
          <span className="badge bg-white text-primary">{carrito.length} Items</span>
        </h5>
      </div>
      
      {/* --- LISTA DE ITEMS --- */}
      <div className="card-body p-0 overflow-auto flex-grow-1">
        {carrito.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="fs-1">🛒</p><p>Carrito Vacío</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {carrito.map((item, index) => (
              <li key={index} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-0 fw-bold">{item.producto.nombre}</h6>
                    <small className="text-muted d-block">SKU: {item.producto.sku}</small>
                    <small className="text-muted">{item.cantidad} x ${item.producto.precio}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-1">${item.producto.precio * item.cantidad}</div>
                    <button className="btn btn-outline-danger btn-sm py-0 px-2" onClick={() => onDelete(item.producto.id)}>
                      &times;
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- TOTALES Y PAGO --- */}
      <div className="card-footer bg-light p-3">
        <div className="mb-3">
          <div className="d-flex justify-content-between text-muted small">
            <span>Neto:</span><span>${neto.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between text-muted small">
            <span>IVA (19%):</span><span>${iva.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-2">
            <span className="h5 mb-0 text-secondary">Total a Pagar</span>
            <span className="h3 mb-0 text-primary fw-bold">${total.toLocaleString()}</span>
          </div>
        </div>

        <div className="btn-group w-100 mb-3" role="group">
          <input type="radio" className="btn-check" name="btnradio" id="bol" 
            checked={tipoVenta === 'boleta'} onChange={() => setTipoVenta('boleta')} />
          <label className="btn btn-outline-primary" htmlFor="bol">Boleta</label>

          <input type="radio" className="btn-check" name="btnradio" id="fac" 
            checked={tipoVenta === 'factura'} onChange={() => setTipoVenta('factura')} />
          <label className="btn btn-outline-primary" htmlFor="fac">Factura</label>
        </div>

        {tipoVenta === 'factura' && (
          <div className="mb-3 animate__animated animate__fadeIn">
            <input name="rut_cliente" placeholder="RUT Cliente" className="form-control form-control-sm mb-2" onChange={handleFacturaChange} value={datosFactura.rut_cliente}/>
            <input name="razon_social" placeholder="Razón Social" className="form-control form-control-sm mb-2" onChange={handleFacturaChange} value={datosFactura.razon_social}/>
            <input name="giro" placeholder="Giro" className="form-control form-control-sm mb-2" onChange={handleFacturaChange} value={datosFactura.giro}/>
            <input name="direccion" placeholder="Dirección" className="form-control form-control-sm mb-2" onChange={handleFacturaChange} value={datosFactura.direccion}/>
          </div>
        )}

        <button 
          className="btn btn-success w-100 py-3 fw-bold shadow" 
          onClick={onPagar}
          disabled={loadingVenta || carrito.length === 0}
        >
          {loadingVenta ? 'Procesando...' : '💰 CONFIRMAR PAGO'}
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
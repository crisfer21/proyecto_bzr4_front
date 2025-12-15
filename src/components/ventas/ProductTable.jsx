// components/ventas/ProductTable.jsx
import React, { useState } from 'react';

const ProductTable = ({ productos, onAdd }) => {
  // Estado local para controlar los inputs de cantidad visualmente
  const [cantidades, setCantidades] = useState({});

  const handleCantidadChange = (id, valor) => {
    if (valor < 0) return;
    setCantidades({ ...cantidades, [id]: valor });
  };

  const handleAddClick = (prod) => {
    const cantidad = parseInt(cantidades[prod.id]) || 1;
    onAdd(prod, cantidad); // Enviamos el producto Y la cantidad al padre
    setCantidades({ ...cantidades, [prod.id]: '' }); // Limpiamos el input
  };

  return (
    <div className="card border-0 shadow-sm" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th className="ps-3">SKU</th> 
              <th>Producto</th>
              <th className="text-center">Stock</th>
              <th className="text-end">Precio</th>
              <th className="text-center" style={{width: '120px'}}>Cantidad</th>
              <th className="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id}>
                <td className="ps-3 text-secondary font-monospace small">{prod.sku || '-'}</td>
                <td className="fw-bold text-dark">{prod.nombre}</td>
                <td className="text-center">
                  <span className={`badge ${prod.stock > 10 ? 'bg-success' : prod.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                    {prod.stock}
                  </span>
                </td>
                <td className="text-end fw-bold text-primary">${prod.precio}</td>
                <td>
                  <input 
                    type="number" min="1" max={prod.stock}
                    className="form-control form-control-sm text-center"
                    placeholder="1"
                    value={cantidades[prod.id] || ''}
                    onChange={(e) => handleCantidadChange(prod.id, e.target.value)}
                    disabled={prod.stock <= 0}
                  />
                </td>
                <td className="text-center">
                  <button 
                    className="btn btn-primary btn-sm rounded-pill px-3"
                    onClick={() => handleAddClick(prod)}
                    disabled={prod.stock <= 0}
                  >
                    <i className="bi bi-cart-plus"></i> Agregar
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4 text-muted">No se encontraron productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
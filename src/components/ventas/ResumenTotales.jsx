import React from "react";

export const TablaCarrito = ({ carrito, onRemove }) => {
  // --- ESTADO VACÍO ---
  if (carrito.length === 0) {
    return (
      <div 
        className="d-flex flex-column align-items-center justify-content-center py-5 mb-4 bg-light rounded"
        // Bootstrap no tiene borde "dashed" por defecto, lo agregamos inline o con CSS custom
        style={{ border: "2px dashed #dee2e6" }}
      >
        <div className="text-muted mb-2">
          <i className="bi bi-cart-x fs-1 opacity-50"></i>
        </div>
        <p className="text-secondary fw-bold mb-0">El carrito está vacío</p>
        <small className="text-muted">Selecciona productos del catálogo</small>
      </div>
    );
  }

  // --- TABLA CON DATOS ---
  return (
    // Contenedor con scroll vertical limitado
    <div className="table-responsive mb-4" style={{ maxHeight: "400px" }}>
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light sticky-top shadow-sm">
          <tr>
            <th scope="col" className="ps-3">Producto</th>
            <th scope="col" className="text-center">Cant.</th>
            <th scope="col" className="text-end">Total</th>
            <th scope="col" style={{ width: "50px" }}></th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item) => (
            <tr key={item.id}>
              {/* Columna Producto */}
              <td className="ps-3">
                <div className="fw-bold text-dark">{item.nombre}</div>
                <small className="text-muted">${item.precio} c/u</small>
              </td>

              {/* Columna Cantidad (Badge estilo botón) */}
              <td className="text-center">
                <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                  {item.cantidad}
                </span>
              </td>

              {/* Columna Total */}
              <td className="text-end fw-bold text-primary">
                ${(item.precio * item.cantidad).toFixed(2)}
              </td>

              {/* Columna Eliminar */}
              <td className="text-center">
                <button
                  onClick={() => onRemove(item.id)}
                  className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                  title="Eliminar del carrito"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
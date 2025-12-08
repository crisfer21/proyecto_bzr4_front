import React from "react";

// 1. COMPONENTE: CATÁLOGO DE PRODUCTOS (Lado Izquierdo)
export const CatalogoProductos = ({ search, setSearch, loading, productos, onAdd }) => {
  return (
    <div className="card shadow h-100 border-0">
      {/* Encabezado del Catálogo */}
      <div className="card-header bg-white py-3 border-bottom">
        <h5 className="mb-0 fw-bold text-dark">
          <i className="bi bi-tag-fill me-2 text-primary"></i>
          Catálogo
        </h5>
      </div>

      <div className="card-body d-flex flex-column">
        {/* Buscador con icono (Input Group) */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 bg-light"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Lista Scrollable */}
        {/* Bootstrap no tiene max-height arbitrario, usamos style inline para el scroll */}
        <div 
          className="flex-grow-1 overflow-auto pe-2" 
          style={{ maxHeight: "600px" }}
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted small">Cargando inventario...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-box-seam fs-1 mb-2 d-block opacity-50"></i>
              No se encontraron productos.
            </div>
          ) : (
            <div className="vstack gap-2">
              {productos.map((prod) => (
                <div
                  key={prod.id}
                  className="card border shadow-sm transition-hover"
                >
                  <div className="card-body p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title mb-1 fw-bold text-dark">
                        {prod.nombre}
                      </h6>
                      <span className="text-primary fw-bold">
                        ${prod.precio}
                      </span>
                      {/* Opcional: Mostrar stock pequeño */}
                      <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                         Stock: {prod.stock}
                      </small>
                    </div>

                    <button
                      disabled={prod.stock <= 0}
                      onClick={() => onAdd(prod)}
                      className={`btn btn-sm fw-medium d-flex align-items-center gap-2 ${
                        prod.stock > 0
                          ? "btn-primary" // Botón Azul
                          : "btn-secondary disabled" // Botón Gris
                      }`}
                    >
                      {prod.stock > 0 ? (
                        <>
                          Agregar <i className="bi bi-plus-lg"></i>
                        </>
                      ) : (
                        "Agotado"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
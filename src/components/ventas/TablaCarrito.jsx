import React from "react";

// 4. COMPONENTE: RESUMEN Y BOTÓN (Pie Derecha)
export const ResumenTotales = ({ subtotal, iva, total, tipoDocumento, onSubmit }) => {
  return (
    <div className="mt-auto border-top pt-4 bg-white">
      
      {/* Sección de cálculos */}
      <div className="mb-4">
        {/* Subtotal */}
        <div className="d-flex justify-content-between mb-2 text-secondary">
          <span>Subtotal (Neto):</span>
          <span className="fw-medium">${subtotal.toFixed(2)}</span>
        </div>

        {/* IVA */}
        <div className="d-flex justify-content-between mb-3 text-secondary">
          <span>IVA (19%):</span>
          <span className="fw-medium">${iva.toFixed(2)}</span>
        </div>

        {/* Total General */}
        {/* Bootstrap no tiene borde 'dashed' por defecto, usamos style inline */}
        <div 
          className="d-flex justify-content-between align-items-center pt-3 mt-2" 
          style={{ borderTop: "2px dashed #dee2e6" }}
        >
          <span className="fs-5 fw-bold text-dark">Total:</span>
          <span className="fs-4 fw-bold text-success">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botón de Acción (Full Width) */}
      <div className="d-grid">
        <button
          onClick={onSubmit}
          className="btn btn-success btn-lg text-uppercase fw-bold shadow-sm py-3"
          type="button"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          Confirmar {tipoDocumento}
        </button>
      </div>
      
    </div>
  );
};
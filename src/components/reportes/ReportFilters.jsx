// components/reportes/ReportFilters.jsx
import React from 'react';

const ReportFilters = ({ opciones, vendedorId, setVendedorId, fecha, setFecha }) => {
  return (
    <div className="card mb-4 bg-light shadow-sm">
      <div className="card-body">
        <div className="row g-3">
          
          {/* SELECTOR VENDEDOR */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Filtrar por Vendedor:</label>
            <select 
              className="form-select"
              value={vendedorId}
              onChange={(e) => setVendedorId(e.target.value)}
            >
              <option value="">Todos los vendedores (Global)</option>
              {opciones.vendedores.map(v => (
                <option key={v.id} value={v.id}>
                  {v.first_name} {v.last_name} ({v.username})
                </option>
              ))}
            </select>
          </div>
          
          {/* SELECTOR FECHA */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Seleccionar Fecha:</label>
            <select 
              className="form-select" 
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            >
              <option value="">Histórico Total</option>
              {opciones.dias_disponibles.map(dia => (
                <option key={dia} value={dia}>
                  {dia.split('-').reverse().join('/')}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
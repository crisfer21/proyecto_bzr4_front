// components/reportes/BoletaSection.jsx
import React from 'react';
import { formatoMoneda } from '../../utils/formatters';

const BoletaSection = ({ data }) => {
  // data espera recibir: reporteData.resumen_boletas
  return (
    <>
      <h4 className="text-secondary">Resumen Boletas</h4>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body text-center">
              <h6 className="card-title">Cantidad Emitida</h6>
              <h2 className="display-6 fw-bold">{data.cantidad_boletas}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-9">
          <div className="card h-100 border-info">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total Neto</h6>
                  <h4 className="text-dark">{formatoMoneda(data.suma_neto)}</h4>
                </div>
                <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total IVA (19%)</h6>
                  <h4 className="text-dark">{formatoMoneda(data.suma_iva)}</h4>
                </div>
                <div className="col-md-4">
                  <h6 className="text-primary fw-bold">TOTAL VENTA</h6>
                  <h3 className="text-primary">{formatoMoneda(data.suma_total)}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoletaSection;
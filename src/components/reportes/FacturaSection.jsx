// components/reportes/FacturaSection.jsx
import React from 'react';
import { formatoMoneda } from '../../utils/formatters';

const FacturaSection = ({ data }) => {
  // data espera recibir: reporteData.facturas
  const { resumen, detalle_lista } = data;

  return (
    <>
      <h4 className="text-secondary mt-4">Resumen Facturas</h4>
      
      {/* TARJETAS RESUMEN */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body text-center">
              <h6 className="card-title">Cantidad Emitida</h6>
              <h2 className="display-6 fw-bold">{resumen.cantidad_facturas}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-9">
           <div className="card h-100 border-warning">
            <div className="card-body">
              <div className="row text-center">
                  <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total Neto</h6>
                  <h4 className="text-dark">{formatoMoneda(resumen.suma_neto)}</h4>
                </div>
                <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total IVA</h6>
                  <h4 className="text-dark">{formatoMoneda(resumen.suma_iva)}</h4>
                </div>
                <div className="col-md-4">
                  <h6 className="text-warning fw-bold text-dark">TOTAL FACTURADO</h6>
                  <h3 className="text-dark">{formatoMoneda(resumen.suma_total)}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DETALLE */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          Detalle de Facturas Emitidas
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>N° Factura</th>
                  <th>Neto</th>
                  <th>IVA</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {detalle_lista.length > 0 ? (
                  detalle_lista.map((fac, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{fac.numero_factura}</td>
                      <td>{formatoMoneda(fac.total_neto)}</td>
                      <td>{formatoMoneda(fac.total_iva)}</td>
                      <td className="text-end fw-bold text-primary">{formatoMoneda(fac.total_final)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-3 text-muted">
                      No hay facturas que coincidan con los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacturaSection;
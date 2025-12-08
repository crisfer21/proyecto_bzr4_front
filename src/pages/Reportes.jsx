import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS PARA FILTROS ---
  const [filtroVendedor, setFiltroVendedor] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  // --- 1. CARGA DE DATOS ---
  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        const response = await api.get("/ventas/");
        setVentas(response.data);
      } catch (error) {
        console.error("Error al cargar reporte:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  // --- 2. LÓGICA DE FILTRADO ---
  const ventasFiltradas = ventas.filter((venta) => {
    const coincideVendedor = venta.vendedor
      ? venta.vendedor.toLowerCase().includes(filtroVendedor.toLowerCase())
      : true;

    const fechaVenta = venta.fecha.split("T")[0];
    const coincideFecha = fechaFiltro ? fechaVenta === fechaFiltro : true;

    return coincideVendedor && coincideFecha;
  });

  // --- 3. CÁLCULOS DE TOTALES ---
  const calcularTotales = (tipo) => {
    const lista = ventasFiltradas.filter((v) => v.tipo_documento === tipo);
    return {
      cantidad: lista.length,
      subtotal: lista.reduce((acc, item) => acc + parseFloat(item.subtotal), 0),
      iva: lista.reduce((acc, item) => acc + parseFloat(item.iva), 0),
      total: lista.reduce((acc, item) => acc + parseFloat(item.total), 0),
      lista: lista,
    };
  };

  const datosBoleta = calcularTotales("boleta");
  const datosFactura = calcularTotales("factura");

  // --- 4. RENDERIZADO ---
  return (
    <div className="container py-5">
      {/* Título Principal */}
      <h2 className="mb-4 pb-2 border-bottom border-2 text-primary fw-bold">
        <i className="bi bi-bar-chart-line-fill me-2"></i>
        Reporte Diario de Ventas
      </h2>

      {/* --- SECCIÓN DE FILTROS (Card Bootstrap) --- */}
      <div className="card shadow-sm mb-5 border-0 bg-light">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 text-secondary fw-bold">
             🔍 Filtros de Búsqueda
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Filtro Vendedor */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Vendedor</label>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre..."
                value={filtroVendedor}
                onChange={(e) => setFiltroVendedor(e.target.value)}
              />
            </div>

            {/* Filtro Fecha */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Seleccionar Día</label>
              <input
                type="date"
                className="form-control"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
              />
              <div className="form-text">
                Deja vacío para ver el histórico completo.
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Generando reporte...</p>
        </div>
      ) : (
        <>
          {/* --- TARJETAS DE RESUMEN --- */}
          <div className="row g-4 mb-5">
            {/* TARJETA BOLETAS (Estilo Azul/Primary) */}
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-start border-4 border-primary">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title text-primary fw-bold m-0">Resumen Boletas</h4>
                    <span className="badge bg-primary rounded-pill">BOLETA</span>
                  </div>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Cantidad</span>
                      <span className="fw-bold">{datosBoleta.cantidad}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Subtotal</span>
                      <span>${datosBoleta.subtotal.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">IVA (19%)</span>
                      <span>${datosBoleta.iva.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between bg-light mt-2 rounded">
                      <span className="fw-bold">Total</span>
                      <span className="fw-bold text-primary fs-5">
                        ${datosBoleta.total.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TARJETA FACTURAS (Estilo Verde/Success) */}
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-start border-4 border-success">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title text-success fw-bold m-0">Resumen Facturas</h4>
                    <span className="badge bg-success rounded-pill">FACTURA</span>
                  </div>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Cantidad</span>
                      <span className="fw-bold">{datosFactura.cantidad}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Subtotal</span>
                      <span>${datosFactura.subtotal.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">IVA (19%)</span>
                      <span>${datosFactura.iva.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between bg-light mt-2 rounded">
                      <span className="fw-bold">Total</span>
                      <span className="fw-bold text-success fs-5">
                        ${datosFactura.total.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* --- LISTADO DETALLADO (Tabla) --- */}
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="m-0">
                 📋 Detalle de Ventas con Factura {fechaFiltro && <small className="text-muted ms-2">({fechaFiltro})</small>}
              </h5>
            </div>
            
            <div className="card-body p-0">
              {datosFactura.lista.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  No hay facturas registradas con estos filtros.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0 align-middle">
                    <thead className="table-secondary text-uppercase text-secondary small">
                      <tr>
                        <th className="ps-4">Nº Factura</th>
                        <th>Hora</th>
                        <th>Vendedor</th>
                        <th className="text-end">Neto</th>
                        <th className="text-end">IVA</th>
                        <th className="text-end pe-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosFactura.lista.map((venta) => (
                        <tr key={venta.id}>
                          <td className="ps-4 fw-bold text-dark">#{venta.id}</td>
                          <td className="text-muted">
                            {new Date(venta.fecha).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="text-capitalize">{venta.vendedor}</td>
                          <td className="text-end">${parseFloat(venta.subtotal).toFixed(2)}</td>
                          <td className="text-end text-muted">${parseFloat(venta.iva).toFixed(2)}</td>
                          <td className="text-end pe-4 fw-bold text-success">
                            ${parseFloat(venta.total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
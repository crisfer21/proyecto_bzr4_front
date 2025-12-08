import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Tu instancia configurada

const Reportes = () => {
  // --- Estados de Datos ---
  const [todasBoletas, setTodasBoletas] = useState([]);
  const [todasFacturas, setTodasFacturas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  
  // --- Estados de Filtros ---
  const [filtroVendedor, setFiltroVendedor] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  
  // --- Estados de Resultados (Datos procesados) ---
  const [resumenBoletas, setResumenBoletas] = useState({ cantidad: 0, neto: 0, iva: 0, total: 0 });
  const [resumenFacturas, setResumenFacturas] = useState({ cantidad: 0, neto: 0, iva: 0, total: 0, lista: [] });
  
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos iniciales al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Hacemos las peticiones en paralelo para mayor velocidad
        const [resBoletas, resFacturas, resUsuarios] = await Promise.all([
          api.get('boletas/'),
          api.get('facturas/'),
          api.get('usuarios/') // Asumiendo que tienes un endpoint para listar vendedores
        ]);

        setTodasBoletas(resBoletas.data);
        setTodasFacturas(resFacturas.data);
        setVendedores(resUsuarios.data);
        
      } catch (error) {
        console.error("Error cargando reporte:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // 2. Efecto para recalcular cuando cambian los filtros o los datos
  useEffect(() => {
    aplicarFiltros();
  }, [filtroVendedor, filtroFecha, todasBoletas, todasFacturas]);

  // --- Lógica de Filtrado y Cálculo ---
  const aplicarFiltros = () => {
    // A. Filtrar Boletas
    const boletasFiltradas = todasBoletas.filter(b => {
      const cumpleVendedor = filtroVendedor ? b.vendedor === parseInt(filtroVendedor) : true;
      // Convertimos la fecha ISO del backend (YYYY-MM-DDTHH:mm:ss) a YYYY-MM-DD para comparar
      const fechaVenta = b.fecha.split('T')[0]; 
      const cumpleFecha = filtroFecha ? fechaVenta === filtroFecha : true;
      return cumpleVendedor && cumpleFecha;
    });

    // B. Filtrar Facturas
    const facturasFiltradas = todasFacturas.filter(f => {
      const cumpleVendedor = filtroVendedor ? f.vendedor === parseInt(filtroVendedor) : true;
      const fechaVenta = f.fecha.split('T')[0];
      const cumpleFecha = filtroFecha ? fechaVenta === filtroFecha : true;
      return cumpleVendedor && cumpleFecha;
    });

    // C. Calcular Totales Boletas
    const totalBoletas = boletasFiltradas.reduce((acc, curr) => ({
        neto: acc.neto + parseFloat(curr.total_neto),
        iva: acc.iva + parseFloat(curr.total_iva),
        total: acc.total + parseFloat(curr.total_final)
    }), { neto: 0, iva: 0, total: 0 });

    setResumenBoletas({
      cantidad: boletasFiltradas.length,
      neto: totalBoletas.neto,
      iva: totalBoletas.iva,
      total: totalBoletas.total
    });

    // D. Calcular Totales Facturas
    const totalFacturas = facturasFiltradas.reduce((acc, curr) => ({
        neto: acc.neto + parseFloat(curr.total_neto),
        iva: acc.iva + parseFloat(curr.total_iva),
        total: acc.total + parseFloat(curr.total_final)
    }), { neto: 0, iva: 0, total: 0 });

    setResumenFacturas({
      cantidad: facturasFiltradas.length,
      neto: totalFacturas.neto,
      iva: totalFacturas.iva,
      total: totalFacturas.total,
      lista: facturasFiltradas // Guardamos la lista para la tabla
    });
  };

  // --- Helper para formato moneda (CLP) ---
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
  };

  if (loading) return <div className="text-center mt-5">Generando reporte...</div>;

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-primary border-bottom pb-2">Reporte de Ventas</h2>

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className="card mb-4 bg-light">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Filtrar por Vendedor:</label>
              <select 
                className="form-select"
                value={filtroVendedor}
                onChange={(e) => setFiltroVendedor(e.target.value)}
              >
                <option value="">Todos los vendedores</option>
                {vendedores.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.username} {v.first_name ? `- ${v.first_name}` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-bold">Filtrar por Fecha:</label>
              <input 
                type="date" 
                className="form-control" 
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- REPORTE BOLETAS --- */}
      <h4 className="text-secondary">Resumen Boletas</h4>
      <div className="row mb-4">
        {/* Cantidad */}
        <div className="col-md-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body text-center">
              <h6 className="card-title">Cantidad Emitida</h6>
              <h2 className="display-6 fw-bold">{resumenBoletas.cantidad}</h2>
            </div>
          </div>
        </div>
        
        {/* Dinero */}
        <div className="col-md-9">
          <div className="card h-100 border-info">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total Neto</h6>
                  <h4 className="text-dark">{formatoMoneda(resumenBoletas.neto)}</h4>
                </div>
                <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total IVA (19%)</h6>
                  <h4 className="text-dark">{formatoMoneda(resumenBoletas.iva)}</h4>
                </div>
                <div className="col-md-4">
                  <h6 className="text-primary fw-bold">TOTAL VENTA</h6>
                  <h3 className="text-primary">{formatoMoneda(resumenBoletas.total)}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* --- REPORTE FACTURAS --- */}
      <h4 className="text-secondary mt-4">Resumen Facturas</h4>
      
      {/* Totales Factura (Cards) */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body text-center">
              <h6 className="card-title">Cantidad Emitida</h6>
              <h2 className="display-6 fw-bold">{resumenFacturas.cantidad}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-9">
           <div className="card h-100 border-warning">
            <div className="card-body">
              <div className="row text-center">
                 <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total Neto</h6>
                  <h4 className="text-dark">{formatoMoneda(resumenFacturas.neto)}</h4>
                </div>
                <div className="col-md-4 border-end">
                  <h6 className="text-muted">Total IVA</h6>
                  <h4 className="text-dark">{formatoMoneda(resumenFacturas.iva)}</h4>
                </div>
                <div className="col-md-4">
                  <h6 className="text-warning fw-bold text-dark">TOTAL FACTURADO</h6>
                  <h3 className="text-dark">{formatoMoneda(resumenFacturas.total)}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Detalle Facturas */}
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
                  <th>Fecha</th>
                  <th>Razón Social</th>
                  <th className="text-end">Neto</th>
                  <th className="text-end">IVA</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {resumenFacturas.lista.length > 0 ? (
                  resumenFacturas.lista.map((fac) => (
                    <tr key={fac.id}>
                      <td className="fw-bold">{fac.numero_factura}</td>
                      <td>{new Date(fac.fecha).toLocaleDateString()}</td>
                      <td>{fac.razon_social}</td>
                      <td className="text-end">{formatoMoneda(fac.total_neto)}</td>
                      <td className="text-end">{formatoMoneda(fac.total_iva)}</td>
                      <td className="text-end fw-bold text-primary">{formatoMoneda(fac.total_final)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3 text-muted">
                      No hay facturas que coincidan con los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Reportes;
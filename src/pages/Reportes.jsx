// pages/ReportesPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

// Importamos los módulos
import ReportFilters from '../components/reportes/ReportFilters';
import BoletaSection from '../components/reportes/BoletaSection';
import FacturaSection from '../components/reportes/FacturaSection';

const Reportes = () => {
  const [reporteData, setReporteData] = useState(null);
  const [opciones, setOpciones] = useState({ vendedores: [], dias_disponibles: [] });

  const [filtroVendedor, setFiltroVendedor] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);

  // 1. Cargar Filtros
  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const res = await api.get('filtros-reporte/');
        setOpciones(res.data);
      } catch (error) {
        console.error("Error cargando opciones:", error);
      } finally {
        setLoadingFiltros(false);
      }
    };
    cargarFiltros();
  }, []);

  // 2. Cargar Reporte
  useEffect(() => {
    const cargarReporte = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filtroVendedor) params.vendedor_id = filtroVendedor;
        if (filtroFecha) params.fecha = filtroFecha;

        const res = await api.get('reporte-ventas/', { params });
        setReporteData(res.data);
      } catch (error) {
        console.error("Error cargando reporte:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarReporte();
  }, [filtroVendedor, filtroFecha]);

  if (loadingFiltros) return <div className="text-center mt-5">Cargando opciones...</div>;

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-primary border-bottom pb-2">Reporte de Ventas</h2>

      {/* COMPONENTE 1: FILTROS */}
      <ReportFilters 
        opciones={opciones}
        vendedorId={filtroVendedor}
        setVendedorId={setFiltroVendedor}
        fecha={filtroFecha}
        setFecha={setFiltroFecha}
      />

      {loading || !reporteData ? (
         <div className="text-center py-5">
             <div className="spinner-border text-primary" role="status"></div>
             <p>Calculando totales...</p>
         </div>
      ) : (
        <>
          {/* COMPONENTE 2: SECCIÓN BOLETAS */}
          <BoletaSection data={reporteData.resumen_boletas} />

          <hr />

          {/* COMPONENTE 3: SECCIÓN FACTURAS */}
          <FacturaSection data={reporteData.facturas} />
        </>
      )}
    </div>
  );
};

export default Reportes;
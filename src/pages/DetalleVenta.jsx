import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DetalleVenta = () => {
  // Capturamos los datos de la URL (ej: tipo="factura", id="45")
  const { tipo, id } = useParams(); 
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Decidimos a qué endpoint llamar según el tipo que viene en la URL
        // Endpoint esperado: api/boletas/45/ ó api/facturas/45/
        const endpoint = tipo === 'boleta' ? `boletas/${id}/` : `facturas/${id}/`;
        const response = await api.get(endpoint);
        setVenta(response.data);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el documento");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [tipo, id]);

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (!venta) return <div className="text-center mt-5">Documento no encontrado</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow mx-auto" style={{ maxWidth: '700px' }}>
        
        {/* CABECERA */}
        <div className="card-header bg-primary text-white text-center">
          <h3 className="mb-0">
            {tipo === 'boleta' ? 'BOLETA ELECTRÓNICA' : 'FACTURA ELECTRÓNICA'}
          </h3>
          <small>Folio Interno: {venta.id}</small>
        </div>

        <div className="card-body">
          {/* DATOS COMUNES */}
          <div className="row mb-4">
            <div className="col-6">
              <strong>N° Documento:</strong> {tipo === 'boleta' ? venta.numero_boleta : venta.numero_factura}<br/>
              <strong>Vendedor:</strong> {venta.vendedor || 'Usuario Actual'}
            </div>
            <div className="col-6 text-end">
              <strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}
            </div>
          </div>

          {/* --- BLOQUE EXCLUSIVO PARA FACTURA --- */}
          {/* Solo se renderiza si el tipo en la URL es 'factura' */}
          {tipo === 'factura' && (
            <div className="alert alert-secondary mb-4">
              <h5 className="alert-heading border-bottom pb-2">Datos del Cliente</h5>
              <div className="row">
                <div className="col-md-8"><strong>Razón Social:</strong> {venta.razon_social}</div>
                <div className="col-md-4"><strong>RUT:</strong> {venta.rut_cliente}</div>
                <div className="col-md-8"><strong>Dirección:</strong> {venta.direccion}</div>
                <div className="col-md-4"><strong>Giro:</strong> {venta.giro}</div>
              </div>
            </div>
          )}

          {/* TABLA DE PRODUCTOS */}
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Precio U.</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            {/* ... dentro de tu tabla en DetalleVenta.jsx ... */}
            <tbody>
              {venta.detalles.map((item, index) => (
                <tr key={index}>
                  {/* Usamos los nuevos nombres que definimos en Django */}
                  
                  <td>{item.nombre_producto}</td>
                  
                  <td className="text-center">{item.cantidad}</td>
                  
                  {/* OJO: Aquí usamos precio_real */}
                  <td className="text-end">
                    ${Number(item.precio_real).toLocaleString()}
                  </td>
                  
                  <td className="text-end fw-bold">
                    ${Number(item.subtotal).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALES */}
          <div className="row justify-content-end mt-4">
            <div className="col-md-5">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Neto:</span>
                  <span>${Number(venta.total_neto).toLocaleString()}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>IVA (19%):</span>
                  <span>${Number(venta.total_iva).toLocaleString()}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between list-group-item-primary fw-bold">
                  <span>TOTAL:</span>
                  <span>${Number(venta.total_final).toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="card-footer text-center">
          <button className="btn btn-outline-dark me-3" onClick={() => window.print()}>
            🖨️ Imprimir
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/ventas')}>
            Nueva Venta
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetalleVenta;
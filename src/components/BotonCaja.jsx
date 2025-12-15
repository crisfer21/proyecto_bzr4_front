import React from 'react';
import { useCaja } from '../context/CajaContext';

const BotonCaja = ({ className = "" }) => {
  const { cajaAbierta, loadingCaja, abrirCaja, cerrarCaja } = useCaja();

  if (loadingCaja) return <span className="text-muted small">Cargando...</span>;

  if (cajaAbierta) {
    return (
      <button 
        className={`btn btn-danger ${className}`} 
        onClick={cerrarCaja}
      >
        Cerrar Caja 🔒
      </button>
    );
  }

  return (
    <button 
      className={`btn btn-success ${className}`} 
      onClick={abrirCaja}
    >
      Abrir Caja 🔓
    </button>
  );
};

export default BotonCaja;
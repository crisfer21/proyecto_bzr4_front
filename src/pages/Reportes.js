import { useState } from "react";
import api from "../api/axios";

export default function Reportes() {
  const [info, setInfo] = useState(null);

  const cargar = async () => {
    const res = await api.get("ventas/reporte_dia/");
    setInfo(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Reporte del Día</h1>

      <button onClick={cargar}>Ver Reporte</button>

      {info && (
        <div style={{ marginTop: 20 }}>
          <p><b>Fecha:</b> {info.fecha}</p>
          <p><b>Total Vendido:</b> {info.total_vendido}</p>
          <p><b>Número de ventas:</b> {info.cantidad_ventas}</p>
        </div>
      )}
    </div>
  );
}

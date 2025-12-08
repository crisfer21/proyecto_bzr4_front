import { useState } from "react";

import React from "react";

export default function DocumentVentaForm() {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [formData, setFormData] = useState({
    fecha: "",
    vendedor: "",
    razonSocial: "",
    rut: "",
    giro: "",
    direccion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", { tipoDocumento, ...formData });
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="$1">
        <div>
          <h1 className="text-2xl font-bold mb-4">Registro de Venta</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Tipo de Documento</label>
              <select
                className="w-full p-2 border rounded-xl"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
              >
                <option value="boleta">Boleta</option>
                <option value="factura">Factura</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                className="w-full p-2 border rounded-xl"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Vendedor</label>
              <input
                type="text"
                name="vendedor"
                className="w-full p-2 border rounded-xl"
                value={formData.vendedor}
                onChange={handleChange}
                required
              />
            </div>

            {tipoDocumento === "factura" && (
              <>
                <div>
                  <label className="block font-semibold mb-1">Razón Social</label>
                  <input
                    type="text"
                    name="razonSocial"
                    className="w-full p-2 border rounded-xl"
                    value={formData.razonSocial}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">RUT</label>
                  <input
                    type="text"
                    name="rut"
                    className="w-full p-2 border rounded-xl"
                    value={formData.rut}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Giro</label>
                  <input
                    type="text"
                    name="giro"
                    className="w-full p-2 border rounded-xl"
                    value={formData.giro}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    className="w-full p-2 border rounded-xl"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <button className="w-full mt-4 p-3 rounded-2xl font-semibold bg-blue-500 text-white">
              Guardar Venta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

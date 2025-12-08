// 2. COMPONENTE: DATOS DE VENTA (Cabecera Derecha)
export const DatosVentaForm = ({ formData, onChange }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Selector Tipo Documento */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo Documento</label>
        <select
          name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none bg-white font-medium"
        >
          <option value="boleta">Boleta</option>
          <option value="factura">Factura</option>
        </select>
      </div>

      {/* Input Vendedor */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vendedor</label>
        <input
          type="text"
          name="vendedor"
          value={formData.vendedor}
          onChange={onChange}
          placeholder="Nombre..."
          className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
        />
      </div>
    </div>
  );
};
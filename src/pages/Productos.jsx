import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("productos/");
      setProductos(res.data);
    } catch (error) {
      console.error("Error cargando productos", error);
    }
  };

  const crear = async () => {
    const { value: form } = await Swal.fire({
      title: "Nuevo Producto",
      // Usamos clases de Swal pero personalizamos los inputs
      html: `
        <div class="mb-3 text-start">
            <label class="form-label">Nombre</label>
            <input id="nombre" class="form-control" placeholder="Ej: Laptop Gamer">
        </div>
        <div class="mb-3 text-start">
            <label class="form-label">Precio</label>
            <input id="precio" class="form-control" type="number" step="0.1" placeholder="0.00">
        </div>
        <div class="mb-3 text-start">
            <label class="form-label">Stock</label>
            <input id="stock" class="form-control" type="number" placeholder="0">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754', // Verde Bootstrap (Success)
      cancelButtonColor: '#6c757d',  // Gris Bootstrap
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const precio = document.getElementById("precio").value;
        const stock = document.getElementById("stock").value;
        
        if (!nombre || !precio || !stock) {
          Swal.showValidationMessage('Por favor completa todos los campos');
        }
        return { nombre, precio, stock };
      }
    });

    if (form) {
      try {
        await api.post("productos/", form);
        Swal.fire("¡Creado!", "El producto ha sido agregado.", "success");
        load();
      } catch (error) {
        Swal.fire("Error", "No se pudo crear el producto", "error");
      }
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container mt-5">
      
      {/* Tarjeta contenedora de la tabla */}
      <div className="card shadow-sm border-0">
        
        {/* Encabezado de la tarjeta */}
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">
             📦 Inventario de Productos
          </h4>
          <button className="btn btn-success" onClick={crear}>
            <i className="bi bi-plus-lg me-1"></i> + Nuevo Producto
          </button>
        </div>

        {/* Cuerpo de la tarjeta con la tabla */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="ps-4">ID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col" className="text-end pe-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4 fw-bold">#{p.id}</td>
                      <td>{p.nombre}</td>
                      <td className="fw-bold text-success">${p.precio}</td>
                      <td>
                        {/* Badge condicional para el stock */}
                        {p.stock < 5 ? (
                           <span className="badge bg-danger rounded-pill">{p.stock} (Bajo)</span>
                        ) : (
                           <span className="badge bg-primary rounded-pill">{p.stock} Unid.</span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No hay productos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer opcional */}
        <div className="card-footer bg-white text-muted text-end">
           Total: {productos.length} items
        </div>
      </div>
    </div>
  );
}
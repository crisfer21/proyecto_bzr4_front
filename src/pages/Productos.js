import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const load = async () => {
    const res = await api.get("productos/");
    setProductos(res.data);
  };

  const crear = async () => {
    const { value: form } = await Swal.fire({
      title: "Nuevo Producto",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre">
        <input id="precio" class="swal2-input" type="number" step="0.1" placeholder="Precio">
        <input id="stock" class="swal2-input" type="number" placeholder="Stock">
      `,
      preConfirm: () => ({
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        stock: document.getElementById("stock").value
      })
    });

    if (form) {
      await api.post("productos/", form);
      load();
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Productos</h1>
      <button onClick={crear}>Nuevo Producto</button>

      <table border="1" width="100%">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th></tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

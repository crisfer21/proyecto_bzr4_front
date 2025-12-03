import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      {user && (
        <>
          <Link style={{ margin: 10 }} to="/dashboard">dashboard</Link>

          {user.role === "admin" && (
            <>
              <Link style={{ margin: 10 }} to="/productos">Productos</Link>
              <Link style={{ margin: 10 }} to="/reportes">Reportes</Link>
            </>
          )}
          

          {user.role === "vendedor" && (
            <Link style={{ margin: 10 }} to="/ventas">Ventas</Link>
          )}
          
          <button onClick={logout} style={{ float: "right" }}>
            Cerrar sesión
          </button>
        </>
      )}
    </nav>
  );
}

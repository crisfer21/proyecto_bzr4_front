import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import BotonCaja from "./BotonCaja";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        {/* Marca / Logo */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <i className="bi bi-shop-window me-2"></i>
          Mi Sistema
        </Link>

        {/* Botón Hamburguesa (para móviles) */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido Colapsable */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {user && (
            <>
              {/* ENLACES (Alineados a la izquierda) */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>

                {user.role === "jefe venta" && (
                  <>
                    <li className="nav-item">
                      <BotonCaja/>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/productos">Productos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/reportes">Reportes</Link>
                    </li>
                  </>
                )}

                {user.role === "vendedor" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/ventas">Ventas</Link>
                  </li>
                )}
              </ul>

              {/* SECCIÓN DERECHA (Usuario + Logout) */}
              <div className="d-flex align-items-center">
                <span className="navbar-text text-white me-3 d-none d-lg-block">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.nombre || "Usuario"} ({user.role})
                </span>
                
                <button 
                  onClick={logout} 
                  className="btn btn-outline-danger btn-sm"
                >
                  Cerrar sesión <i className="bi bi-box-arrow-right ms-1"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
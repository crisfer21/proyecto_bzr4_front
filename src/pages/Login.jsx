import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      Swal.fire({
        title: "Bienvenido",
        text: "Inicio de sesión exitoso",
        icon: "success",
        confirmButtonColor: "#0d6efd" // Color azul Bootstrap
      });
      window.location.href = "/dashboard";
    } catch {
      Swal.fire({
        title: "Error",
        text: "Credenciales incorrectas",
        icon: "error",
        confirmButtonColor: "#dc3545" // Color rojo Bootstrap
      });
    }
  };

  return (
    // Contenedor principal con fondo gris claro y altura mínima
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            
            {/* Tarjeta de Login */}
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>
                
                <form onSubmit={handleSubmit}>
                  {/* Campo Usuario */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUser(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPass(e.target.value)}
                      required
                    />
                  </div>

                  {/* Botón de envío */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Entrar
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Pie de tarjeta opcional */}
              <div className="card-footer text-center py-3 border-0 bg-white">
                <small className="text-muted">¿Olvidaste tu contraseña?</small>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
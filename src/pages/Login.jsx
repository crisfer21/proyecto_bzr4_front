import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // 1. Importamos el hook

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate(); // 2. Inicializamos el hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 3. CAPTURAMOS LOS DATOS:
      // 'userData' es lo que retorna tu AuthContext (el objeto con el rol)
      const userData = await login(username, password);

      // Alerta visual rápida (se cierra sola en 1.5s)
      Swal.fire({
        title: "Bienvenido",
        text: "Iniciando sistema...",
        icon: "success",
        timer: 1500, 
        showConfirmButton: false
      });

      // 4. LÓGICA DE REDIRECCIÓN POR ROL
      if (userData.role === 'vendedor') {
        navigate("/ventas");
      } else if (userData.role === 'jefe venta') {
        navigate("/reportes"); 
      } else {
        // Por seguridad, una ruta por defecto si el rol es desconocido
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  return (
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
                      autoFocus
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
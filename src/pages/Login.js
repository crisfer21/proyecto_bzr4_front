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
      Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success");
      window.location.href = "/dashboard";
    } catch {
      Swal.fire("Error", "Credenciales incorrectas", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: 100 }}>
      <h1>Login</h1>
      <input placeholder="Usuario" onChange={(e) => setUser(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPass(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
}

import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Agregamos un estado de carga inicial
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");

      if (savedUser && accessToken) {
        try {
          setUser(JSON.parse(savedUser));
          // Opcional: Podrías verificar aquí si el token sigue siendo válido con una llamada al backend
        } catch (e) {
          console.error("Datos de usuario corruptos en storage", e);
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      // Una vez verificado el storage, quitamos el loading
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
        const res = await api.post("auth/login/", { username, password });
        
        // IMPORTANTE: Asegúrate que tu backend envíe 'user'. 
        // Si usas Django SimpleJWT por defecto, solo envía access y refresh.
        // Necesitas un Serializer personalizado para recibir 'user'.
        const { access, refresh, user: userData } = res.data;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        return true; 
    } catch (error) {
        // Mejoramos el log para depuración
        console.error("Error en Login:", error.response?.data || error.message);
        throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    // Redirigir al login es mejor manejarlo en el componente UI o Router
  };

  // Si está cargando la sesión inicial, no renderizamos la app aún
  // Esto evita que el ProtectedRoute te saque al login mientras lee localStorage
  if (loading) {
    return <div className="text-center mt-5">Cargando sesión...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
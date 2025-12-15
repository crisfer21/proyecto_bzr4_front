import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Verificar sesión al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");

      if (savedUser && accessToken) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error leyendo usuario", e);
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 2. FUNCIÓN LOGIN
  const login = async (username, password) => {
    try {
        // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
        // Usamos "auth/login/" para coincidir con tu urls.py: path('api/auth/login/'...)
        // (Asumimos que tu axios.js tiene configurado baseURL terminando en /api/)
        const res = await api.post("auth/login/", { username, password });
        
        // Extraemos los datos que envía tu Serializer personalizado
        const { access, refresh, user: userData } = res.data;

        // Guardamos en LocalStorage
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(userData));

        // Actualizamos estado
        setUser(userData);
        
        // RETORNAMOS los datos para que Login.jsx pueda leer el rol y redirigir
        return userData; 

    } catch (error) {
        console.error("Error en Login:", error.response?.data || error.message);
        throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login"; // Forzamos la salida
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando sesión...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
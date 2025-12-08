import axios from "axios";

// Definimos la URL base en una constante para usarla en ambos sitios
const BASE_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: BASE_URL,
});

// 1. Interceptor de Request: Agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    // CORRECCIÓN 1: Usar un nombre consistente ('access_token')
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de Response: Manejo de errores y Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CORRECCIÓN 2: Verificar que error.response exista para evitar crashes si el server está caído
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // CORRECCIÓN 3: Si no hay refresh token, no intentar renovar, cerrar sesión directo
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        // Llamada para renovar token
        const response = await axios.post(`${BASE_URL}auth/refresh/`, {
          refresh: refreshToken
        });

        const { access } = response.data;

        // Guardamos el nuevo token con el MISMO nombre que usamos arriba
        localStorage.setItem('access_token', access);

        // Actualizamos los headers de la instancia y del request original
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        return api(originalRequest); 
      } catch (err) {
        // Si falla el refresh o no hay token, logout limpio
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
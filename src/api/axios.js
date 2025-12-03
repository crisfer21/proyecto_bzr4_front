import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Interceptor de Response (Entrada / Errores)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si es error 401 y no hemos reintentado aún
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                // Llamada directa con axios puro para evitar bucles
                const response = await axios.post('http://localhost:8000/api/auth/refresh/', {
                    refresh: refreshToken
                });

                const { access } = response.data;
                
                localStorage.setItem('access_token', access);
                
                // Actualizamos headers
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                originalRequest.headers['Authorization'] = `Bearer ${access}`;

                return api(originalRequest); // Reintentamos la petición original
            } catch (err) {
                // Si falla el refresh, logout forzado
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

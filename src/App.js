import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Importación de páginas
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Reportes from "./pages/Reportes";
import Dashboard from "./pages/Dashboard";

// 1. Creamos un "Layout" simple para las rutas internas
// Esto renderiza el Navbar y el contenido de la página (Outlet)
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4"> {/* Opcional: Contenedor para márgenes */}
        <Outlet /> 
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Eliminamos el Navbar de aquí para que no salga en el Login */}

        <Routes>
          {/* RUTA PÚBLICA */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirección de raíz a login (o a dashboard si prefieres) */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* RUTAS PROTEGIDAS CON NAVBAR (Usando el Layout) */}
          <Route element={<MainLayout />}>
            
            <Route 
              path="/dashboard"
              element={
                // OJO: Asegúrate que "admin" coincide con tu backend (quizás sea "jefe_venta")
                <ProtectedRoute roles={["admin", "vendedor"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/productos"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Productos />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/ventas"
              element={
                <ProtectedRoute roles={["admin", "vendedor"]}>
                  <Ventas />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/reportes"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Reportes />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* RUTA 404 (Para cualquier ruta no definida) */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
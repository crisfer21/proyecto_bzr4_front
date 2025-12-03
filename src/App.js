import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Reportes from "./pages/Reportes";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route 
            path="/dashboard"
            element={
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

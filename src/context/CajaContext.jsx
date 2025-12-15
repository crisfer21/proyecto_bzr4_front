import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios'; // Tu instancia de axios configurada
import { AuthContext } from './AuthContext'; // Para detectar si hay usuario

export const CajaContext = createContext();

export const CajaProvider = ({ children }) => {
  // Estado inicial: null para saber que está cargando
  const [cajaAbierta, setCajaAbierta] = useState(null); 
  const [loadingCaja, setLoadingCaja] = useState(true);
  
  const { user } = useContext(AuthContext);

  // --- 1. FUNCIÓN PARA CONSULTAR LA VERDAD ABSOLUTA AL BACKEND ---
  const verificarEstado = async () => {
    try {
      // console.log("🔍 Verificando estado en el servidor...");
      const res = await api.get('caja/estado/');
      
      // Actualizamos el estado con lo que diga la base de datos
      setCajaAbierta(res.data.caja_abierta); 
      
    } catch (error) {
      console.error("❌ Error verificando caja:", error);
      // Si falla la conexión, asumimos cerrada por seguridad
      setCajaAbierta(false); 
    } finally {
      setLoadingCaja(false);
    }
  };

  // --- 2. EFECTO: CARGAR AL INICIAR SESIÓN ---
  useEffect(() => {
    if (user) {
      verificarEstado();
    } else {
      setLoadingCaja(false);
    }
  }, [user]);

  // --- 3. ABRIR CAJA ---
  const abrirCaja = async () => {
    try {
      // console.log("⏳ Enviando orden de abrir...");
      await api.post('caja/abrir/');
      
      // TRUCO CLAVE: Volvemos a consultar el estado para forzar la actualización visual
      await verificarEstado(); 
      
      return true;
    } catch (error) {
      console.error("❌ Error al abrir la caja:", error);
      alert("No se pudo abrir la caja. Revisa tu conexión.");
      return false;
    }
  };

  // --- 4. CERRAR CAJA ---
  const cerrarCaja = async () => {
    // Confirmación nativa del navegador
    if(!window.confirm("¿Estás seguro de que deseas cerrar tu caja?")) return;

    try {
      // console.log("⏳ Enviando orden de cerrar...");
      await api.post('caja/cerrar/');
      
      // TRUCO CLAVE: Re-verificamos
      await verificarEstado();
      
      return true;
    } catch (error) {
      console.error("❌ Error al cerrar la caja:", error);
      alert("No se pudo cerrar la caja.");
      return false;
    }
  };

  return (
    <CajaContext.Provider value={{ 
        cajaAbierta,   // boolean o null
        loadingCaja,   // boolean
        abrirCaja,     // función
        cerrarCaja,    // función
        verificarEstado // función (por si la necesitas manual)
    }}>
      {children}
    </CajaContext.Provider>
  );
};

// Hook personalizado para usarlo más fácil
export const useCaja = () => useContext(CajaContext);
import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // username + role

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (username, password) => {
    const res = await api.post("auth/login/", { username, password });
    
    const token = res.data.access;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

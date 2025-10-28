import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario guardado en localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);

      console.log(data)
      const userData = {
        contact: data.contact,
        message: data.message,
        status: data.status,
        jwt: data.jwt,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.jwt);

      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: error.message };
    }
  };

  // Register
  const register = async (username, names, password) => {
    try {
      const data = await authAPI.register(username, names, password);

      const userData = {
        contact: data.contact,
        message: data.message,
        status: data.status,
        jwt: data.jwt,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.jwt);

      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Login con Google (placeholder)
  const loginWithGoogle = async () => {
    console.log("Login con Google - Por implementar");
  };

  // Login con LinkedIn (placeholder)
  const loginWithLinkedIn = async () => {
    console.log("Login con LinkedIn - Por implementar");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithLinkedIn,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

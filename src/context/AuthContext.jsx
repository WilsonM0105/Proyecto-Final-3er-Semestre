import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Simulación: si hay un usuario guardado en localStorage, lo cargamos
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Simulación de login con roles
  const login = (email, password) => {
    // Si el correo contiene "admin" => rol administrador
    if (email.includes("admin")) {
      const adminUser = { email, role: "admin" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
    } else {
      // Rol usuario normal
      const normalUser = { email, role: "user" };
      setUser(normalUser);
      localStorage.setItem("user", JSON.stringify(normalUser));
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}

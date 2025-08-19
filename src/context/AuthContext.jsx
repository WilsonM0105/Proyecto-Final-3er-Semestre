import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const isAdmin = user?.rol === "admin";

  useEffect(() => {
    const raw = localStorage.getItem("session");
    if (raw) {
      try {
        const { user: u, token: t } = JSON.parse(raw);
        setUser(u);
        setToken(t);
      } catch {
        localStorage.removeItem("session");
      }
    }
  }, []);

  const setSession = (u, t) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("session", JSON.stringify({ user: u, token: t }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("session");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

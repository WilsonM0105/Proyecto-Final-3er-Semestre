import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            // limpia contexto + localStorage
    navigate("/login");  // o navega a "/" si prefieres
  };

  return (
    <header style={{ backgroundColor: "#333", color: "#fff", padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Catálogo de Productos</h1>

        <nav style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link to="/" style={{ color: "#fff" }}>Inicio</Link>

          {/* Si NO hay sesión → mostrar Login / Registro */}
          {!user && (
            <>
              <Link to="/login" style={{ color: "#fff" }}>Iniciar sesión</Link>
              <Link to="/registro" style={{ color: "#fff" }}>Registrarse</Link>
            </>
          )}

          {/* Si SÍ hay sesión */}
          {user && (
            <>
              {/* Si es admin → link al panel */}
              {user.role === "admin" && (
                <Link to="/admin" style={{ color: "#fff" }}>Panel Admin</Link>
              )}

              {/* Info pequeña del usuario */}
              <span style={{ opacity: 0.8, fontSize: ".9rem" }}>
                {user.email}
              </span>

              {/* Botón Cerrar sesión */}
              <button
                onClick={handleLogout}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: ".4rem .7rem",
                  cursor: "pointer"
                }}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

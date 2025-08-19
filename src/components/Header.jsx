import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__bar container">
        {/* Marca / Home */}
        <h1
          className="app-title"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
          aria-label="Ir al inicio"
        >
          Catálogo de Productos
        </h1>

        {/* Navegación */}
        <nav className="nav">
          {!user ? (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          ) : (
            <>
              <span style={{ opacity: 0.9 }}>
                Hola, <strong>{user.nombre || user.email}</strong>
              </span>

              {isAdmin && (
                <Link
                  to="/admin"
                  aria-label="Panel de administrador"
                  style={{ background: "rgba(255,255,255,.15)", borderRadius: 8, padding: ".25rem .5rem" }}
                >
                  PANEL ADMIN
                </Link>
              )}

              <button className="btn btn-secondary" onClick={logout} aria-label="Cerrar sesión">
                Cerrar sesión
              </button>
            </>
          )}

          {/* Carrito con badge */}
          <Link to="/carrito" aria-label={`Ir al carrito (${totalItems} productos)`}>
            <span className="badge" data-count={totalItems || 0}>🛒</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

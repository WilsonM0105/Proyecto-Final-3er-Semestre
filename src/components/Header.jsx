import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="app-header">
      <div className="app-header__bar container">
        <h1 className="app-title">Catálogo de Productos</h1>

        <nav className="nav">
          <Link to="/">Inicio</Link>

          <Link to="/carrito" className="badge" data-count={totalItems}>
            Carrito
          </Link>

          {!user && (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          )}

          {user && (
            <>
              {user.role === "admin" && <Link to="/admin">Panel Admin</Link>}
              <span className="muted" style={{ fontSize: ".9rem" }}>{user.email}</span>
              <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

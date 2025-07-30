import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={{ backgroundColor: "#333", color: "#fff", padding: "1rem" }}>
      <h1>Catálogo de Productos</h1>
      <nav style={{ marginTop: "0.5rem" }}>
        <Link to="/" style={{ marginRight: "1rem", color: "#fff" }}>
          Inicio
        </Link>
        <Link to="/login" style={{ marginRight: "1rem", color: "#fff" }}>
          Iniciar sesión
        </Link>
        <Link to="/registro" style={{ color: "#fff" }}>
          Registrarse
        </Link>
      </nav>
    </header>
  );
}

export default Header;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (correo === "admin@catalogo.com" && clave === "admin123") {
      localStorage.setItem("rol", "admin");
      alert("Bienvenido, Administrador");
      navigate("/admin");
    } else {
      localStorage.setItem("rol", "usuario");
      alert("Inicio de sesión exitoso como usuario");
      navigate("/");
    }
  };

  return (
    <div>
      <Header />
      <main style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Correo:
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{ width: "100%", marginBottom: "1rem" }}
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              style={{ width: "100%", marginBottom: "1rem" }}
            />
          </label>
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Ingresar
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;

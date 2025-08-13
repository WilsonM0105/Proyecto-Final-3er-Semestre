import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAdmin = email.includes("admin");
    login(email, password);
    navigate(isAdmin ? "/admin" : "/");
  };

  return (
    <div>
      <Header />
      <main className="form-container">
        <h2 className="title-lg" style={{ fontSize: "1.6rem" }}>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">Correo:</label>
          <input
            id="login-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="login-pass">Contraseña:</label>
          <input
            id="login-pass"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button className="btn btn-primary" type="submit" aria-label="Ingresar a la cuenta">
            Ingresar
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;

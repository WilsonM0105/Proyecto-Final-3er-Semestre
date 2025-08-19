import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await apiPost("/api/auth/login", { email, password });
      setSession(user, token);
      navigate(user.rol === "admin" ? "/admin" : "/");
    } catch {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div>
      <Header />
      <main className="form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>Correo:</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <label>Contraseña:</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary" type="submit">Ingresar</button>
        </form>
      </main>
    </div>
  );
}
export default Login;

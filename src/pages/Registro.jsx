import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { apiPost } from "../api/client";

function Registro() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiPost("/api/auth/register", form);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("No se pudo registrar (¿email ya registrado?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="form-container">
        <h2>Registrarse</h2>
        <form onSubmit={onSubmit}>
          <label>Nombre:</label>
          <input
            className="input"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            required
          />

          <label>Correo:</label>
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />

          <label>Contraseña:</label>
          <input
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Registro;

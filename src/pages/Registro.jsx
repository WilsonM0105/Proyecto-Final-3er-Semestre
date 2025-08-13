import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Registro() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registro completado (simulado). Ahora puedes iniciar sesión.");
    setForm({ nombre: "", email: "", password: "" });
    navigate("/login");
  };

  return (
    <div>
      <Header />
      <main className="form-container">
        <h2>Registrarse</h2>

        <span className="sr-only" role="status" aria-live="polite" />

        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="reg-nombre">Nombre:</label>
          <input
            id="reg-nombre"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            autoComplete="name"
            required
          />

          <label htmlFor="reg-email">Correo:</label>
          <input
            id="reg-email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
            required
          />

          <label htmlFor="reg-pass">Contraseña:</label>
          <input
            id="reg-pass"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
            required
          />

          <button type="submit" aria-label="Crear cuenta nueva">Crear cuenta</button>
        </form>
      </main>
    </div>
  );
}

export default Registro;

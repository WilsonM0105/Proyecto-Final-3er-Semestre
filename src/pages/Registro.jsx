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
    // Simulación: guardar en localStorage
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
        <h2 className="title-lg" style={{ fontSize: "1.6rem" }}>Registrarse</h2>

        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="reg-nombre">Nombre:</label>
          <input
            id="reg-nombre"
            className="input"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            autoComplete="name"
            required
          />

          <label htmlFor="reg-email">Correo:</label>
          <input
            id="reg-email"
            className="input"
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
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
            required
          />

          <button className="btn btn-primary" type="submit" aria-label="Crear cuenta nueva">
            Crear cuenta
          </button>
        </form>
      </main>
    </div>
  );
}

export default Registro;

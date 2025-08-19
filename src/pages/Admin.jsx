// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { apiDel, apiGet, apiPatch, apiPost, apiPut } from "../api/client";
import { useNavigate } from "react-router-dom";

const initialForm = {
  id: null,
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: "",
  categoria_id: "",   // usamos ID para el select
  estado: "disponible",
  stock: 1
};

export default function Admin() {
  const { token, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // búsqueda/orden
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("nombre-asc");

  // formulario (crear/editar)
  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) navigate("/");
  }, [user, isAdmin, navigate]);

  // Cargar categorías (para el select del formulario)
  useEffect(() => {
    apiGet("/api/categorias")
      .then(setCategorias)
      .catch((err) => {
        console.error(err);
        alert("Error cargando categorías");
      });
  }, []);

  // Cargar productos (con búsqueda y orden)
  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (sort) params.set("sort", sort);

    setLoading(true);
    apiGet(`/api/productos?${params.toString()}`)
      .then(setProductos)
      .catch((err) => {
        console.error(err);
        alert("Error cargando productos");
      })
      .finally(() => setLoading(false));
  }, [q, sort]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "precio" || name === "stock"
          ? value
          : name === "categoria_id"
          ? value
          : value
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditMode(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Sesión expirada. Inicia sesión.");

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      imagen: form.imagen.trim(),
      categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
      estado: form.estado,
      stock: Number(form.stock)
    };

    if (!payload.nombre || !payload.categoria_id || Number.isNaN(payload.precio)) {
      alert("Completa nombre, categoría e ingresa un precio válido.");
      return;
    }

    try {
      setSubmitting(true);
      if (editMode && form.id) {
        const actualizado = await apiPut(`/api/productos/${form.id}`, payload, token);
        setProductos((prev) => prev.map((p) => (p.id === form.id ? { ...p, ...actualizado } : p)));
        resetForm();
        alert("Producto actualizado");
      } else {
        const creado = await apiPost("/api/productos", payload, token);
        setProductos((prev) => [creado, ...prev]);
        resetForm();
        alert("Producto creado");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando producto");
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (p) => {
    setForm({
      id: p.id,
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: p.precio ?? "",
      imagen: p.imagen || "",
      categoria_id: p.categoria_id ? String(p.categoria_id) : "",
      estado: p.estado || "disponible",
      stock: p.stock ?? 1
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!token) return alert("Sesión expirada.");
    const ok = window.confirm("¿Eliminar este producto?");
    if (!ok) return;
    try {
      await apiDel(`/api/productos/${id}`, token);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      alert("Producto eliminado");
    } catch (err) {
      console.error(err);
      alert(err.message || "No se puede eliminar. Puede tener pedidos asociados.");
    }
  };

  const onToggleEstado = async (p) => {
    if (!token) return alert("Sesión expirada.");
    const nuevo = p.estado === "disponible" ? "no_disponible" : "disponible";
    try {
      const actualizado = await apiPatch(`/api/productos/${p.id}/estado`, { estado: nuevo }, token);
      setProductos((prev) => prev.map((x) => (x.id === p.id ? { ...x, ...actualizado } : x)));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error cambiando estado");
    }
  };

  return (
    <div>
      <Header />
      <main className="container">
        <h2 className="title-lg">Panel de Administración</h2>

        {/* Filtros de búsqueda/orden */}
        <section className="section" style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <label className="muted" style={{ display: "block", fontSize: 12 }}>Buscar</label>
              <input
                className="input"
                placeholder="Nombre o descripción"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div>
              <label className="muted" style={{ display: "block", fontSize: 12 }}>Orden</label>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="nombre-asc">Nombre A-Z</option>
                <option value="nombre-desc">Nombre Z-A</option>
                <option value="precio-asc">Precio ↑</option>
                <option value="precio-desc">Precio ↓</option>
                <option value="estado">Disponibles primero</option>
              </select>
            </div>
          </div>
        </section>

        {/* Formulario Crear / Editar */}
        <section className="section" style={{ marginTop: "1rem" }}>
          <details open>
            <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: ".5rem" }}>
              {editMode ? "✏️ Editar producto" : "➕ Agregar nuevo producto"}
            </summary>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: ".6rem", maxWidth: 720 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
                <div>
                  <label>Nombre</label>
                  <input className="input" name="nombre" value={form.nombre} onChange={onChange} required />
                </div>
                <div>
                  <label>Precio</label>
                  <input
                    className="input"
                    name="precio"
                    type="number"
                    step="0.01"
                    value={form.precio}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Descripción</label>
                <textarea className="textarea" name="descripcion" rows={3} value={form.descripcion} onChange={onChange} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
                <div>
                  <label>Imagen (URL)</label>
                  <input className="input" name="imagen" value={form.imagen} onChange={onChange} placeholder="https://..." />
                </div>
                <div>
                  <label>Categoría</label>
                  <select
                    className="select"
                    name="categoria_id"
                    value={form.categoria_id}
                    onChange={onChange}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
                <div>
                  <label>Estado</label>
                  <select className="select" name="estado" value={form.estado} onChange={onChange}>
                    <option value="disponible">disponible</option>
                    <option value="no_disponible">no_disponible</option>
                  </select>
                </div>
                <div>
                  <label>Stock</label>
                  <input className="input" name="stock" type="number" min={0} value={form.stock} onChange={onChange} />
                </div>
              </div>

              <div style={{ display: "flex", gap: ".5rem" }}>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? "Guardando..." : editMode ? "Guardar cambios" : "Crear producto"}
                </button>
                {editMode && (
                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </details>
        </section>

        {/* Tabla de productos */}
        <section className="section" style={{ marginTop: "1rem" }}>
          {loading ? (
            <p className="muted">Cargando…</p>
          ) : productos.length === 0 ? (
            <p className="muted">No hay productos para tu búsqueda.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>${Number(p.precio).toFixed(2)}</td>
                      <td>{p.categoria}</td>
                      <td>
                        <span className={`chip ${p.estado === "disponible" ? "chip--ok" : "chip--off"}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td>{p.stock ?? "-"}</td>
                      <td style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                        <button className="btn btn-secondary" type="button" onClick={() => onEdit(p)}>Editar</button>
                        <button className="btn" type="button" onClick={() => onToggleEstado(p)}>
                          {p.estado === "disponible" ? "Marcar no disp." : "Marcar disponible"}
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => onDelete(p.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

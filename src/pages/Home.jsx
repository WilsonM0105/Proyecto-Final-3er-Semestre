// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { apiGet } from "../api/client";
import ProductoCard from "../components/ProductoCard";

function Home() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("0");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("nombre-asc");
  const [loading, setLoading] = useState(true);

  // Cargar categorías 1 vez
  useEffect(() => {
    apiGet("/api/categorias")
      .then(setCategorias)
      .catch((err) => {
        console.error(err);
        alert("Error cargando categorías");
      });
  }, []);

  // Cargar productos al cambiar filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (categoriaId !== "0") params.set("categoriaId", categoriaId);
    if (q.trim()) params.set("q", q.trim());
    if (sort) params.set("sort", sort);

    setLoading(true);
    apiGet(`/api/productos?${params.toString()}`)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoriaId, q, sort]);

  // Preservar filtro al ir al detalle (si lo usas)
  const linkSuffix = useMemo(
    () => (categoriaId !== "0" ? `?catId=${categoriaId}` : ""),
    [categoriaId]
  );

  return (
    <div>
      <Header />

      <main className="container">
        {/* Controles */}
        <section className="section" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "end" }}>
            <div>
              <label className="muted" style={{ display: "block", fontSize: 12 }}>
                Categoría
              </label>
              <select
                className="select"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                <option value="0">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="muted" style={{ display: "block", fontSize: 12 }}>
                Buscar
              </label>
              <input
                className="input"
                placeholder="Nombre o descripción"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div>
              <label className="muted" style={{ display: "block", fontSize: 12 }}>
                Orden
              </label>
              <select
                className="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Ordenar productos"
              >
                <option value="nombre-asc">Nombre A-Z</option>
                <option value="nombre-desc">Nombre Z-A</option>
                <option value="precio-asc">Precio ↑</option>
                <option value="precio-desc">Precio ↓</option>
                <option value="estado">Disponibles primero</option>
              </select>
            </div>
          </div>
        </section>

        {/* Listado */}
        {loading ? (
          <p className="muted">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="muted">No hay productos para los filtros seleccionados.</p>
        ) : (
          <section id="contenedor-productos" className="grid">
            {items.map((p) => (
              <ProductoCard key={p.id} producto={p} linkSuffix={linkSuffix} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;

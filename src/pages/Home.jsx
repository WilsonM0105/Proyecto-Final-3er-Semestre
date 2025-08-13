import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { productos as data } from "../data/productos";
import Header from "../components/Header";
import FiltroCategoria from "../components/FiltroCategoria";
import ProductoCard from "../components/ProductoCard";
import SearchBar from "../components/SearchBar";
import SortControls from "../components/SortControls";
import Loader from "../components/Loader";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Leer parámetros de URL
  const catURL = searchParams.get("cat") || "todos";
  const qURL = searchParams.get("q") || "";
  const sortURL = searchParams.get("sort") || "nombre-asc";

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(catURL);
  const [query, setQuery] = useState(qURL);
  const [sort, setSort] = useState(sortURL);

  // Loader simulado (para UX y listo para backend)
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [categoriaSeleccionada, query, sort]);

  // Handlers que sincronizan estado + URL
  const handleCambiarCategoria = (cat) => {
    setCategoriaSeleccionada(cat);
    const next = Object.fromEntries(searchParams.entries());
    if (cat === "todos") delete next.cat; else next.cat = cat;
    setSearchParams(next, { replace: true });
  };

  const handleSearch = (text) => {
    setQuery(text);
    const next = Object.fromEntries(searchParams.entries());
    if (!text) delete next.q; else next.q = text;
    setSearchParams(next, { replace: true });
  };

  const handleSort = (value) => {
    setSort(value);
    const next = Object.fromEntries(searchParams.entries());
    if (!value || value === "nombre-asc") delete next.sort; else next.sort = value;
    setSearchParams(next, { replace: true });
  };

  // Sincroniza si cambia la URL (volver atrás, link compartido)
  useEffect(() => {
    if (catURL !== categoriaSeleccionada) setCategoriaSeleccionada(catURL);
    if (qURL !== query) setQuery(qURL);
    if (sortURL !== sort) setSort(sortURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catURL, qURL, sortURL]);

  // Filtro por categoría + búsqueda
  const filtrados = useMemo(() => {
    let list = categoriaSeleccionada === "todos"
      ? data
      : data.filter((p) => p.categoria === categoriaSeleccionada);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [categoriaSeleccionada, query]);

  // Orden
  const productosFinal = useMemo(() => {
    const arr = [...filtrados];
    switch (sort) {
      case "nombre-desc":
        arr.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "precio-asc":
        arr.sort((a, b) => Number(a.precio) - Number(b.precio));
        break;
      case "precio-desc":
        arr.sort((a, b) => Number(b.precio) - Number(a.precio));
        break;
      case "estado":
        arr.sort((a, b) => {
          const va = a.estado === "disponible" ? 0 : 1;
          const vb = b.estado === "disponible" ? 0 : 1;
          if (va !== vb) return va - vb;
          return a.nombre.localeCompare(b.nombre);
        });
        break;
      case "nombre-asc":
      default:
        arr.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return arr;
  }, [filtrados, sort]);

  return (
    <div>
      <Header />
      <main className="container" style={{ display: "grid", gap: "1rem" }}>
        {/* Controles superiores */}
        <div className="section" style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
          <FiltroCategoria
            categoriaSeleccionada={categoriaSeleccionada}
            onCambiarCategoria={handleCambiarCategoria}
          />
          <SearchBar value={query} onSearch={handleSearch} />
          <SortControls value={sort} onChange={handleSort} />
        </div>

        {/* Loader */}
        {loading && (
          <div className="section">
            <Loader text="Cargando productos…" />
          </div>
        )}

        {/* Estado vacío */}
        {!loading && productosFinal.length === 0 && (
          <div className="section center muted">
            No se encontraron productos con esos criterios.
          </div>
        )}

        {/* Grid de productos */}
        {!loading && productosFinal.length > 0 && (
          <div className="grid">
            {productosFinal.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productos as data } from "../data/productos";
import Header from "../components/Header";
import FiltroCategoria from "../components/FiltroCategoria";
import ProductoCard from "../components/ProductoCard";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catURL = searchParams.get("cat") || "todos";
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(catURL);

  // Cuando cambia el select, actualiza estado + query string
  const handleCambiarCategoria = (cat) => {
    setCategoriaSeleccionada(cat);
    if (cat === "todos") {
      searchParams.delete("cat");
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ cat }, { replace: true });
    }
  };

  // Si cambia el query (por botón volver, refresh, etc), reflejarlo en el estado
  useEffect(() => {
    if (catURL !== categoriaSeleccionada) setCategoriaSeleccionada(catURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catURL]);

  const productosFiltrados =
    categoriaSeleccionada === "todos"
      ? data
      : data.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <div>
      <Header />
      <main style={{ padding: "1rem" }}>
        <FiltroCategoria
          categoriaSeleccionada={categoriaSeleccionada}
          onCambiarCategoria={handleCambiarCategoria}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          {productosFiltrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;

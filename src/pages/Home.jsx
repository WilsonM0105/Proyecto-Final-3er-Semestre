import { useState } from "react";
import { productos as data } from "../data/productos";
import Header from "../components/Header";
import FiltroCategoria from "../components/FiltroCategoria";
import ProductoCard from "../components/ProductoCard";

function Home() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");

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
          onCambiarCategoria={setCategoriaSeleccionada}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {productosFiltrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;

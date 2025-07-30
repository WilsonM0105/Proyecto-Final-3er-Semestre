import { useState } from "react";
import { productos as datosIniciales } from "../data/productos";
import Header from "../components/Header";

function Admin() {
  const [productos, setProductos] = useState(datosIniciales);
  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria: "Tecnología",
    estado: "disponible",
  });

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (editando !== null) {
      // Editar
      const nuevos = productos.map((p) =>
        p.id === editando ? { ...formulario, id: editando } : p
      );
      setProductos(nuevos);
      setEditando(null);
    } else {
      // Agregar
      const nuevo = {
        ...formulario,
        id: productos.length + 1,
        precio: parseFloat(formulario.precio),
      };
      setProductos([...productos, nuevo]);
    }

    // Resetear
    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      categoria: "Tecnología",
      estado: "disponible",
    });
  };

  const manejarEliminar = (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  const manejarEditar = (producto) => {
    setFormulario({ ...producto });
    setEditando(producto.id);
  };

  const cambiarEstado = (id, nuevoEstado) => {
    const actualizados = productos.map((p) =>
      p.id === id ? { ...p, estado: nuevoEstado } : p
    );
    setProductos(actualizados);
  };

  return (
    <div>
      <Header />
      <main style={{ padding: "1rem" }}>
        <h2>{editando ? "Editar producto" : "Agregar nuevo producto"}</h2>
        <form
          onSubmit={manejarSubmit}
          style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={formulario.descripcion}
            onChange={manejarCambio}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formulario.precio}
            onChange={manejarCambio}
            required
          />
          <input
            type="text"
            name="imagen"
            placeholder="URL de la imagen"
            value={formulario.imagen}
            onChange={manejarCambio}
            required
          />
          <select
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
          >
            <option value="Tecnología">Tecnología</option>
            <option value="Hogar">Hogar</option>
            <option value="Ropa">Ropa</option>
            <option value="Deportes">Deportes</option>
          </select>
          <select
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
          >
            <option value="disponible">Disponible</option>
            <option value="no disponible">No disponible</option>
          </select>
          <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>
        </form>

        <hr style={{ margin: "2rem 0" }} />
        <h2>Productos existentes</h2>
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos
              .sort((a, b) => a.categoria.localeCompare(b.categoria))
              .map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.estado}</td>
                  <td>
                    <button onClick={() => manejarEditar(producto)}>
                      Editar
                    </button>
                    <button onClick={() => manejarEliminar(producto.id)}>
                      Eliminar
                    </button>
                    {producto.estado === "disponible" ? (
                      <button
                        onClick={() =>
                          cambiarEstado(producto.id, "no disponible")
                        }
                      >
                        No disponible
                      </button>
                    ) : (
                      <button
                        onClick={() => cambiarEstado(producto.id, "disponible")}
                      >
                        Disponible
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Admin;

function FiltroCategoria({ categoriaSeleccionada, onCambiarCategoria }) {
  return (
    <div style={{ margin: "1rem 0", textAlign: "center" }}>
      <label htmlFor="filtro-categoria">
        <strong>Filtrar por categoría:</strong>
      </label>
      <select
        id="filtro-categoria"
        value={categoriaSeleccionada}
        onChange={(e) => onCambiarCategoria(e.target.value)}
        style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
      >
        <option value="todos">Todos</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Hogar">Hogar</option>
        <option value="Ropa">Ropa</option>
        <option value="Deportes">Deportes</option>
      </select>
    </div>
  );
}

export default FiltroCategoria;

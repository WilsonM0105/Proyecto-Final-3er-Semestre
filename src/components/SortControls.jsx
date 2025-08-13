function SortControls({ value = "nombre-asc", onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Ordenar productos"
      style={{
        padding: ".6rem .8rem",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
      }}
    >
      <option value="nombre-asc">Nombre (A–Z)</option>
      <option value="nombre-desc">Nombre (Z–A)</option>
      <option value="precio-asc">Precio (menor a mayor)</option>
      <option value="precio-desc">Precio (mayor a menor)</option>
      <option value="estado">Disponibles primero</option>
    </select>
  );
}

export default SortControls;

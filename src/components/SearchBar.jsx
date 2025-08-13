import { useState, useEffect } from "react";

function SearchBar({ value = "", onSearch }) {
  const [term, setTerm] = useState(value);

  // Si el valor cambia desde la URL, reflejarlo en el input
  useEffect(() => {
    setTerm(value);
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setTerm(v);
    onSearch(v);
  };

  return (
    <input
      type="search"
      placeholder="Buscar por nombre o descripción..."
      value={term}
      onChange={handleChange}
      aria-label="Buscar productos"
      style={{
        flex: 1,
        minWidth: 220,
        padding: ".6rem .8rem",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#f9fafb",
      }}
    />
  );
}

export default SearchBar;

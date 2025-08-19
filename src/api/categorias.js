import { apiGet, apiPost } from "./client";

export function fetchCategorias() {
  return apiGet("/api/categorias");
}

export function crearCategoria(nombre, token) {
  return apiPost("/api/categorias", { nombre }, token);
}

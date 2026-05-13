/**
 * LUXARA JOYERÍA - MÓDULO DE API
 * Centraliza todas las llamadas HTTP al backend Spring Boot.
 */

const API_BASE = 'http://localhost:8080/api';

// ========================================
// SESIÓN
// ========================================
function getToken() { return localStorage.getItem("luxara_token"); }

function setSession(data) {
  localStorage.setItem("luxara_token", data.token);
  localStorage.setItem("luxara_user", JSON.stringify({
    nombre: data.nombre, email: data.email, rol: data.rol
  }));
}

function clearSession() {
  localStorage.removeItem("luxara_token");
  localStorage.removeItem("luxara_user");
}

function getUser() {
  const u = localStorage.getItem("luxara_user");
  return u ? JSON.parse(u) : null;
}

function isAdmin() { const u = getUser(); return u && u.rol === "ADMIN"; }
function isLoggedIn() { return !!getToken(); }

// ========================================
// FETCH BASE
// ========================================
async function request(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || json.detail || "Error en la petición");
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    if (error.name === "TypeError") throw new Error("No se pudo conectar con el servidor");
    throw error;
  }
}

// ========================================
// AUTH
// ========================================
const AuthAPI = {
  async login(email, password) {
    const data = await request("/auth/login", "POST", { email, password });
    setSession(data);
    return data;
  },
  async registro(nombre, email, password, telefono = "", direccion = "") {
    const data = await request("/auth/registro", "POST",
      { nombre, email, password, telefono, direccion });
    setSession(data);
    return data;
  },
  logout() { clearSession(); window.location.href = "index.html"; }
};

// ========================================
// PRODUCTOS (MongoDB)
// ========================================
const ProductosAPI = {
  async listar(categoria = null, buscar = null) {
    let url = "/productos";
    const params = new URLSearchParams();
    if (categoria) params.append("categoria", categoria);
    if (buscar) params.append("buscar", buscar);
    if (params.toString()) url += "?" + params.toString();
    return request(url);
  },
  async destacados() { return request("/productos/destacados"); },
  async obtener(id) { return request(`/productos/${id}`); },
  async crear(producto) { return request("/productos", "POST", producto); },
  async actualizar(id, producto) { return request(`/productos/${id}`, "PUT", producto); },
  async eliminar(id) { return request(`/productos/${id}`, "DELETE"); },
  async ofertas() { return request("/productos/ofertas"); },
  async nuevos() { return request("/productos/nuevos"); }
};

// ========================================
// CARRITO
// ========================================
const CarritoAPI = {
  async ver() { return request("/carrito"); },
  async agregar(productoId, cantidad = 1) {
    return request("/carrito/items", "POST", { productoId, cantidad });
  },
  async actualizar(productoId, cantidad) {
    return request(`/carrito/items/${productoId}`, "PUT", { cantidad });
  },
  async eliminarItem(productoId) {
    return request(`/carrito/items/${productoId}`, "DELETE");
  },
  async vaciar() { return request("/carrito", "DELETE"); }
};

// ========================================
// VENTAS
// ========================================
const VentasAPI = {
  async confirmarPedido(items, metodoPago = "efectivo") {
    return request("/ventas", "POST", { items, metodoPago });
  },
  async misPedidos() { return request("/ventas/mis-pedidos"); },
  async todas() { return request("/ventas"); },
  async actualizarEstado(id, estado) {
    return request(`/ventas/${id}/estado`, "PUT", { estado });
  }
};

// ========================================
// USUARIOS
// ========================================
const UsuariosAPI = {
  async miPerfil() { return request("/usuarios/perfil"); },
  async actualizarPerfil(datos) { return request("/usuarios/perfil", "PUT", datos); },
  async listarTodos() { return request("/usuarios"); }
};

// ========================================
// PROVEEDORES
// ========================================
const ProveedoresAPI = {
  async listar() { return request("/proveedores"); },
  async crear(p) { return request("/proveedores", "POST", p); },
  async actualizar(id, p) { return request(`/proveedores/${id}`, "PUT", p); },
  async eliminar(id) { return request(`/proveedores/${id}`, "DELETE"); }
};

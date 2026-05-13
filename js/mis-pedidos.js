/**
 * LUXARA JOYERÍA - MIS PEDIDOS
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) { window.location.href = "index.html"; return; }
  loadMisPedidos();
  updateCartBadge();
});

async function loadMisPedidos() {
  const container = document.getElementById("pedidosContainer");
  if (!container) return;

  container.innerHTML = `<p style="text-align:center;padding:2rem">Cargando pedidos...</p>`;

  try {
    const ventas = await VentasAPI.misPedidos();

    if (!ventas || ventas.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem">
          <p style="font-size:1.2rem;margin-bottom:1rem">Aún no tienes pedidos</p>
          <a href="productos.html" class="btn btn-primary">Ver Productos</a>
        </div>`;
      return;
    }

    container.innerHTML = ventas.map(venta => `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">Pedido #${venta.id}</span>
          <span class="order-date">${formatDate(venta.fecha)}</span>
          <span class="order-status ${estadoClase(venta.estado)}">${estadoTexto(venta.estado)}</span>
          <span class="order-total">Total: <strong>$${formatPrice(venta.total)}</strong></span>
        </div>
        ${venta.metodoPago ? `
        <div style="padding:.5rem 1.5rem; background:#f8f9fa; font-size:.85rem; color:#666; border-bottom:1px solid #eee">
          💳 Método de pago: <strong>${metodoPagoTexto(venta.metodoPago)}</strong>
        </div>` : ""}
        <div class="order-items">
          ${(venta.detalles || []).map(d => `
            <div class="order-item">
              <span>${d.productoNombre}</span>
              <span>x${d.cantidad}</span>
              <span>$${formatPrice(d.subtotal)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");

  } catch (err) {
    container.innerHTML = `<p style="color:#dc2626;text-align:center;padding:2rem">
      Error: ${err.message}</p>`;
  }
}

function estadoTexto(estado) {
  const textos = {
    PENDIENTE: "⏳ Pendiente",
    EN_PREPARACION: "🔧 En preparación",
    ENVIADO: "🚚 Enviado",
    ENTREGADO: "✅ Entregado",
    CANCELADO: "❌ Cancelado"
  };
  return textos[estado] || estado;
}

function estadoClase(estado) {
  const clases = {
    PENDIENTE: "status-pending",
    EN_PREPARACION: "status-preparing",
    ENVIADO: "status-shipped",
    ENTREGADO: "status-delivered",
    CANCELADO: "status-cancelled"
  };
  return clases[estado] || "";
}

function metodoPagoTexto(metodo) {
  const textos = {
    nequi: "Nequi",
    transferencia: "Transferencia bancaria",
    efectivo: "Pago contra entrega"
  };
  return textos[metodo] || metodo;
}

async function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge || !isLoggedIn()) return;
  try {
    const carrito = await CarritoAPI.ver();
    const total = (carrito.detalles || []).reduce((s, i) => s + i.cantidad, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? "block" : "none";
  } catch { badge.style.display = "none"; }
}

function formatPrice(price) { return Number(price).toLocaleString("es-CO"); }

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric"
  });
}

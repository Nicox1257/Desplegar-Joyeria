/**
 * LUXARA JOYERÍA - CARRITO DE COMPRAS
 * Incluye selección de método de pago y confirmación por WhatsApp.
 */

// Número de WhatsApp de la joyería (cambiar por el número real)
const WHATSAPP_NUMERO = "573245573332";

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }
  loadCarrito();
});

// ========================================
// CARGAR CARRITO
// ========================================
async function loadCarrito() {
  const container = document.getElementById("cartContainer");
  const summary   = document.getElementById("cartSummary");
  if (!container) return;

  container.innerHTML = `<p style="text-align:center;padding:2rem">Cargando carrito...</p>`;

  try {
    const carrito = await CarritoAPI.ver();
    const items   = carrito.detalles || [];

    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem">
          <p style="font-size:1.2rem;margin-bottom:1rem">Tu carrito está vacío</p>
          <a href="productos.html" class="btn btn-primary">Ver Productos</a>
        </div>`;
      if (summary) summary.style.display = "none";
      return;
    }

    if (summary) summary.style.display = "block";
    const total = items.reduce((sum, i) => sum + Number(i.subtotal), 0);

    container.innerHTML = `
      <div class="cart-items">
        ${items.map(item => `
          <div class="cart-item" id="item-${item.productoId}">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.productoNombre}</div>
              <div class="cart-item-price">$${formatPrice(item.precioUnitario)} c/u</div>
            </div>
            <div class="cart-item-controls">
              <button class="btn btn-sm btn-secondary"
                onclick="cambiarCantidad('${item.productoId}', ${item.cantidad - 1})">−</button>
              <span class="cart-item-qty">${item.cantidad}</span>
              <button class="btn btn-sm btn-secondary"
                onclick="cambiarCantidad('${item.productoId}', ${item.cantidad + 1})">+</button>
              <button class="btn btn-sm btn-danger"
                onclick="eliminarItem('${item.productoId}')">🗑</button>
            </div>
            <div class="cart-item-subtotal">$${formatPrice(item.subtotal)}</div>
          </div>
        `).join("")}
      </div>
    `;

    const totalEl = document.getElementById("cartTotal");
    if (totalEl) totalEl.textContent = "$" + formatPrice(total);

    await updateCartBadge();
  } catch (err) {
    container.innerHTML = `<p style="color:#dc2626;text-align:center;padding:2rem">
      Error al cargar el carrito: ${err.message}</p>`;
  }
}

// ========================================
// ACCIONES DEL CARRITO
// ========================================
async function cambiarCantidad(productoId, nuevaCantidad) {
  if (nuevaCantidad <= 0) { await eliminarItem(productoId); return; }
  try {
    await CarritoAPI.actualizar(productoId, nuevaCantidad);
    await loadCarrito();
  } catch (err) { showNotification(err.message, "error"); }
}

async function eliminarItem(productoId) {
  try {
    await CarritoAPI.eliminarItem(productoId);
    showNotification("Producto eliminado del carrito");
    await loadCarrito();
  } catch (err) { showNotification(err.message, "error"); }
}

async function vaciarCarrito() {
  if (!confirm("¿Vaciar todo el carrito?")) return;
  try {
    await CarritoAPI.vaciar();
    await loadCarrito();
    showNotification("Carrito vaciado");
  } catch (err) { showNotification(err.message, "error"); }
}

// ========================================
// CONFIRMAR PEDIDO — muestra modal de pago
// ========================================
async function confirmarPedido() {
  try {
    const carrito = await CarritoAPI.ver();
    const items   = carrito.detalles || [];
    if (items.length === 0) { showNotification("El carrito está vacío", "error"); return; }

    // Mostrar modal de métodos de pago
    mostrarModalPago(items);
  } catch (err) { showNotification(err.message, "error"); }
}

// ========================================
// MODAL DE MÉTODOS DE PAGO
// ========================================
function mostrarModalPago(items) {
  // Eliminar modal anterior si existe
  const anterior = document.getElementById("modalPago");
  if (anterior) anterior.remove();

  const total = items.reduce((s, i) => s + Number(i.subtotal), 0);

  const modal = document.createElement("div");
  modal.id = "modalPago";
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.5);
    display:flex; align-items:center; justify-content:center; z-index:10000;
  `;

  modal.innerHTML = `
    <div style="background:white; border-radius:1rem; padding:2rem;
                max-width:480px; width:90%; max-height:90vh; overflow-y:auto;
                box-shadow:0 20px 60px rgba(0,0,0,.3)">

      <h2 style="margin-bottom:1.5rem; font-size:1.3rem; text-align:center">
        💳 Selecciona tu método de pago
      </h2>

      <!-- Opciones de pago -->
      <div style="display:flex; flex-direction:column; gap:.75rem; margin-bottom:1.5rem">

        <label class="pago-opcion" onclick="seleccionarPago(this, 'nequi')">
          <input type="radio" name="metodoPago" value="nequi" style="display:none">
          <div style="display:flex; align-items:center; gap:1rem; padding:1rem;
                      border:2px solid #e5e7eb; border-radius:.75rem; cursor:pointer;
                      transition:.2s">
            <span style="font-size:2rem">📱</span>
            <div>
              <div style="font-weight:600">Nequi</div>
              <div style="font-size:.85rem; color:#666">Transferir al número: <strong>+57 324 557 3332</strong></div>
            </div>
          </div>
        </label>

        <label class="pago-opcion" onclick="seleccionarPago(this, 'transferencia')">
          <input type="radio" name="metodoPago" value="transferencia" style="display:none">
          <div style="display:flex; align-items:center; gap:1rem; padding:1rem;
                      border:2px solid #e5e7eb; border-radius:.75rem; cursor:pointer;
                      transition:.2s">
            <span style="font-size:2rem">🏦</span>
            <div>
              <div style="font-weight:600">Transferencia Bancaria</div>
              <div style="font-size:.85rem; color:#666">Bancolombia · Ahorros · No. <strong>123-456789-12</strong></div>
            </div>
          </div>
        </label>

        <label class="pago-opcion" onclick="seleccionarPago(this, 'efectivo')">
          <input type="radio" name="metodoPago" value="efectivo" style="display:none">
          <div style="display:flex; align-items:center; gap:1rem; padding:1rem;
                      border:2px solid #e5e7eb; border-radius:.75rem; cursor:pointer;
                      transition:.2s">
            <span style="font-size:2rem">💵</span>
            <div>
              <div style="font-weight:600">Pago contra entrega</div>
              <div style="font-size:.85rem; color:#666">Paga en efectivo cuando recibas tu pedido</div>
            </div>
          </div>
        </label>
      </div>

      <!-- Instrucciones -->
      <div id="instruccionesPago" style="background:#fef9e7; border:1px solid #f0d060;
           border-radius:.5rem; padding:1rem; margin-bottom:1.5rem; font-size:.85rem;
           display:none">
      </div>

      <!-- Total -->
      <div style="display:flex; justify-content:space-between; font-size:1.2rem;
                  font-weight:700; padding:1rem 0; border-top:2px solid #eee; margin-bottom:1rem">
        <span>Total a pagar:</span>
        <span style="color:var(--color-gold,#b8860b)">$${formatPrice(total)}</span>
      </div>

      <!-- Botones -->
      <button id="btnConfirmarPago"
              onclick="procesarPedido()"
              disabled
              style="width:100%; padding:.9rem; background:#25D366; color:white;
                     border:none; border-radius:.5rem; font-size:1rem; font-weight:600;
                     cursor:not-allowed; opacity:.5; margin-bottom:.5rem">
        ✓ Confirmar y enviar por WhatsApp
      </button>
      <button onclick="document.getElementById('modalPago').remove()"
              style="width:100%; padding:.75rem; background:transparent; color:#666;
                     border:1px solid #ddd; border-radius:.5rem; cursor:pointer; font-size:.9rem">
        Cancelar
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  // Cerrar al hacer clic fuera
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
}

let metodoPagoSeleccionado = null;

function seleccionarPago(label, metodo) {
  // Resetear estilos
  document.querySelectorAll(".pago-opcion div").forEach(d => {
    d.style.borderColor = "#e5e7eb";
    d.style.background = "white";
  });

  // Marcar seleccionado
  const div = label.querySelector("div");
  div.style.borderColor = "var(--color-gold, #b8860b)";
  div.style.background = "#fffbf0";
  metodoPagoSeleccionado = metodo;

  // Mostrar instrucciones
  const instrucciones = {
    nequi: `📱 <strong>Pasos:</strong><br>
      1. Abre Nequi y transfiere el total al número <strong>+57 324 557 3332</strong><br>
      2. En el concepto escribe tu nombre<br>
      3. Toma captura del comprobante<br>
      4. Envíala por WhatsApp junto con tu pedido`,
    transferencia: `🏦 <strong>Datos bancarios:</strong><br>
      Banco: Bancolombia · Tipo: Ahorros<br>
      No. cuenta: <strong>123-456789-12</strong><br>
      Titular: Luxara Joyería<br>
      Envía el comprobante por WhatsApp`,
    efectivo: `💵 <strong>Pago contra entrega:</strong><br>
      Tu pedido será preparado y te contactaremos para coordinar la entrega.<br>
      El pago se realiza en efectivo al momento de recibir tus productos.`
  };

  const instrEl = document.getElementById("instruccionesPago");
  instrEl.innerHTML = instrucciones[metodo];
  instrEl.style.display = "block";

  // Habilitar botón
  const btn = document.getElementById("btnConfirmarPago");
  btn.disabled = false;
  btn.style.opacity = "1";
  btn.style.cursor = "pointer";
}

// ========================================
// PROCESAR PEDIDO → guardar + WhatsApp
// ========================================
async function procesarPedido() {
  if (!metodoPagoSeleccionado) { showNotification("Selecciona un método de pago", "error"); return; }

  try {
    const carrito = await CarritoAPI.ver();
    const items   = carrito.detalles || [];
    if (items.length === 0) { showNotification("El carrito está vacío", "error"); return; }

    // Preparar payload
    const itemsPayload = items.map(i => ({
      productoId:     i.productoId,
      productoNombre: i.productoNombre,
      cantidad:        i.cantidad,
      precioUnitario:  i.precioUnitario
    }));

    // Guardar venta en el backend
    const venta = await VentasAPI.confirmarPedido(itemsPayload, metodoPagoSeleccionado);

    // Cerrar modal
    const modal = document.getElementById("modalPago");
    if (modal) modal.remove();

    // Construir mensaje de WhatsApp
    const total = items.reduce((s, i) => s + Number(i.subtotal), 0);
    const nombreMetodo = { nequi: "Nequi", transferencia: "Transferencia bancaria", efectivo: "Pago contra entrega" };

    let mensaje = `🛍️ *Nuevo pedido - Luxara Joyería*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━\n`;
    items.forEach(i => {
      mensaje += `▪ ${i.productoNombre} x${i.cantidad} — $${formatPrice(i.subtotal)}\n`;
    });
    mensaje += `━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💰 *Total: $${formatPrice(total)}*\n`;
    mensaje += `💳 *Método de pago: ${nombreMetodo[metodoPagoSeleccionado]}*\n`;
    mensaje += `🆔 *Pedido #${venta.id}*\n\n`;
    if (metodoPagoSeleccionado !== "efectivo") {
      mensaje += `_(Adjunto comprobante de pago)_`;
    }

    // Abrir WhatsApp
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    showNotification("¡Pedido confirmado! Abriendo WhatsApp...");
    setTimeout(() => window.location.href = "mis-pedidos.html", 2000);

  } catch (err) {
    showNotification(err.message, "error");
  }
}

// ========================================
// BADGE Y UTILIDADES
// ========================================
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

function formatPrice(price) {
  return Number(price).toLocaleString("es-CO");
}

function showNotification(message, type = "success") {
  const colors = { success: "var(--color-gold,#b8860b)", error: "#dc2626", info: "#0284c7" };
  const n = document.createElement("div");
  n.textContent = message;
  n.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    background:${colors[type]}; color:white;
    padding:1rem 1.5rem; border-radius:.5rem;
    box-shadow:0 10px 15px -3px rgba(0,0,0,.1);
    z-index:9999; animation:slideInRight .3s ease;
    max-width:320px; font-weight:500;
  `;
  document.body.appendChild(n);
  setTimeout(() => { n.style.animation = "slideOutRight .3s ease"; setTimeout(() => n.remove(), 300); }, 3500);
}

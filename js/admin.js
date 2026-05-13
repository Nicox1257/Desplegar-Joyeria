/**
 * LUXARA JOYERÍA — ADMIN JS
 * Lógica del dashboard: estadísticas y tabla de productos.
 * Compatible con el nuevo tema lx-*.
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn() || !isAdmin()) {
    window.location.href = "index.html";
    return;
  }
  if (document.getElementById("totalProducts")) loadDashboardStats();
});

/* ── CERRAR SESIÓN ── */
function logout() {
  if (confirm("¿Seguro que deseas cerrar sesión?")) AuthAPI.logout();
}

/* ── ESTADÍSTICAS DASHBOARD ── */
async function loadDashboardStats() {
  try {
    const productos = await ProductosAPI.listar();
    const ventas    = await VentasAPI.todas().catch(() => []);

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const cat = c => productos.filter(p => p.categoria === c).length;

    set("totalProducts", productos.length);
    set("totalCadenas",  cat("cadenas"));
    set("totalAnillos",  cat("anillos"));
    set("totalPulseras", cat("pulseras"));
    set("totalAretes",   cat("aretes"));
    set("totalFeatured", productos.filter(p => p.destacado).length);
    set("totalVentas",   ventas.length);

    // Animación de conteo
    document.querySelectorAll(".lx-stat-value").forEach(el => {
      const target = parseInt(el.textContent) || 0;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 20));
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);
    });

  } catch (err) {
    console.error("[Admin] Error cargando estadísticas:", err.message);
  }
}

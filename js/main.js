/**
 * LUXARA JOYERÍA - JAVASCRIPT PRINCIPAL
 * Conectado al backend Spring Boot vía API REST.
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initHeaderAuth();
  initHeaderScroll();
  initSearch();
  initScrollReveal();
  loadFeaturedProducts();
  updateCartBadge();
});

function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ========================================
// NAVEGACIÓN
// ========================================
function initNavigation() {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  const dropdownToggleMobile = document.querySelector(".dropdown-toggle-mobile");
  if (dropdownToggleMobile) {
    dropdownToggleMobile.addEventListener("click", function () {
      this.nextElementSibling.classList.toggle("active");
    });
  }
}

// ========================================
// HEADER: BOTÓN DE SESIÓN
// ========================================
function initHeaderAuth() {
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  if (!adminLoginBtn) return;

  const user = getUser();

  if (user) {
    adminLoginBtn.title = user.nombre;
    adminLoginBtn.addEventListener("click", () => {
      window.location.href = isAdmin() ? "admin.html" : "mis-pedidos.html";
    });
  } else {
    const modal = document.getElementById("adminLoginModal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("adminLoginForm");

    adminLoginBtn.addEventListener("click", () => modal?.classList.add("active"));
    closeModal?.addEventListener("click", () => modal?.classList.remove("active"));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailEl = document.getElementById("adminEmail");
      const passwordEl = document.getElementById("adminPassword");
      const errorEl = document.getElementById("loginError");

      try {
        const data = await AuthAPI.login(emailEl.value, passwordEl.value);
        modal.classList.remove("active");
        showNotification(`Bienvenido, ${data.nombre}`);
        // Sync local wishlist to server
        if (typeof syncWishlistOnLogin === "function") {
          syncWishlistOnLogin().catch(() => {});
        }
        setTimeout(() => {
          window.location.href = data.rol === "ADMIN" ? "admin.html" : "index.html";
        }, 800);
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err.message;
          errorEl.classList.add("active");
        }
      }
    });
  }
}

// ========================================
// PRODUCTOS DESTACADOS
// ========================================
async function loadFeaturedProducts() {
  const productsGrid = document.getElementById("featuredProductsGrid");
  const productsSection = document.getElementById("featuredProductsSection");
  if (!productsGrid) return;

  try {
    const productos = await ProductosAPI.destacados();

    if (!productos || productos.length === 0) {
      if (productsSection) productsSection.style.display = "none";
      return;
    }

    if (productsSection) productsSection.style.display = "block";

    productsGrid.innerHTML = productos.map(p => {
      const wishlistBtn = typeof createWishlistButton === 'function' ? createWishlistButton(p.id) : '';
      return `
      <div class="product-card" onclick="viewProduct('${p.id}')">
        <div class="product-image">
          ${wishlistBtn}
          <img src="${p.imagen || 'public/placeholder.jpg'}"
               alt="${p.nombre}"
               onerror="this.src='public/placeholder.jpg'">
        </div>
        <div class="product-info">
          <div class="product-category">${capitalize(p.categoria)}</div>
          <h3 class="product-name">${p.nombre}</h3>
          <div class="product-price">$${formatPrice(p.precio)}</div>
          <div class="product-actions">
            <button class="btn btn-primary btn-add-cart"
              onclick="event.stopPropagation(); addToCartHandler('${p.id}')">
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>`;
    }).join("");

  } catch (err) {
    console.warn("[Luxara] No se pudieron cargar los productos:", err.message);
    if (productsSection) productsSection.style.display = "none";
  }
}

// ========================================
// CARRITO
// ========================================
async function addToCartHandler(productoId) {
  if (!isLoggedIn()) {
    showNotification("Inicia sesión para agregar al carrito", "info");
    document.getElementById("adminLoginModal")?.classList.add("active");
    return;
  }
  try {
    await CarritoAPI.agregar(productoId, 1);
    await updateCartBadge();
    showNotification("Producto agregado al carrito");
  } catch (err) {
    showNotification(err.message, "error");
  }
}

async function updateCartBadge() {
  const cartBadge = document.getElementById("cartBadge");
  if (!cartBadge) return;

  if (!isLoggedIn()) {
    cartBadge.style.display = "none";
    return;
  }

  try {
    const carrito = await CarritoAPI.ver();
    const total = (carrito.detalles || []).reduce((sum, item) => sum + item.cantidad, 0);
    cartBadge.textContent = total;
    cartBadge.style.display = total > 0 ? "block" : "none";
  } catch {
    cartBadge.style.display = "none";
  }
}

function viewProduct(productId) {
  window.location.href = `productos.html?id=${productId}`;
}

// ========================================
// UTILIDADES
// ========================================
function formatPrice(price) {
  return Number(price).toLocaleString("es-CO");
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function showNotification(message, type = "success") {
  const colors = { success: "var(--color-gold, #b8860b)", error: "#dc2626", info: "#0284c7" };
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background-color: ${colors[type]}; color: white;
    padding: 1rem 1.5rem; border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.15);
    z-index: 9999; animation: slideInRight 0.3s ease;
    max-width: 320px; font-weight: 500;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

const notifStyles = document.createElement("style");
notifStyles.textContent = `
  @keyframes slideInRight  { from { transform:translateX(100%); opacity:0 } to { transform:translateX(0); opacity:1 } }
  @keyframes slideOutRight { from { transform:translateX(0); opacity:1 } to { transform:translateX(100%); opacity:0 } }
`;
document.head.appendChild(notifStyles);

// ========================================
// BÚSQUEDA
// ========================================
function initSearch() {
  const searchBtn     = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose   = document.getElementById("searchClose");
  const searchForm    = document.getElementById("searchForm");
  const searchInput   = document.getElementById("searchInput");

  if (!searchBtn || !searchOverlay) return;

  const open  = () => { searchOverlay.classList.add("active"); setTimeout(() => searchInput?.focus(), 80); };
  const close = () => { searchOverlay.classList.remove("active"); };

  searchBtn.addEventListener("click", open);
  searchClose?.addEventListener("click", close);
  searchOverlay.addEventListener("click", (e) => { if (e.target === searchOverlay) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput?.value.trim();
    if (q) window.location.href = `productos.html?buscar=${encodeURIComponent(q)}`;
  });
}

// ========================================
// SCROLL REVEAL
// ========================================
function initScrollReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

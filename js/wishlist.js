/**
 * LUXARA JOYERIA - WISHLIST
 * Guarda en localStorage para todos los usuarios.
 * No requiere backend - funciona 100% del lado del cliente.
 */

const WISHLIST_KEY = "luxara_wishlist";

function getLocalWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"); }
  catch { return []; }
}

function saveLocalWishlist(ids) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

function isInWishlist(productId) {
  return getLocalWishlist().includes(productId);
}

function toggleLocalWishlist(productId) {
  let ids = getLocalWishlist();
  if (ids.includes(productId)) {
    ids = ids.filter(id => id !== productId);
  } else {
    ids.push(productId);
  }
  saveLocalWishlist(ids);
  return ids.includes(productId);
}

async function toggleWishlist(productId) {
  const added = toggleLocalWishlist(productId);
  updateWishlistBadge();
  return added;
}

// Funciones de sync vacias para compatibilidad (backend Spring Boot no tiene wishlist endpoints)
async function syncWishlistOnLogin() { }
async function loadServerWishlist() { }

function updateWishlistBadge() {
  const badge = document.getElementById("wishlistBadge");
  if (!badge) return;
  const count = getLocalWishlist().length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function createWishlistButton(productId) {
  const active = isInWishlist(productId);
  return `<button class="wishlist-btn ${active ? 'active' : ''}"
            data-testid="wishlist-toggle-${productId}"
            onclick="event.stopPropagation(); handleWishlistClick('${productId}', this)"
            title="${active ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            <svg width="20" height="20" viewBox="0 0 24 24"
                 fill="${active ? 'currentColor' : 'none'}"
                 stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>`;
}

async function handleWishlistClick(productId, btn) {
  const added = await toggleWishlist(productId);
  const svg = btn.querySelector("svg");
  if (added) {
    btn.classList.add("active");
    svg.setAttribute("fill", "currentColor");
    if (typeof showNotification === "function") showNotification("Agregado a favoritos");
  } else {
    btn.classList.remove("active");
    svg.setAttribute("fill", "none");
    if (typeof showNotification === "function") showNotification("Eliminado de favoritos", "info");
  }
}

// Init on load
document.addEventListener("DOMContentLoaded", () => {
  updateWishlistBadge();
});

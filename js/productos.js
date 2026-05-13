/**
 * LUXARA JOYERÍA - PÁGINA DE PRODUCTOS
 * Carga el catálogo desde MongoDB vía el backend.
 */

let currentCategory = "";
let isProductDetail = false;
let viewMode = "todos"; // "todos" | "ofertas" | "nuevos"

function applyFilters() {
  loadProducts();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initFilters();
  // loadProducts() es llamado dentro de initFilters() cuando hay modo especial (ofertas/nuevos/categoria)
  // Solo se llama aquí si no hay ningún parámetro especial en la URL y no es detalle
  const p = new URLSearchParams(window.location.search);
  if (!isProductDetail && !p.get("ofertas") && !p.get("nuevos") && !p.get("categoria") && !p.get("id")) {
    loadProducts();
  }
});

// ========================================
// FILTROS Y BÚSQUEDA
// ========================================
function initFilters() {
  const params = new URLSearchParams(window.location.search);
  const catParam     = params.get("categoria");
  const idParam      = params.get("id");
  const ofertasParam = params.get("ofertas");
  const nuevosParam  = params.get("nuevos");

  // Si hay un ID específico, cargar detalle del producto
  if (idParam && idParam.trim()) {
    isProductDetail = true;
    loadProductDetail(idParam.trim());
    return;
  }

  // Modo Búsqueda
  const buscarParam = params.get("buscar");
  if (buscarParam && buscarParam.trim()) {
    const titleEl    = document.getElementById("pageTitle");
    const subtitleEl = document.querySelector(".page-subtitle");
    if (titleEl)    titleEl.textContent = `Resultados: "${buscarParam}"`;
    if (subtitleEl) subtitleEl.textContent = "Productos encontrados para tu búsqueda";
    document.querySelector(".products-filters")?.style && (document.querySelector(".products-filters").style.display = "none");
    document.querySelector(".price-filters")?.style    && (document.querySelector(".price-filters").style.display    = "none");
    loadProductsBuscar(buscarParam.trim());
    return;
  }

  // Modo Ofertas
  if (ofertasParam === "true") {
    viewMode = "ofertas";
    const titleEl    = document.getElementById("pageTitle");
    const subtitleEl = document.querySelector(".page-subtitle");
    if (titleEl)    titleEl.textContent = "Ofertas Especiales";
    if (subtitleEl) subtitleEl.textContent = "Productos con descuentos exclusivos para ti";
    document.querySelector(".products-filters")?.style && (document.querySelector(".products-filters").style.display = "none");
    document.querySelector(".price-filters")?.style    && (document.querySelector(".price-filters").style.display    = "none");
    loadProducts();
    return;
  }

  // Modo Nuevos
  if (nuevosParam === "true") {
    viewMode = "nuevos";
    const titleEl    = document.getElementById("pageTitle");
    const subtitleEl = document.querySelector(".page-subtitle");
    if (titleEl)    titleEl.textContent = "Nuevos Productos";
    if (subtitleEl) subtitleEl.textContent = "Últimas incorporaciones a nuestra colección — agregados en los últimos 7 días";
    document.querySelector(".products-filters")?.style && (document.querySelector(".products-filters").style.display = "none");
    document.querySelector(".price-filters")?.style    && (document.querySelector(".price-filters").style.display    = "none");
    loadProducts();
    return;
  }

  // Manejar filtros de botones
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      currentCategory = this.dataset.category === "todos" ? "" : this.dataset.category;
      loadProducts();
    });
  });

  // Activar el botón correspondiente si viene de URL
  if (catParam) {
    const titleEl    = document.getElementById("pageTitle");
    const subtitleEl = document.querySelector(".page-subtitle");
    if (titleEl)    titleEl.textContent = capitalize(catParam);
    if (subtitleEl) subtitleEl.textContent = `Colección de ${capitalize(catParam)} en oro laminado 18K`;
    filterButtons.forEach(btn => {
      if (btn.dataset.category === catParam) {
        btn.click();
      }
    });
    if (!document.querySelector(`.filter-btn[data-category="${catParam}"].active`)) {
      currentCategory = catParam;
      loadProducts();
    }
  }
}

// ========================================
// CARGAR CATÁLOGO
// ========================================
async function loadProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = `<p style="text-align:center;padding:2rem;color:#888">Cargando...</p>`;

  try {
    let productos;
    if (viewMode === "ofertas") {
      productos = await ProductosAPI.ofertas();
    } else if (viewMode === "nuevos") {
      productos = await ProductosAPI.nuevos();
    } else {
      productos = await ProductosAPI.listar(currentCategory || null, null);
    }

    if (!productos || productos.length === 0) {
      const emptyMsg = viewMode === "ofertas"
        ? "No hay productos en oferta por el momento."
        : viewMode === "nuevos"
          ? "No hay productos nuevos esta semana."
          : "No se encontraron productos.";
      grid.innerHTML = `<p style="text-align:center;padding:2rem;color:#888">${emptyMsg}</p>`;
      return;
    }

    // Client-side filtering and sorting (solo en modo normal)
    let filtered = [...productos];

    if (viewMode === "todos") {
      // Price range filter
      const priceRange = document.getElementById("priceRange");
      if (priceRange && priceRange.value) {
        const [min, max] = priceRange.value.split("-").map(Number);
        filtered = filtered.filter(p => p.precio >= min && p.precio <= max);
      }

      // Sort
      const sortSelect = document.getElementById("sortSelect");
      if (sortSelect && sortSelect.value) {
        switch (sortSelect.value) {
          case "precio_asc":  filtered.sort((a, b) => a.precio - b.precio); break;
          case "precio_desc": filtered.sort((a, b) => b.precio - a.precio); break;
          case "nombre_asc":  filtered.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
          case "nuevo":       filtered.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)); break;
        }
      }
    } else if (viewMode === "nuevos") {
      // Ordenar más nuevos primero
      filtered.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<p style="text-align:center;padding:2rem;color:#888">No se encontraron productos con esos filtros.</p>`;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      if (!p.id) { console.warn("Producto sin ID:", p); return ""; }

      // Manejar imagen
      let imagenSrc = 'public/placeholder.jpg';
      if (p.imagen) {
        if (p.imagen.startsWith('data:')) {
          imagenSrc = p.imagen;
        } else if (p.imagen.length > 100) {
          imagenSrc = `data:image/jpeg;base64,${p.imagen}`;
        } else {
          imagenSrc = p.imagen;
        }
      }

      const wishlistBtn = typeof createWishlistButton === 'function' ? createWishlistButton(p.id) : '';
      const descuento = p.descuento || 0;
      const precioOriginal = Number(p.precio);
      const precioFinal = descuento > 0 ? precioOriginal * (1 - descuento / 100) : precioOriginal;

      // Badge superior
      let badgeHTML = '';
      if (viewMode === "nuevos" || (p.fechaCreacion && isNuevo(p.fechaCreacion))) {
        badgeHTML = `<div class="product-badge product-badge-nuevo">NUEVO</div>`;
      }
      if (descuento > 0) {
        badgeHTML = `<div class="product-badge product-badge-oferta">-${descuento}%</div>`;
      }

      const precioHTML = descuento > 0
        ? `<div class="product-price">
             <span class="price-original">$${formatPrice(precioOriginal)}</span>
             <span class="price-final">$${formatPrice(Math.round(precioFinal))}</span>
           </div>`
        : `<div class="product-price">$${formatPrice(precioOriginal)}</div>`;

      return `
      <div class="product-card" data-testid="product-card-${p.id}" style="cursor:pointer" onclick="viewProduct('${p.id}'); return false;">
        <div class="product-image">
          ${badgeHTML}
          ${wishlistBtn}
          <img src="${imagenSrc}" alt="${p.nombre}" onerror="this.src='public/placeholder.jpg'">
        </div>
        <div class="product-info">
          <div class="product-category">${capitalize(p.categoria)}</div>
          <h3 class="product-name">${p.nombre}</h3>
          ${p.descripcion ? `<p class="product-description">${p.descripcion.substring(0, 80)}...</p>` : ""}
          ${precioHTML}
          <div class="product-stock ${p.stock > 0 ? '' : 'out-of-stock'}">
            ${p.stock > 0 ? `${p.stock} disponibles` : "Sin stock"}
          </div>
          <div class="product-actions">
            <button class="btn btn-primary btn-add-cart"
              data-testid="add-to-cart-${p.id}"
              ${p.stock === 0 ? "disabled" : ""}
              onclick="event.stopPropagation(); addToCartHandler('${p.id}')">
              ${p.stock > 0 ? "Agregar al Carrito" : "Sin stock"}
            </button>
          </div>
        </div>
      </div>`;
    }).filter(h => h).join("");

  } catch (err) {
    console.error("Error loading products:", err);
    grid.innerHTML = `<p style="color:#dc2626;text-align:center;padding:2rem">Error al cargar productos: ${err.message}</p>`;
  }
}

async function loadProductsBuscar(termino) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = `<p style="text-align:center;padding:2rem;color:#888">Buscando...</p>`;
  try {
    const productos = await ProductosAPI.listar(null, termino);
    if (!productos || productos.length === 0) {
      grid.innerHTML = `<p style="text-align:center;padding:2rem;color:#888">No se encontraron resultados para "<strong>${termino}</strong>".</p>`;
      return;
    }
    grid.innerHTML = productos.map(p => {
      if (!p.id) return "";
      let imagenSrc = "public/placeholder.jpg";
      if (p.imagen) {
        imagenSrc = p.imagen.startsWith("data:") ? p.imagen : (p.imagen.length > 100 ? `data:image/jpeg;base64,${p.imagen}` : p.imagen);
      }
      const wishlistBtn = typeof createWishlistButton === "function" ? createWishlistButton(p.id) : "";
      return `
      <div class="product-card" onclick="viewProduct('${p.id}')">
        <div class="product-image">
          ${wishlistBtn}
          <img src="${imagenSrc}" alt="${p.nombre}" onerror="this.src='public/placeholder.jpg'">
        </div>
        <div class="product-info">
          <div class="product-category">${capitalize(p.categoria)}</div>
          <h3 class="product-name">${p.nombre}</h3>
          <div class="product-price">$${formatPrice(p.precio)}</div>
          <div class="product-actions">
            <button class="btn btn-primary btn-add-cart"
              ${p.stock === 0 ? "disabled" : ""}
              onclick="event.stopPropagation(); addToCartHandler('${p.id}')">
              ${p.stock > 0 ? "Agregar al Carrito" : "Sin stock"}
            </button>
          </div>
        </div>
      </div>`;
    }).filter(h => h).join("");
  } catch (err) {
    grid.innerHTML = `<p style="color:#dc2626;text-align:center;padding:2rem">Error al buscar: ${err.message}</p>`;
  }
}

function isNuevo(fechaCreacion) {
  if (!fechaCreacion) return false;
  const fecha = new Date(fechaCreacion);
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  return fecha >= hace7Dias;
}

// ========================================
// DETALLE DE UN PRODUCTO
// ========================================
async function loadProductDetail(id) {
  const grid = document.getElementById("productsGrid");
  if (!grid) {
    console.error("Grid no encontrado");
    return;
  }

  try {
    console.log("Cargando detalle de producto:", id);
    const p = await ProductosAPI.obtener(id);
    console.log("Producto cargado:", p);
    console.log("Imagen raw:", p.imagen);
    console.log("Imagen length:", p.imagen ? p.imagen.length : "sin imagen");
    console.log("Imagen starts with data:", p.imagen?.startsWith("data:"));

    if (!p) {
      grid.innerHTML = `<p style="color:#dc2626;text-align:center;padding:2rem">
        Producto no encontrado.</p>`;
      return;
    }

    const atributosHTML = p.atributos?.length
      ? `<div class="product-attributes">
          <h4>📋 Especificaciones</h4>
          <ul>${p.atributos.map(a =>
            `<li><strong>${a.clave}:</strong> ${a.valor}</li>`
          ).join("")}</ul>
        </div>`
      : "";

    const whatsappMessage = encodeURIComponent(`Hola, me interesa el producto: *${p.nombre}* - $${formatPrice(p.precio)}. ¿Tienes disponibilidad?`);
    const whatsappURL = `https://wa.me/573245573332?text=${whatsappMessage}`;

    // Manejar imagen
    let imagenSrc = 'public/placeholder.jpg';
    if (p.imagen) {
      if (p.imagen.startsWith('data:')) {
        imagenSrc = p.imagen;
      } else if (p.imagen.length > 100) {
        // Probablemente Base64 sin prefijo
        imagenSrc = `data:image/jpeg;base64,${p.imagen}`;
      } else if (!p.imagen.startsWith('/') && !p.imagen.startsWith('http')) {
        // Es una ruta relativa - prefijamos el backend
        imagenSrc = `http://localhost:8080/${p.imagen}`;
      } else {
        imagenSrc = p.imagen;
      }
    }
    console.log("📷 Detalle - Imagen:", {
      imagenLength: p.imagen?.length || 0,
      imagenSrc: imagenSrc.substring(0, 50),
      esDataURI: imagenSrc.startsWith('data:')
    });

    grid.innerHTML = `
      <div class="product-detail">
        <div class="back-button-wrapper">
          <button class="back-button" onclick="window.history.back()">
            ← Volver al Catálogo
          </button>
        </div>

        <div class="product-detail-inner">
          <div class="product-detail-image" id="imagenContainer">
          </div>
          <div class="product-detail-info">
            <span class="product-category">${capitalize(p.categoria)}</span>
            <h1>${p.nombre}</h1>
            <div class="product-price">$${formatPrice(p.precio)}</div>
            <p>${p.descripcion || "Producto de alta calidad de Luxara Joyería"}</p>
            ${atributosHTML}
            <div class="product-stock">
              ✓ Stock disponible: <strong>${p.stock || 0}</strong> unidades
            </div>
            <div class="product-actions">
              <button class="btn btn-primary"
                ${p.stock === 0 ? "disabled" : ""}
                onclick="addToCartHandler('${p.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                ${p.stock > 0 ? "Agregar al Carrito" : "Sin stock"}
              </button>
              <a href="${whatsappURL}" target="_blank" class="whatsapp-button">
                <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Crear imagen separadamente para evitar problemas con Base64 largo en template strings
    const imgContainer = grid.querySelector("#imagenContainer");
    if (imgContainer) {
      console.log("Container dimensions:", {
        width: imgContainer.offsetWidth,
        height: imgContainer.offsetHeight,
        clientWidth: imgContainer.clientWidth,
        clientHeight: imgContainer.clientHeight
      });

      // Usar Image object invisible para cargar la imagen sin agregarla al DOM
      const imgLoader = new Image();
      imgLoader.onload = () => {
        console.log("✅ Imagen cargada correctamente", {
          width: imgLoader.width,
          height: imgLoader.height
        });
        
        // Establecer background-image para el efecto de lupa
        imgContainer.style.backgroundImage = `url(${imagenSrc})`;
        imgContainer.style.backgroundSize = "contain";
        imgContainer.style.backgroundPosition = "center";
        imgContainer.style.backgroundRepeat = "no-repeat";
        imgContainer.style.cursor = "zoom-in";
        
        // Agregar efecto lupa (zoom solo en la zona del cursor)
        let isZooming = false;
        
        imgContainer.addEventListener("mouseenter", () => {
          isZooming = true;
          imgContainer.style.backgroundSize = "240% 240%";
          imgContainer.style.cursor = "crosshair";
        });
        
        imgContainer.addEventListener("mousemove", (e) => {
          if (!isZooming) return;
          
          const rect = imgContainer.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Calcular posición como porcentaje del contenedor
          const xPercent = (x / rect.width) * 100;
          const yPercent = (y / rect.height) * 100;
          
          // Posicionar el background para mostrar la zona ampliada bajo el cursor
          imgContainer.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        });
        
        imgContainer.addEventListener("mouseleave", () => {
          isZooming = false;
          imgContainer.style.backgroundSize = "95%";
          imgContainer.style.backgroundPosition = "center";
          imgContainer.style.cursor = "zoom-in";
        });
      };
      
      imgLoader.onerror = () => { 
        console.error("Error cargando imagen:", imagenSrc);
        imgContainer.style.backgroundColor = "#ffcccb";
      };
      
      imgLoader.src = imagenSrc;
      console.log("✅ Imagen en proceso de carga con efecto lupa");
    }
  } catch (err) {
    console.error("Error loading product detail:", err);
    grid.innerHTML = `<p style="color:#dc2626">Error al cargar producto: ${err.message}</p>`;
  }
}

// ========================================
// CARRITO (reutilizado)
// ========================================
async function addToCartHandler(productoId) {
  if (!isLoggedIn()) {
    showNotification("Debes iniciar sesión para agregar al carrito", "info");
    window.location.href = "index.html";
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
  if (!cartBadge || !isLoggedIn()) {
    if (cartBadge) cartBadge.style.display = "none";
    return;
  }
  try {
    const carrito = await CarritoAPI.ver();
    const total = (carrito.detalles || []).reduce((s, i) => s + i.cantidad, 0);
    cartBadge.textContent = total;
    cartBadge.style.display = total > 0 ? "block" : "none";
  } catch {
    cartBadge.style.display = "none";
  }
}

function viewProduct(id) {
  if (!id || !id.trim()) {
    console.error("Producto ID inválido:", id);
    showNotification("Error: ID de producto inválido", "error");
    return false;
  }
  window.location.href = `productos.html?id=${encodeURIComponent(id.trim())}`;
  return false;
}

// Cambiar categoría desde el detalle del producto
function changeCategoryFromDetail(categoria) {
  currentCategory = categoria === "todos" ? "" : categoria;
  isProductDetail = false;
  
  // Actualizar botones activos
  document.querySelectorAll('.products-filters .filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === categoria) {
      btn.classList.add('active');
    }
  });
  
  // Recargar productos
  loadProducts();
}

// ========================================
// UTILIDADES
// ========================================
function formatPrice(price) {
  return Number(price).toLocaleString("es-CO");
}

const CATEGORY_NAMES = {
  "pulseras-ninos": "Pulseras Niños",
  "camandulas": "Camándulas"
};

function capitalize(str) {
  if (!str) return "";
  return CATEGORY_NAMES[str] || str.charAt(0).toUpperCase() + str.slice(1);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function showNotification(message, type = "success") {
  const colors = { success: "var(--color-gold,#b8860b)", error: "#dc2626", info: "#0284c7" };
  const n = document.createElement("div");
  n.textContent = message;
  n.style.cssText = `
    position:fixed;bottom:20px;right:20px;
    background:${colors[type]};color:white;
    padding:1rem 1.5rem;border-radius:.5rem;
    box-shadow:0 10px 15px -3px rgba(0,0,0,.1);
    z-index:9999;animation:slideInRight .3s ease;
    max-width:320px;font-weight:500;
  `;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = "slideOutRight .3s ease";
    setTimeout(() => n.remove(), 300);
  }, 3000);
}

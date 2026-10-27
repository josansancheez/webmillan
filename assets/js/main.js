/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios e Interiorismo S.L.
 * Lógica Principal Frontend (Vanilla JS ES6+ Modular)
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initCleanUrlBar();
  initCacheFreshnessCheck();
  initPreloader();
  initMobileNavigation();
  initHeroCarousel();
  initCatalogsSystem();
  initReviewsCarousel();
  initFaqAccordion();
  initGalleryFilter();
  initContactFormAntiDuplicates();
  initCookieConsentBanner();
  initCurrentYear();
});

/* ==========================================================================
   0A. LIMPIEZA AUTOMÁTICA DE URL EN NAVEGADOR (OCULTAR .HTML E /INDEX.HTML)
   ========================================================================== */
function initCleanUrlBar() {
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return;
  const { pathname, search, hash } = window.location;
  let cleanPath = pathname;
  if (cleanPath.endsWith("/index.html") || cleanPath === "/index") {
    cleanPath = cleanPath.replace(/\/index(?:\.html)?$/, "/");
  } else if (cleanPath.endsWith(".html")) {
    cleanPath = cleanPath.slice(0, -5);
  }
  if (cleanPath !== pathname && window.history && window.history.replaceState) {
    window.history.replaceState(null, "", `${cleanPath}${search}${hash}`);
  }
}
initCleanUrlBar();

/* ==========================================================================
   0. CONTROL DE CACHÉ Y ACTUALIZACIÓN AUTOMÁTICA AL ENTRAR EN LA WEB
   ========================================================================== */
function initCacheFreshnessCheck() {
  // 1. Si el navegador restaura la página desde la caché de historial (bfcache),
  // recargar silenciosamente para asegurar que se vean los últimos cambios.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  // 2. Limpiar cualquier Cache Storage / Service Worker antiguo si existiera
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    }).catch(() => {});
  }

  // 3. Revalidación en vivo de datos (data.js) y HTML cuando se sirve por HTTP/HTTPS
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    const bust = Date.now();

    // Comprobar si assets/js/data.js ha cambiado respecto a la copia en caché del navegador
    fetch(`assets/js/data.js?_cb=${bust}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.text() : null))
      .then((freshScriptText) => {
        if (!freshScriptText) return;
        const currentSerialized = JSON.stringify(window.MILLAN_DATA || {});
        try {
          const tempWin = {};
          const fn = new Function("window", `${freshScriptText}\nreturn window.MILLAN_DATA;`);
          const freshData = fn(tempWin);
          if (freshData && JSON.stringify(freshData) !== currentSerialized) {
            window.MILLAN_DATA = freshData;
            initCatalogsSystem();
            initReviewsCarousel();
            initFaqAccordion();
          }
        } catch (_) {
          // Ignorar errores de evaluación aislada
        }
      })
      .catch(() => {});

    // Comprobar si el propio documento HTML tiene una versión más reciente en el servidor
    const pageUrl = window.location.pathname || "/";
    fetch(`${pageUrl}?_cb=${bust}`, { method: "HEAD", cache: "no-store" })
      .then((res) => {
        if (!res.ok) return;
        const serverSignature =
          res.headers.get("etag") || res.headers.get("last-modified") || res.headers.get("content-length");
        if (!serverSignature) return;

        const storageKey = `millan_html_sig_${pageUrl}`;
        const previousSignature = localStorage.getItem(storageKey);
        localStorage.setItem(storageKey, serverSignature);

        const reloadGuardKey = `millan_reloaded_${pageUrl}_${serverSignature}`;
        if (previousSignature && previousSignature !== serverSignature && !sessionStorage.getItem(reloadGuardKey)) {
          sessionStorage.setItem(reloadGuardKey, "1");
          window.location.reload();
        }
      })
      .catch(() => {});
  }
}

/* ==========================================================================
   1. PRELOADER DE CARGA Y TRANSICIÓN ENTRE SECCIONES
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("site-preloader");
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add("preloader-hidden");
  };

  // Ocultar suavemente en cuanto el DOM está listo
  requestAnimationFrame(() => {
    setTimeout(hidePreloader, 220);
  });

  // Fallback de seguridad máximo por si algún recurso externo tarda
  setTimeout(hidePreloader, 1500);

  // Mostrar preloader brevemente al navegar entre páginas internas
  const internalLinks = document.querySelectorAll('a[href^="/"], a[href$=".html"], a[href*=".html#"]');
  internalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || link.target === "_blank" || link.hasAttribute("download") || e.ctrlKey || e.metaKey || e.shiftKey) return;

      // Si es un ancla dentro de la misma página actual, no activar preloader de página completa
      try {
        const targetUrl = new URL(href, window.location.href);
        const normCurrent = window.location.pathname.replace(/\/index(?:\.html)?$/, "/").replace(/\.html$/, "") || "/";
        const normTarget = targetUrl.pathname.replace(/\/index(?:\.html)?$/, "/").replace(/\.html$/, "") || "/";
        if (normCurrent === normTarget && targetUrl.hash) return;
      } catch (_) {}

      preloader.classList.remove("preloader-hidden");
    });
  });

  // Asegurar que al volver atrás en el navegador (bfcache) el preloader no quede bloqueado
  window.addEventListener("pageshow", () => {
    preloader.classList.add("preloader-hidden");
  });
}

/* ==========================================================================
   2. NAVEGACIÓN MÓVIL Y STICKY HEADER
   ========================================================================== */
function initMobileNavigation() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = (forceClose = false) => {
    const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
    const nextState = forceClose ? false : !isExpanded;

    menuBtn.setAttribute("aria-expanded", String(nextState));
    mobileMenu.classList.toggle("hidden", !nextState);
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle("hidden", nextState);
      iconClose.classList.toggle("hidden", !nextState);
    }
  };

  menuBtn.addEventListener("click", () => toggleMenu());

  // Cerrar menú al pulsar un enlace o presionar Escape
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(true));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(true);
  });
}

/* ==========================================================================
   3. CARRUSEL HERO (TÁCTIL + AUTOMÁTICO)
   ========================================================================== */
function initHeroCarousel() {
  const sliderContainer = document.getElementById("hero-slider");
  if (!sliderContainer) return;

  const slides = Array.from(sliderContainer.querySelectorAll(".hero-slide"));
  const dots = Array.from(sliderContainer.querySelectorAll("[data-hero-dot]"));
  const prevBtn = document.getElementById("hero-prev");
  const nextBtn = document.getElementById("hero-next");
  const pauseToggleBtn = document.getElementById("hero-pause-toggle");
  const iconPause = document.getElementById("hero-icon-pause");
  const iconPlay = document.getElementById("hero-icon-play");
  const pauseLabel = document.getElementById("hero-pause-label");

  if (slides.length <= 1) return;

  let currentIndex = 0;
  let intervalId = null;
  let isPaused = false;
  let touchStartX = 0;
  let touchEndX = 0;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentIndex);
      slide.setAttribute("aria-hidden", idx === currentIndex ? "false" : "true");
    });
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add("w-8", "bg-white", "shadow-md");
        dot.classList.remove("w-2.5", "bg-white/45");
      } else {
        dot.classList.remove("w-8", "bg-white", "shadow-md");
        dot.classList.add("w-2.5", "bg-white/45");
      }
    });
  };

  const updatePauseUI = () => {
    if (!pauseToggleBtn) return;
    pauseToggleBtn.setAttribute("aria-pressed", String(isPaused));
    pauseToggleBtn.setAttribute(
      "aria-label",
      isPaused ? "Reanudar rotación automática del carrusel" : "Pausar rotación automática del carrusel"
    );
    if (iconPause && iconPlay) {
      iconPause.classList.toggle("hidden", isPaused);
      iconPlay.classList.toggle("hidden", !isPaused);
    }
    if (pauseLabel) {
      pauseLabel.textContent = isPaused ? "Reanudar" : "Pausar";
    }
    pauseToggleBtn.classList.toggle("bg-[#52525B]", isPaused);
    pauseToggleBtn.classList.toggle("border-[#D4D4D8]", isPaused);
    pauseToggleBtn.classList.toggle("bg-black/40", !isPaused);
    pauseToggleBtn.classList.toggle("border-white/25", !isPaused);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isPaused) return;
    intervalId = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, 6000);
  };

  const stopAutoPlay = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  if (pauseToggleBtn) {
    pauseToggleBtn.addEventListener("click", () => {
      isPaused = !isPaused;
      updatePauseUI();
      if (isPaused) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      if (!isPaused) startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      if (!isPaused) startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      showSlide(idx);
      if (!isPaused) startAutoPlay();
    });
  });

  // Soporte táctil (Swipe en móviles)
  sliderContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  sliderContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          showSlide(currentIndex + 1);
        } else {
          showSlide(currentIndex - 1);
        }
        if (!isPaused) startAutoPlay();
      }
    },
    { passive: true }
  );

  // Por defecto inicia pasando las imágenes automáticamente
  showSlide(0);
  updatePauseUI();
  startAutoPlay();
}

/* ==========================================================================
   4. SISTEMA DE MARCAS, BUSCADOR EN TIEMPO REAL Y VISOR MODAL PDF / FLIPBOOK
   ========================================================================== */
function initCatalogsSystem() {
  const data = window.MILLAN_DATA;
  if (!data || !Array.isArray(data.brandsCatalogs)) return;

  const featuredContainer = document.getElementById("featured-catalogs-grid");
  const fullCatalogContainer = document.getElementById("all-catalogs-grid");
  const searchInput = document.getElementById("catalog-search-input");
  const clearSearchBtn = document.getElementById("catalog-search-clear");
  const countBadge = document.getElementById("catalog-results-count");
  const emptyState = document.getElementById("catalog-empty-state");
  const categoryButtons = document.querySelectorAll("[data-catalog-category]");

  let activeCategory = "all";
  let currentSearchQuery = "";

  // Generador HTML de tarjeta de catálogo
  const createCatalogCardHTML = (item) => {
    const isExposicion = item.sede === "Sede Exposición";
    const sedeBadgeClasses = isExposicion
      ? "bg-[#18181B] text-white border-[#3F3F46] shadow-xs"
      : "bg-white text-[#111111] border-[#111111] shadow-xs";

    const logoBlock = item.logoUrl
      ? `<img src="${escapeHTML(item.logoUrl)}" alt="Logo ${escapeHTML(item.name)}" class="h-9 sm:h-10 w-auto max-w-[155px] object-contain" loading="lazy">`
      : `<span class="font-extrabold tracking-wider text-xs uppercase px-2.5 py-1 rounded bg-[#F9FAFB] text-[#111111] border border-[#E5E7EB]">${escapeHTML(item.logoMonogram || item.name)}</span>`;

    return `
      <article id="brand-card-${escapeHTML(item.id)}" class="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col card-hover shadow-sm scroll-mt-28" data-brand-id="${escapeHTML(item.id)}">
        <!-- Portada del Catálogo -->
        <div class="relative h-56 overflow-hidden bg-[#F3F4F6] group">
          <img
            src="${escapeHTML(item.coverImage)}"
            alt="Portada ${escapeHTML(item.edition)} - ${escapeHTML(item.name)}"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <!-- Cabecera flotante: Logo y Año -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div class="bg-white px-3 py-1.5 rounded-xl shadow-md border border-[#E5E7EB]">
              ${logoBlock}
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#111111] text-white shadow-sm">
              Edición ${escapeHTML(item.year)}
            </span>
          </div>

          <!-- Pie de imagen: Categoría y Sede -->
          <div class="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-semibold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
              ${escapeHTML(item.category)}
            </span>
            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sedeBadgeClasses}">
              ${escapeHTML(item.sede)}
            </span>
          </div>
        </div>

        <!-- Cuerpo de la Tarjeta -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-[#18181B] leading-snug mb-1">
              ${escapeHTML(item.name)}
            </h3>
            <p class="text-sm font-semibold text-[#3F3F46] mb-2.5">
              ${escapeHTML(item.edition)}
            </p>
            <p class="text-sm text-[#52525B] line-clamp-3 mb-3">
              ${escapeHTML(item.description)}
            </p>
            ${
              Array.isArray(item.subBrands) && item.subBrands.length > 0
                ? `<div class="mb-4 p-2.5 rounded-xl bg-[#EDEDEF] border border-[#DCDCE0]">
                     <span class="block text-[10px] font-extrabold uppercase tracking-wider text-[#3F3F46] mb-1.5">Firmas Distribuidas:</span>
                     <div class="flex flex-wrap gap-1.5">
                       ${item.subBrands
                         .map(
                           (sb) =>
                             `<span class="px-2 py-0.5 rounded-md bg-white text-[#18181B] border border-[#DCDCE0] text-[11px] font-bold">${escapeHTML(sb)}</span>`
                         )
                         .join("")}
                     </div>
                   </div>`
                : ""
            }
          </div>

          <div class="pt-3 border-t border-[#E5E7EB]">
            <div class="flex items-center justify-between text-xs text-[#52525B] mb-3">
              <span class="inline-flex items-center gap-1 font-medium">
                <svg class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                ${item.pagesCount || 120} págs.
              </span>
              <span>Formato PDF · ${escapeHTML(item.fileSize || "15 MB")}</span>
            </div>

            <!-- Botones de Acción -->
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <button
                type="button"
                data-open-catalog="${escapeHTML(item.id)}"
                class="sm:col-span-3 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-primary-green cursor-pointer"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>Ver Catálogo</span>
              </button>

              <a
                href="${escapeHTML(item.pdfUrl)}"
                download="${escapeHTML(item.id)}-${escapeHTML(item.year)}.pdf"
                target="_blank"
                rel="noopener"
                class="sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#18181B] border border-[#D1D5DB] transition-colors"
                title="Descargar PDF de ${escapeHTML(item.name)}"
              >
                <svg class="w-4 h-4 text-[#3F3F46] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>Descargar PDF</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  };

  // Renderizar destacados en Inicio (index.html)
  if (featuredContainer) {
    const featuredItems = data.brandsCatalogs.filter((b) => b.featured).slice(0, 6);
    featuredContainer.innerHTML = featuredItems.map(createCatalogCardHTML).join("");
  }

  const isMarcasPage = Boolean(fullCatalogContainer);

  // Función auxiliar para saltar a una tarjeta de marca o redirigir a marcas.html
  const handleBrandLogoJump = (brandName, targetCardId) => {
    if (isMarcasPage) {
      currentSearchQuery = "";
      activeCategory = "all";
      if (searchInput) searchInput.value = "";
      categoryButtons.forEach((b, idx) => {
        b.className =
          idx === 0
            ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
            : b.hasAttribute("data-catalog-category") &&
                ["Sede Exposición", "Sede Almacén"].includes(
                  b.getAttribute("data-catalog-category")
                )
              ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer"
              : "px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
      });
      renderFullCatalog();
      const cardEl = document.getElementById(targetCardId);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
        cardEl.classList.add("ring-2", "ring-[#3F3F46]");
        setTimeout(() => cardEl.classList.remove("ring-2", "ring-[#3F3F46]"), 2200);
      }
    } else {
      window.location.href = `/marcas?q=${encodeURIComponent(brandName)}`;
    }
  };

  // Renderizar mosaico de logotipos de marcas de la Exposición por familias (#exposicion-brands-logos-wall)
  const exposicionLogosWall = document.getElementById("exposicion-brands-logos-wall");
  if (exposicionLogosWall && Array.isArray(data.exposicionSections)) {
    const brandMap = new Map(data.brandsCatalogs.map((b) => [b.id, b]));
    exposicionLogosWall.innerHTML = data.exposicionSections
      .map((sec) => {
        const items = (sec.brandIds || [])
          .map((id) => brandMap.get(id))
          .filter(Boolean);
        return `
          <div class="bg-white/90 rounded-2xl p-4 sm:p-5 border border-[#DCDCE0]">
            <div class="flex items-center justify-between gap-2 mb-3.5 pb-2 border-b border-[#F3F4F6]">
              <h4 class="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#3F3F46]">
                ${escapeHTML(sec.title)}
              </h4>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDEDEF] text-[#3F3F46]">
                ${items.length} ${items.length === 1 ? "marca" : "marcas"}
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              ${items
                .map(
                  (item) => `
                  <button
                    type="button"
                    data-brand-logo-jump="${escapeHTML(item.name)}"
                    data-brand-card-target="brand-card-${escapeHTML(item.id)}"
                    class="group bg-[#F9FAFB] hover:bg-white rounded-xl p-3 border border-[#E5E7EB] hover:border-[#3F3F46] shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center"
                    title="Ver catálogo de ${escapeHTML(item.name)} (${escapeHTML(sec.title)})"
                  >
                    <div class="h-10 w-full flex items-center justify-center px-1">
                      <img
                        src="${escapeHTML(item.logoUrl)}"
                        alt="Logo ${escapeHTML(item.name)}"
                        class="max-h-9 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <span class="text-[11px] font-bold text-[#18181B] group-hover:text-[#3F3F46] line-clamp-1">
                      ${escapeHTML(item.name)}
                    </span>
                  </button>
                `
                )
                .join("")}
            </div>
          </div>
        `;
      })
      .join("");

    exposicionLogosWall.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-brand-logo-jump]");
      if (!btn) return;
      handleBrandLogoJump(
        btn.getAttribute("data-brand-logo-jump") || "",
        btn.getAttribute("data-brand-card-target") || ""
      );
    });
  }

  // Renderizar mosaico de logotipos de marcas del Almacén (#warehouse-brands-logos-wall)
  const warehouseLogosWall = document.getElementById("warehouse-brands-logos-wall");
  if (warehouseLogosWall) {
    const warehouseBrands = data.brandsCatalogs.filter((b) => b.sede === "Sede Almacén");
    warehouseLogosWall.innerHTML = warehouseBrands
      .map(
        (item) => `
        <button
          type="button"
          data-brand-logo-jump="${escapeHTML(item.name)}"
          data-brand-card-target="brand-card-${escapeHTML(item.id)}"
          class="group bg-white hover:bg-[#F9FAFB] rounded-2xl p-3.5 border border-[#E5E7EB] hover:border-[#111111] shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
          title="Ver catálogo de ${escapeHTML(item.name)}"
        >
          <div class="h-11 w-full flex items-center justify-center px-1">
            <img
              src="${escapeHTML(item.logoUrl)}"
              alt="Logo ${escapeHTML(item.name)}"
              class="max-h-10 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <span class="text-[11px] font-bold text-[#52525B] group-hover:text-[#111111] line-clamp-1">
            ${escapeHTML(item.name)}
          </span>
        </button>
      `
      )
      .join("");

    warehouseLogosWall.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-brand-logo-jump]");
      if (!btn) return;
      handleBrandLogoJump(
        btn.getAttribute("data-brand-logo-jump") || "",
        btn.getAttribute("data-brand-card-target") || ""
      );
    });
  }

  // Renderizar y filtrar en Marcas (marcas.html) separando Exposición y Almacén en sus respectivos sitios
  const renderFullCatalog = () => {
    if (!fullCatalogContainer) return;

    const normalizedQuery = normalizeText(currentSearchQuery);
    const normActiveCat = normalizeText(activeCategory);

    const filtered = data.brandsCatalogs.filter((item) => {
      const matchesFamily =
        Array.isArray(item.exposicionFamilies) &&
        item.exposicionFamilies.some((f) => normalizeText(f) === normActiveCat);

      const matchesCategory =
        activeCategory === "all" ||
        normalizeText(item.category) === normActiveCat ||
        normalizeText(item.sede) === normActiveCat ||
        matchesFamily;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const haystack = normalizeText(
        `${item.name} ${item.edition} ${item.category} ${(item.exposicionFamilies || []).join(" ")} ${item.sede} ${item.description} ${(item.keywords || []).join(" ")}`
      );
      return haystack.includes(normalizedQuery);
    });

    const expoFiltered = filtered.filter((item) => item.sede === "Sede Exposición");
    const almacenFiltered = filtered.filter((item) => item.sede === "Sede Almacén");

    // Mostrar u ocultar los mosaicos superiores según el filtro activo
    const expoWallBox = document.getElementById("seccion-marcas-exposicion");
    const almacenWallBox = document.getElementById("seccion-marcas-almacen");
    if (expoWallBox && almacenWallBox) {
      const isOnlyAlmacen =
        activeCategory === "Sede Almacén" ||
        (expoFiltered.length === 0 && almacenFiltered.length > 0 && activeCategory !== "all");
      const isOnlyExpo =
        activeCategory === "Sede Exposición" ||
        (almacenFiltered.length === 0 && expoFiltered.length > 0 && activeCategory !== "all");
      expoWallBox.classList.toggle("hidden", isOnlyAlmacen);
      almacenWallBox.classList.toggle("hidden", isOnlyExpo);
    }

    const sectionsHtml = [];
    if (expoFiltered.length > 0) {
      sectionsHtml.push(`
        <div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b-2 border-[#18181B]">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#334155]">1. Sede Exposición · Polígono Pelagatos</span>
              <h3 class="text-2xl font-extrabold text-[#18181B]">Catálogos de Marcas de la Exposición (${expoFiltered.length})</h3>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#18181B] text-white border border-[#18181B]">
              Cerámica · Piedras · Sanitario · Grifería · Accesorios · Mamparas · Mobiliario
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${expoFiltered.map(createCatalogCardHTML).join("")}
          </div>
        </div>
      `);
    }

    if (almacenFiltered.length > 0) {
      sectionsHtml.push(`
        <div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b-2 border-[#64748B]">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#111111]">2. Sede Almacén · Polígono Pelagatos</span>
              <h3 class="text-2xl font-extrabold text-[#18181B]">Catálogos de Marcas del Almacén (${almacenFiltered.length})</h3>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#E2E8F0] text-[#111111] border border-[#64748B]">
              Obra Gruesa · Cementos · Morteros · Ferretería · Fontanería
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${almacenFiltered.map(createCatalogCardHTML).join("")}
          </div>
        </div>
      `);
    }

    fullCatalogContainer.innerHTML = sectionsHtml.join("");

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? "catálogo disponible" : "catálogos disponibles"}`;
    }

    if (emptyState) {
      emptyState.classList.toggle("hidden", filtered.length > 0);
    }

    if (clearSearchBtn) {
      clearSearchBtn.classList.toggle("hidden", currentSearchQuery.trim().length === 0);
    }
  };

  if (fullCatalogContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get("q");
    if (initialQuery) {
      currentSearchQuery = initialQuery;
      if (searchInput) searchInput.value = initialQuery;
    }

    renderFullCatalog();

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value;
        renderFullCatalog();
      });
    }

    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentSearchQuery = "";
        renderFullCatalog();
        searchInput.focus();
      });
    }

    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.getAttribute("data-catalog-category") || "all";
        categoryButtons.forEach((b) => {
          const isCurrent = b === btn;
          b.className = isCurrent
            ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
            : "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
        });
        renderFullCatalog();
      });
    });

    const resetBtn = document.getElementById("catalog-reset-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        currentSearchQuery = "";
        activeCategory = "all";
        if (searchInput) searchInput.value = "";
        categoryButtons.forEach((b, idx) => {
          b.className = idx === 0
            ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
            : "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
        });
        renderFullCatalog();
      });
    }
  }

  // Renderizar y filtrar en Chimeneas (chimeneas.html)
  const fireplacesGrid = document.getElementById("fireplaces-catalogs-grid");
  const fireplacesSearchInput = document.getElementById("fireplace-search-input");
  const fireplacesClearBtn = document.getElementById("fireplace-search-clear");
  const fireplacesCountBadge = document.getElementById("fireplace-results-count");
  const fireplacesEmptyState = document.getElementById("fireplace-empty-state");
  const fireplacesCategoryBtns = document.querySelectorAll("[data-fireplace-category]");
  const fireplacesLogosWall = document.getElementById("fireplaces-brands-logos-wall");

  if (fireplacesGrid && Array.isArray(data.fireplacesCatalogs)) {
    let activeFpCategory = "all";
    let currentFpQuery = "";

    const renderFireplacesCatalog = () => {
      const normalizedQuery = normalizeText(currentFpQuery);
      const normCat = normalizeText(activeFpCategory);
      const filtered = data.fireplacesCatalogs.filter((item) => {
        const matchesCat =
          activeFpCategory === "all" ||
          (activeFpCategory === "main" && item.isMainBrand) ||
          normalizeText(item.category) === normCat ||
          (Array.isArray(item.keywords) &&
            item.keywords.some((kw) => normalizeText(kw).includes(normCat)));

        if (!matchesCat) return false;
        if (!normalizedQuery) return true;

        const haystack = normalizeText(
          `${item.name} ${item.edition} ${item.category} ${item.description} ${(item.keywords || []).join(" ")} ${(item.subBrands || []).join(" ")}`
        );
        return haystack.includes(normalizedQuery);
      });

      fireplacesGrid.innerHTML = filtered.map(createCatalogCardHTML).join("");

      if (fireplacesCountBadge) {
        fireplacesCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? "catálogo disponible" : "catálogos disponibles"}`;
      }
      if (fireplacesEmptyState) {
        fireplacesEmptyState.classList.toggle("hidden", filtered.length > 0);
      }
      if (fireplacesClearBtn) {
        fireplacesClearBtn.classList.toggle("hidden", currentFpQuery.trim().length === 0);
      }
    };

    renderFireplacesCatalog();

    if (fireplacesSearchInput) {
      fireplacesSearchInput.addEventListener("input", (e) => {
        currentFpQuery = e.target.value;
        renderFireplacesCatalog();
      });
    }

    if (fireplacesClearBtn && fireplacesSearchInput) {
      fireplacesClearBtn.addEventListener("click", () => {
        fireplacesSearchInput.value = "";
        currentFpQuery = "";
        renderFireplacesCatalog();
        fireplacesSearchInput.focus();
      });
    }

    fireplacesCategoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFpCategory = btn.getAttribute("data-fireplace-category") || "all";
        fireplacesCategoryBtns.forEach((b) => {
          const isCurrent = b === btn;
          b.className = isCurrent
            ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
            : "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
        });
        renderFireplacesCatalog();
      });
    });

    const fpResetBtn = document.getElementById("fireplace-reset-filters");
    if (fpResetBtn) {
      fpResetBtn.addEventListener("click", () => {
        currentFpQuery = "";
        activeFpCategory = "all";
        if (fireplacesSearchInput) fireplacesSearchInput.value = "";
        fireplacesCategoryBtns.forEach((b, idx) => {
          b.className = idx === 0
            ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
            : "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
        });
        renderFireplacesCatalog();
      });
    }

    if (fireplacesLogosWall) {
      fireplacesLogosWall.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-fireplace-logo-jump]");
        if (!btn) return;
        const targetId = btn.getAttribute("data-fireplace-logo-jump") || "";
        currentFpQuery = "";
        activeFpCategory = "all";
        if (fireplacesSearchInput) fireplacesSearchInput.value = "";
        fireplacesCategoryBtns.forEach((b, idx) => {
          b.className = idx === 0
            ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
            : "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
        });
        renderFireplacesCatalog();
        const cardEl = document.getElementById(`brand-card-${targetId}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
          cardEl.classList.add("ring-2", "ring-[#3F3F46]");
          setTimeout(() => cardEl.classList.remove("ring-2", "ring-[#3F3F46]"), 2200);
        }
      });
    }

    const typeJumpBtns = document.querySelectorAll("[data-fireplace-type-jump]");
    typeJumpBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const typeKey = btn.getAttribute("data-fireplace-type-jump") || "all";
        currentFpQuery = "";
        activeFpCategory = typeKey;
        if (fireplacesSearchInput) fireplacesSearchInput.value = "";
        fireplacesCategoryBtns.forEach((b) => {
          const isCurrent =
            normalizeText(b.getAttribute("data-fireplace-category") || "") ===
            normalizeText(typeKey);
          b.className = isCurrent
            ? "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
            : "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
        });
        renderFireplacesCatalog();
        fireplacesGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // Inicializar Visor Modal / Flipbook de Catálogos (incluyendo marcas generales y chimeneas)
  const allCatalogsCombined = [
    ...data.brandsCatalogs,
    ...(Array.isArray(data.fireplacesCatalogs) ? data.fireplacesCatalogs : [])
  ];
  initCatalogModalViewer(allCatalogsCombined);
}

function initCatalogModalViewer(catalogs) {
  const modal = document.getElementById("catalog-modal");
  if (!modal) return;

  const titleEl = document.getElementById("modal-catalog-title");
  const subtitleEl = document.getElementById("modal-catalog-subtitle");
  const sedeBadgeEl = document.getElementById("modal-catalog-sede");
  const downloadBtn = document.getElementById("modal-catalog-download");
  const externalBtn = document.getElementById("modal-catalog-external");
  const closeBtn = document.getElementById("modal-catalog-close");
  const pdfFrame = document.getElementById("modal-pdf-iframe");
  const flipbookView = document.getElementById("modal-flipbook-view");
  const pdfViewContainer = document.getElementById("modal-pdf-container");
  const modePdfBtn = document.getElementById("modal-mode-pdf");
  const modeFlipBtn = document.getElementById("modal-mode-flipbook");

  // Controles de hojas del modo Flipbook interactivo
  const flipCoverImg = document.getElementById("flipbook-cover-img");
  const flipBrandName = document.getElementById("flipbook-brand-name");
  const flipEdition = document.getElementById("flipbook-edition");
  const flipDesc = document.getElementById("flipbook-description");
  const flipCategory = document.getElementById("flipbook-category");
  const flipPages = document.getElementById("flipbook-pages");
  const flipPrevBtn = document.getElementById("flipbook-prev-btn");
  const flipNextBtn = document.getElementById("flipbook-next-btn");
  const flipPageIndicator = document.getElementById("flipbook-page-indicator");
  const flipSpreadContent = document.getElementById("flipbook-Dynamic-spread");

  let activeCatalog = null;
  let currentSpread = 1;
  const totalSpreads = 3;

  // Normalizar enlaces externos (p.ej. Google Drive) para previsualización embebida
  const resolveEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com/file/d/")) {
      return url.replace(/\/view.*$/, "/preview");
    }
    return url;
  };

  const renderFlipbookSpread = () => {
    if (!activeCatalog || !flipSpreadContent) return;
    if (flipPageIndicator) {
      flipPageIndicator.textContent = `Pliego ${currentSpread} de ${totalSpreads} (Vista interactiva rápida)`;
    }

    if (currentSpread === 1) {
      flipSpreadContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div class="relative rounded-xl overflow-hidden min-h-[280px] bg-[#18181B]">
            <img src="${escapeHTML(activeCatalog.coverImage)}" alt="${escapeHTML(activeCatalog.name)}" class="w-full h-full object-cover opacity-90" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 flex flex-col justify-end">
              <span class="inline-block w-fit px-3 py-1 rounded-full text-xs font-bold bg-[#52525B] text-white mb-2">${escapeHTML(activeCatalog.category)}</span>
              <h4 class="text-2xl font-extrabold text-white">${escapeHTML(activeCatalog.name)}</h4>
              <p class="text-sm text-gray-200">${escapeHTML(activeCatalog.edition)}</p>
            </div>
          </div>
          <div class="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#111111]">Ficha de Colección · Millán Chiclana</span>
              <h5 class="text-xl font-bold text-[#18181B] mt-1 mb-3">Resumen del Catálogo Oficial ${escapeHTML(activeCatalog.year)}</h5>
              <p class="text-sm text-[#52525B] mb-4 leading-relaxed">${escapeHTML(activeCatalog.description)}</p>
              <div class="bg-white p-4 rounded-xl border border-[#E5E7EB] space-y-2 text-xs sm:text-sm">
                <div class="flex justify-between py-1 border-b border-gray-100">
                  <span class="text-[#52525B]">Disponibilidad física:</span>
                  <strong class="text-[#111111]">${escapeHTML(activeCatalog.sede)} (Pol. Pelagatos)</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-100">
                  <span class="text-[#52525B]">Extensión del documento:</span>
                  <strong class="text-[#18181B]">${activeCatalog.pagesCount || 120} páginas completas</strong>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-[#52525B]">Venta y suministro:</span>
                  <strong class="text-[#3F3F46]">Particulares y Profesionales</strong>
                </div>
              </div>
            </div>
            <div class="mt-5 pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
              <span class="text-xs text-[#52525B]">Usa las flechas para hojear o cambia a «Documento PDF Completo»</span>
              <a href="tel:+34956536104" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:underline">
                Consultar stock por teléfono &rarr;
              </a>
            </div>
          </div>
        </div>
      `;
    } else if (currentSpread === 2) {
      flipSpreadContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div class="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#3F3F46]">Gama de Producto</span>
              <h5 class="text-xl font-bold text-[#18181B] mt-1 mb-3">Aplicaciones y Especificaciones</h5>
              <p class="text-sm text-[#52525B] mb-4">En Millán Chiclana trabajamos con toda la gama oficial de <strong>${escapeHTML(activeCatalog.name)}</strong>. Si encuentras una referencia específica en el PDF, te la presupuestamos al instante.</p>
              <ul class="space-y-2.5 text-sm text-[#18181B]">
                <li class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-[#F4F4F5] text-[#111111] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  <span>Muestras reales y expositores disponibles en nuestras instalaciones de Chiclana.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-[#F4F4F5] text-[#111111] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  <span>Cálculo de m², piezas especiales, rodapiés y materiales de agarre recomendados.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-[#F4F4F5] text-[#111111] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  <span>Servicio de entrega en Chiclana, toda la provincia de Cádiz, Gibraltar y Ceuta.</span>
                </li>
              </ul>
            </div>
            <div class="mt-4 p-3 rounded-lg bg-[#EDEDEF] text-xs text-[#3F3F46] font-medium">
              Etiquetas clave: ${(activeCatalog.keywords || []).map((k) => `#${escapeHTML(k)}`).join("  ")}
            </div>
          </div>
          <div class="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#111111]">Atención Directa</span>
              <h5 class="text-xl font-bold text-[#18181B] mt-1 mb-3">¿Te interesa alguna referencia de ${escapeHTML(activeCatalog.name)}?</h5>
              <p class="text-sm text-[#52525B] mb-5">Llámanos indicando el nombre de la serie o envíanos tu consulta para recibir precio y plazo de entrega tanto para reforma particular como para obra profesional.</p>
              <div class="space-y-3">
                <a href="tel:+34956536104" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm btn-primary-green">
                  Llamar Ahora: 956 53 61 04
                </a>
                <a href="/contacto#formulario-contacto" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm btn-primary-wood">
                  Solicitar Presupuesto por Escrito
                </a>
              </div>
            </div>
            <p class="text-xs text-[#52525B] mt-4">Polígono Industrial Pelagatos · Chiclana de la Frontera (Cádiz)</p>
          </div>
        </div>
      `;
    } else {
      flipSpreadContent.innerHTML = `
        <div class="bg-[#F9FAFB] rounded-xl p-8 border border-[#E5E7EB] text-center max-w-2xl mx-auto my-auto">
          <div class="w-14 h-14 rounded-2xl bg-[#F4F4F5] text-[#111111] flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h5 class="text-2xl font-extrabold text-[#18181B] mb-2">Descarga el PDF íntegro (${activeCatalog.pagesCount || 120} páginas)</h5>
          <p class="text-sm text-[#52525B] mb-6">Puedes visualizar el PDF completo en esta misma ventana pulsando en la pestaña superior <strong>«Visor PDF Integrado»</strong> o descargarlo directamente en tu móvil u ordenador.</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="${escapeHTML(activeCatalog.pdfUrl)}" download="${escapeHTML(activeCatalog.id)}.pdf" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm btn-primary-green">
              Descargar Catálogo PDF (${escapeHTML(activeCatalog.fileSize || "15 MB")})
            </a>
            <a href="${escapeHTML(activeCatalog.pdfUrl)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white border border-[#D1D5DB] text-[#18181B] hover:bg-[#F3F4F6]">
              Abrir PDF en pestaña nueva
            </a>
          </div>
        </div>
      `;
    }
  };

  const setViewerMode = (mode) => {
    const isPdf = mode === "pdf";
    if (pdfViewContainer && flipbookView) {
      pdfViewContainer.classList.toggle("hidden", !isPdf);
      flipbookView.classList.toggle("hidden", isPdf);
    }
    if (modePdfBtn && modeFlipBtn) {
      modePdfBtn.className = isPdf
        ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-[#111111] text-white cursor-pointer"
        : "px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white cursor-pointer";
      modeFlipBtn.className = !isPdf
        ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-[#52525B] text-white cursor-pointer"
        : "px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white cursor-pointer";
    }
  };

  const openModal = (brandId) => {
    const item = catalogs.find((c) => c.id === brandId);
    if (!item) return;

    activeCatalog = item;
    currentSpread = 1;

    if (titleEl) titleEl.textContent = item.name;
    if (subtitleEl) subtitleEl.textContent = item.edition;
    if (sedeBadgeEl) sedeBadgeEl.textContent = item.sede;

    if (downloadBtn) {
      downloadBtn.setAttribute("href", item.pdfUrl);
      downloadBtn.setAttribute("download", `${item.id}-${item.year}.pdf`);
    }
    if (externalBtn) {
      externalBtn.setAttribute("href", item.pdfUrl);
    }

    const embedUrl = resolveEmbedUrl(item.pdfUrl);
    if (pdfFrame) {
      pdfFrame.setAttribute("src", embedUrl);
    }

    renderFlipbookSpread();
    setViewerMode("pdf");

    modal.classList.remove("modal-hidden");
    modal.classList.add("modal-visible");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("modal-visible");
    modal.classList.add("modal-hidden");
    document.body.style.overflow = "";
    if (pdfFrame) pdfFrame.setAttribute("src", "about:blank");
  };

  // Delegación de eventos para botones "Ver Catálogo"
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-catalog]");
    if (trigger) {
      e.preventDefault();
      const brandId = trigger.getAttribute("data-open-catalog");
      openModal(brandId);
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modePdfBtn) modePdfBtn.addEventListener("click", () => setViewerMode("pdf"));
  if (modeFlipBtn) modeFlipBtn.addEventListener("click", () => setViewerMode("flipbook"));

  if (flipPrevBtn) {
    flipPrevBtn.addEventListener("click", () => {
      currentSpread = currentSpread > 1 ? currentSpread - 1 : totalSpreads;
      renderFlipbookSpread();
    });
  }

  if (flipNextBtn) {
    flipNextBtn.addEventListener("click", () => {
      currentSpread = currentSpread < totalSpreads ? currentSpread + 1 : 1;
      renderFlipbookSpread();
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("modal-visible")) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. CARRUSEL INTERACTIVO Y SINCRONIZACIÓN AUTOMÁTICA DE RESEÑAS DE GOOGLE
   ========================================================================== */
function formatRelativeDateEs(timestampMs, fallbackText) {
  if (!timestampMs || Number.isNaN(Number(timestampMs))) return fallbackText || "Reciente";
  const diffSec = Math.max(60, Math.floor((Date.now() - Number(timestampMs)) / 1000));
  const days = Math.floor(diffSec / 86400);
  if (days < 1) return "Hoy";
  if (days === 1) return "Hace 1 día";
  if (days < 7) return `Hace ${days} días`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Hace 1 semana";
  if (weeks < 5) return `Hace ${weeks} semanas`;
  const months = Math.floor(days / 30.44);
  if (months <= 1) return "Hace 1 mes";
  if (months < 12) return `Hace ${months} meses`;
  const years = Math.floor(days / 365.25);
  if (years <= 1) return "Hace 1 año";
  return `Hace ${years} años`;
}

function updateLiveRatingBadges(sedesData) {
  if (!sedesData) return;
  ["exposicion", "almacen"].forEach((key) => {
    const info = sedesData[key];
    if (!info) return;
    document.querySelectorAll(`[data-live-rating="${key}"]`).forEach((el) => {
      el.textContent = Number(info.rating).toFixed(1);
    });
    document.querySelectorAll(`[data-live-count="${key}"]`).forEach((el) => {
      const count = Number(info.totalReviews);
      el.textContent = `${count} ${count === 1 ? "reseña" : "reseñas"} en Google`;
    });
    const starsEl = document.getElementById(`rating-stars-${key}`);
    if (starsEl) {
      const rounded = Math.round(Number(info.rating) || 5);
      starsEl.textContent = "★".repeat(Math.min(5, Math.max(1, rounded))) + "☆".repeat(Math.max(0, 5 - rounded));
    }
  });
}

function initReviewsCarousel() {
  const track = document.getElementById("reviews-carousel-track");
  if (!window.MILLAN_DATA || !Array.isArray(window.MILLAN_DATA.googleReviews)) return;

  // Actualizar contadores en cualquier página aunque no esté el carrusel
  if (window.MILLAN_DATA.company && window.MILLAN_DATA.company.sedes) {
    updateLiveRatingBadges(window.MILLAN_DATA.company.sedes);
  }

  let allReviews = window.MILLAN_DATA.googleReviews;
  const filterBtns = document.querySelectorAll("[data-review-filter]");
  const prevBtn = document.getElementById("reviews-prev-btn");
  const nextBtn = document.getElementById("reviews-next-btn");

  let activeFilter = "all";
  let currentOffset = 0;

  const getFilteredReviews = () => {
    if (activeFilter === "all") return allReviews;
    return allReviews.filter((r) => r.sede === activeFilter);
  };

  const renderReviews = () => {
    if (!track) return;
    const list = getFilteredReviews();
    if (currentOffset >= list.length) currentOffset = 0;

    track.innerHTML = list
      .slice(0, 6)
      .map((rev) => {
        const isExposicion = rev.sede === "Sede Exposición";
        const badgeStyle = isExposicion
          ? "bg-[#18181B] text-white border-[#18181B]"
          : "bg-[#F1F5F9] text-[#111111] border-[#64748B]";

        const ratingNum = Math.min(5, Math.max(1, Number(rev.rating) || 5));
        const stars = "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);
        const relativeDate = formatRelativeDateEs(rev.timestampMs, rev.date);
        const reviewLink =
          rev.authorUrl ||
          (isExposicion
            ? "https://maps.app.goo.gl/hja5eodfEP7cb46U8"
            : "https://maps.app.goo.gl/zsD1AbVrbpVkRBYB8");

        const avatarHtml = rev.avatar
          ? `<img src="${escapeHTML(rev.avatar)}" alt="${escapeHTML(rev.author)}" referrerpolicy="no-referrer" loading="lazy" class="w-10 h-10 rounded-full object-cover border border-[#E5E7EB] shrink-0" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
             <div style="display:none" class="w-10 h-10 rounded-full ${isExposicion ? "bg-[#334155]" : "bg-[#111111]"} text-white font-bold text-sm items-center justify-center shrink-0">${escapeHTML(rev.initials || "MC")}</div>`
          : `<div class="w-10 h-10 rounded-full ${isExposicion ? "bg-[#334155]" : "bg-[#111111]"} text-white font-bold text-sm flex items-center justify-center shrink-0">${escapeHTML(rev.initials || "MC")}</div>`;

        return `
          <article class="bg-white rounded-2xl p-6 border border-[#CBD5E1] shadow-sm flex flex-col justify-between card-hover h-full">
            <div>
              <!-- Cabecera de la reseña: Etiqueta de Sede + Enlace Google Maps -->
              <div class="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F3F4F6]">
                <span class="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${badgeStyle}">
                  <span class="w-2 h-2 rounded-full ${isExposicion ? "bg-white" : "bg-[#111111]"}"></span>
                  ${escapeHTML(rev.sede)}
                </span>
                <a href="${escapeHTML(reviewLink)}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-[#52525B] hover:text-[#111111] flex items-center gap-1 transition-colors">
                  <svg class="w-4 h-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 15.65 5 12c0-3.65 3.36-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"/></svg>
                  <span>Reseña de Google</span>
                </a>
              </div>

              <!-- Estrellas y fecha relativa dinámica -->
              <div class="flex items-center justify-between mb-3">
                <div class="text-amber-500 tracking-widest text-base font-bold" aria-label="${ratingNum} de 5 estrellas">
                  ${stars}
                </div>
                <span class="text-xs text-[#52525B]">${escapeHTML(relativeDate)}</span>
              </div>

              <!-- Texto de la reseña -->
              <p class="text-sm text-[#18181B] leading-relaxed mb-5 italic">
                “${escapeHTML(rev.text)}”
              </p>
            </div>

            <!-- Autor real de Google Maps -->
            <div class="flex items-center gap-3 pt-3 border-t border-[#F3F4F6]">
              ${avatarHtml}
              <div class="min-w-0">
                <a href="${escapeHTML(reviewLink)}" target="_blank" rel="noopener noreferrer" class="text-sm font-bold text-[#18181B] hover:text-[#111111] leading-tight block truncate">
                  ${escapeHTML(rev.author)}
                </a>
                <p class="text-xs text-[#52525B] truncate">${escapeHTML(rev.role)}</p>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  renderReviews();

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.getAttribute("data-review-filter") || "all";
      currentOffset = 0;
      filterBtns.forEach((b) => {
        const isCurrent = b === btn;
        b.className = isCurrent
          ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
          : "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
      });
      renderReviews();
    });
  });

  // Rotación visual de las tarjetas con los botones Anterior / Siguiente
  const rotateReviewCards = (direction) => {
    if (!Array.isArray(allReviews) || allReviews.length < 2) return;
    if (direction === "next") {
      const first = allReviews.shift();
      if (first) allReviews.push(first);
    } else {
      const last = allReviews.pop();
      if (last) allReviews.unshift(last);
    }
    renderReviews();
  };

  if (prevBtn) prevBtn.addEventListener("click", () => rotateReviewCards("prev"));
  if (nextBtn) nextBtn.addEventListener("click", () => rotateReviewCards("next"));

  // Sincronización automática en segundo plano con assets/js/google-reviews.json y Google Maps en vivo
  const applySyncedPayload = (payload) => {
    if (!payload) return;
    if (payload.sedes) {
      updateLiveRatingBadges(payload.sedes);
    }
    if (Array.isArray(payload.reviews) && payload.reviews.length > 0) {
      allReviews = payload.reviews;
      window.MILLAN_DATA.googleReviews = payload.reviews;
      renderReviews();
    }
  };

  const buildGooglePreviewUrl = (fid, queryName, sortCode = 3) => {
    const encodedFid = encodeURIComponent(fid);
    const encodedQuery = encodeURIComponent(queryName);
    return (
      `https://www.google.com/maps/preview/place?authuser=0&hl=es&gl=es&q=${encodedQuery}` +
      `&pb=%211m17%211s${encodedFid}%212s${encodedQuery}` +
      `%213m8%211m3%211d3211.316330450485%212d-6.1312967%213d36.4015412%213m2%211i1024%212i768%214f13.1` +
      `%214m2%213d36.4015369%214d-6.1287218%2115m2%211m1%214s%2Fg%2F11p1k7z_gj%2112m4%212m3%211i360%212i120%214i8` +
      `%2113m57%212m2%211i203%212i100%213m2%212i4%215b1%216m6%211m2%211i86%212i86%211m2%211i408%212i240` +
      `%217m33%211m3%211e1%212b0%213e3%211m3%211e2%212b1%213e2%211m3%211e2%212b0%213e3%211m3%211e8%212b0%213e3` +
      `%211m3%211e10%212b0%213e3%211m3%211e10%212b1%213e2%211m3%211e10%212b0%213e4%211m3%211e9%212b1%213e2%212b1%219b0` +
      `%2115m8%211m7%211m2%211m1%211e2%212m2%211i195%212i195%213i20` +
      `%2114m3%211sSHLaapi4N4Xh7_UP7uXRuAg%217e81%2115i10112` +
      `%2115m108%211m26%2113m9%212b1%213b1%214b1%216i1%218b1%219b1%2114b1%2120b1%2125b1` +
      `%2118m15%213b1%214b1%215b1%216b1%2113b1%2114b1%2117b1%2121b1%2122b1%2130b1%2132b1%2133m1%211b1%2134b1%2136e2` +
      `%2110m1%218e3%2111m1%213e1%2117b1%2120m2%211e3%211e6%2124b1%2125b1%2126b1%2127b1%2129b1%2130m1%212b1` +
      `%2136b1%2137b1%2139m3%212m2%212i1%213i1%2143b1%2152b1%2154m1%211b1%2155b1%2156m1%211b1%2161m2%211m1%211e1` +
      `%2165m5%213m4%211m3%211m2%211i224%212i298` +
      `%2172m22%211m8%212b1%215b1%217b1%2112m4%211b1%212b1%214m1%211e1%214b1` +
      `%218m10%211m6%214m1%211e1%214m1%211e3%214m1%211e4%213sother_user_google_review_posts__and__hotel_and_vr_partner_review_posts` +
      `%216m1%211e${sortCode}%219b1%2189b1%2190m2%211m1%211e2%2198m3%211b1%212b1%213b1%21103b1%21113b1` +
      `%21114m3%211b1%212m1%211b1%21117b1%21122m1%211b1%21126b1%21127b1%21128m1%211b1` +
      `%2121m0%2122m1%211e81%2130m8%213b1%216m2%211b1%212b1%217m2%211e3%212b1%219b1` +
      `%2134m5%217b1%2110b1%2114b1%2115m1%211b0%2137i800`
    );
  };

  const syncLiveFromGoogleMaps = async () => {
    const CACHE_KEY = "millan_live_google_reviews_v1";
    const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached && cached.fetchedAt && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
          applySyncedPayload(cached.data);
          return;
        }
      }
    } catch (_) {
      // Continuar si localStorage no está disponible
    }

    // 1. Cargar primero el JSON generado automáticamente en el proyecto
    try {
      const resJson = await fetch(`assets/js/google-reviews.json?t=${Math.floor(Date.now() / 600000)}`);
      if (resJson.ok) {
        const jsonData = await resJson.json();
        applySyncedPayload(jsonData);
      }
    } catch (_) {
      // Ignorar si se abre vía file:// sin servidor local
    }

    // 2. Intentar actualización en vivo desde Google Maps para ambas sedes
    try {
      const targets = [
        { key: "exposicion", sedeLabel: "Sede Exposición", fid: "0xd0c345cf1217835:0x12e0440890f2c5d1", query: "Millan" },
        { key: "almacen", sedeLabel: "Sede Almacén", fid: "0xd0c35b851710269:0xdd46cf4ed31bdd1f", query: "Millán - Almacén" }
      ];
      const liveSedes = {};
      const liveReviews = [];
      const seen = new Set();

      for (const t of targets) {
        const gUrl = buildGooglePreviewUrl(t.fid, t.query, 3);
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(gUrl)}`;
        const resp = await fetch(proxyUrl);
        if (!resp.ok) continue;
        const rawTxt = await resp.text();
        const cleanJson = rawTxt.replace(/^\)\]\}'\n/, "");
        const parsed = JSON.parse(cleanJson);
        const place = parsed?.[6];
        if (!place) continue;

        liveSedes[t.key] = {
          rating: Number(place?.[4]?.[7] ?? 5).toFixed(1),
          totalReviews: Number(place?.[4]?.[8] ?? 1)
        };

        const rBlock = place?.[175]?.[9]?.[0]?.[0] || [];
        for (const entry of rBlock) {
          const r = entry?.[0];
          if (!r || !r[0] || seen.has(r[0])) continue;
          const rating = r?.[2]?.[0]?.[0] || 5;
          if (rating < 4) continue;
          seen.add(r[0]);

          const author = r?.[1]?.[4]?.[5]?.[0] || "Cliente de Google";
          const parts = author.trim().split(/\s+/).filter(Boolean);
          const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : author.slice(0, 2).toUpperCase();
          const rawText = r?.[2]?.[15]?.[0]?.[0];

          liveReviews.push({
            id: r[0],
            author,
            initials,
            avatar: r?.[1]?.[4]?.[5]?.[1] || "",
            authorUrl: r?.[1]?.[4]?.[2]?.[0] || "",
            sede: t.sedeLabel,
            rating,
            date: (r?.[1]?.[6] || "Reciente").replace(/^Fecha de edición:\s*/i, ""),
            timestampMs: Math.round(Number(r?.[1]?.[2] || Date.now() * 1000) / 1000),
            role: `${(r?.[1]?.[4]?.[5]?.[10]?.[0] || "Cliente verificado").replace(/\u00a0/g, " ")} · Google Maps`,
            text: rawText
              ? rawText.replace(/\s+/g, " ").trim()
              : `Valoración verificada de ${rating} estrellas en Google Maps (${t.sedeLabel}).`,
            hasText: Boolean(rawText)
          });
        }
      }

      if (liveReviews.length > 0) {
        liveReviews.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          if (a.hasText !== b.hasText) return a.hasText ? -1 : 1;
          return b.timestampMs - a.timestampMs;
        });
        const firstAlm = liveReviews.findIndex((r) => r.sede === "Sede Almacén");
        if (firstAlm > 1) {
          const [almItem] = liveReviews.splice(firstAlm, 1);
          liveReviews.splice(1, 0, almItem);
        }

        const livePayload = { sedes: liveSedes, reviews: liveReviews };
        applySyncedPayload(livePayload);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: livePayload }));
        } catch (_) {}
      }
    } catch (_) {
      // Mantiene las reseñas reales ya cargadas de google-reviews.json / data.js
    }
  };

  syncLiveFromGoogleMaps();
}

/* ==========================================================================
   6. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */
function initFaqAccordion() {
  const faqContainer = document.getElementById("faq-accordion-container");
  if (!faqContainer || !window.MILLAN_DATA || !Array.isArray(window.MILLAN_DATA.faqs)) return;

  faqContainer.innerHTML = window.MILLAN_DATA.faqs
    .map(
      (item, index) => `
      <div class="faq-item bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden transition-colors ${index === 0 ? "open" : ""}">
        <button
          type="button"
          class="faq-trigger w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
          aria-expanded="${index === 0 ? "true" : "false"}"
        >
          <div>
            <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-[#3F3F46] mb-1">
              ${escapeHTML(item.category)}
            </span>
            <h3 class="text-base sm:text-lg font-bold text-[#18181B]">
              ${escapeHTML(item.question)}
            </h3>
          </div>
          <span class="faq-icon w-9 h-9 rounded-xl bg-[#F3F4F6] text-[#111111] flex items-center justify-center shrink-0 transition-transform duration-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </button>
        <div class="faq-content px-6">
          <div class="pb-5 pt-1 text-sm sm:text-base text-[#52525B] leading-relaxed border-t border-[#F3F4F6]">
            ${escapeHTML(item.answer)}
          </div>
        </div>
      </div>
    `
    )
    .join("");

  const items = faqContainer.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach((other) => {
        other.classList.remove("open");
        const btn = other.querySelector(".faq-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ==========================================================================
   7. FILTRO DE GALERÍA DE INSTALACIONES (sobre-nosotros.html)
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll("[data-gallery-filter]");
  const galleryItems = document.querySelectorAll("[data-gallery-item]");
  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-gallery-filter") || "all";

      filterBtns.forEach((b) => {
        const active = b === btn;
        b.className = active
          ? "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white shadow-sm transition-all cursor-pointer"
          : "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] hover:border-[#52525B] transition-all cursor-pointer";
      });

      galleryItems.forEach((card) => {
        const category = card.getAttribute("data-gallery-item");
        const visible = target === "all" || category === target;
        card.classList.toggle("hidden", !visible);
      });
    });
  });
}

/* ==========================================================================
   8. FORMULARIO DE CONTACTO CON PROTECCIÓN ANTI-DUPLICADOS (FRONTEND + PHP)
   ========================================================================== */
function initContactFormAntiDuplicates() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("contact-submit-btn");
  const btnText = document.getElementById("contact-btn-text");
  const btnSpinner = document.getElementById("contact-btn-spinner");
  const feedbackBox = document.getElementById("contact-form-feedback");
  const tokenInput = document.getElementById("form_token");
  const idempotencyInput = document.getElementById("idempotency_key");

  let isSubmitting = false;

  // Generar clave única de idempotencia en cliente para este intento de formulario
  const generateIdempotencyKey = () => {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "millan-" + Date.now() + "-" + Math.random().toString(36).substring(2, 11);
  };

  if (idempotencyInput && !idempotencyInput.value) {
    idempotencyInput.value = generateIdempotencyKey();
  }

  // Solicitar token de sesión al backend PHP al cargar la página
  fetch("enviar-correo.php?action=token", {
    method: "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && data.form_token && tokenInput) {
        tokenInput.value = data.form_token;
      }
    })
    .catch(() => {
      // Si se abre en entorno estático sin servidor PHP activo, mantiene token local
      if (tokenInput && !tokenInput.value) {
        tokenInput.value = generateIdempotencyKey();
      }
    });

  const showFeedback = (type, title, message) => {
    if (!feedbackBox) return;
    const isSuccess = type === "success";
    feedbackBox.className = `mt-5 p-4 rounded-xl border text-sm ${
      isSuccess
        ? "bg-emerald-50 border-emerald-500 text-emerald-950"
        : "bg-amber-50 border-amber-400 text-amber-900"
    }`;
    feedbackBox.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="font-bold text-lg leading-none mt-0.5">${isSuccess ? "✓" : "!"}</span>
        <div>
          <p class="font-bold mb-0.5">${escapeHTML(title)}</p>
          <p>${escapeHTML(message)}</p>
        </div>
      </div>
    `;
    feedbackBox.classList.remove("hidden");
  };

  const lockButtonState = (locked) => {
    isSubmitting = locked;
    if (!submitBtn) return;

    submitBtn.disabled = locked;
    submitBtn.setAttribute("aria-busy", locked ? "true" : "false");
    submitBtn.classList.toggle("opacity-75", locked);
    submitBtn.classList.toggle("cursor-not-allowed", locked);

    if (btnText) {
      btnText.textContent = locked
        ? "Enviando mensaje, por favor espera..."
        : "Enviar Consulta Ahora";
    }
    if (btnSpinner) {
      btnSpinner.classList.toggle("hidden", !locked);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Bloqueo inmediato ante doble clic o mala cobertura móvil
    if (isSubmitting) return;

    // Comprobación de enfriamiento de 60s en el navegador para evitar reenvíos accidentales
    const lastSentTime = Number(sessionStorage.getItem("millan_last_form_sent") || 0);
    const now = Date.now();
    if (now - lastSentTime < 60000) {
      const remaining = Math.ceil((60000 - (now - lastSentTime)) / 1000);
      showFeedback(
        "success",
        "Tu mensaje ya ha sido enviado",
        `Hemos recibido tu solicitud correctamente. Si deseas realizar otra consulta distinta, por favor espera ${remaining} segundos.`
      );
      return;
    }

    lockButtonState(true);

    const formData = new FormData(form);

    try {
      const response = await fetch(form.getAttribute("action") || "enviar-correo.php", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json"
        }
      });

      const result = await response.json();

      if (result && result.success) {
        sessionStorage.setItem("millan_last_form_sent", String(Date.now()));
        showFeedback(
          "success",
          result.title || "¡Mensaje enviado con éxito!",
          result.message ||
            "Hemos recibido tu consulta en Millán Chiclana. Nuestro equipo te responderá a la mayor brevedad."
        );
        form.reset();
        // Renovar token si el servidor devuelve uno nuevo para futuras consultas tras 60s
        if (result.next_token && tokenInput) {
          tokenInput.value = result.next_token;
        }
        if (idempotencyInput) {
          idempotencyInput.value = generateIdempotencyKey();
        }
        // Mantener el botón deshabilitado durante 60 segundos con confirmación clara
        if (btnText) {
          btnText.textContent = "Mensaje enviado correctamente ✓";
        }
        if (btnSpinner) {
          btnSpinner.classList.add("hidden");
        }
        setTimeout(() => {
          lockButtonState(false);
        }, 60000);
      } else {
        showFeedback(
          "warning",
          "Atención en el envío",
          (result && result.message) ||
            "Por favor, revisa los campos del formulario o llámanos directamente al 956 53 61 04."
        );
        lockButtonState(false);
      }
    } catch (error) {
      showFeedback(
        "warning",
        "No se pudo completar el envío automático",
        "Puedes llamarnos directamente al 956 53 61 04 o escribirnos a millan@millanchiclana.com."
      );
      lockButtonState(false);
    }
  });
}

/* ==========================================================================
   9. BANNER DE COOKIES RGPD PERSISTENTE (localStorage)
   ========================================================================== */
function initCookieConsentBanner() {
  const STORAGE_KEY = "millan_chiclana_cookies_v1";
  const banner = document.getElementById("cookie-banner");
  const configModal = document.getElementById("cookie-config-modal");
  const acceptAllBtn = document.getElementById("cookie-accept-all");
  const essentialOnlyBtn = document.getElementById("cookie-accept-essential");
  const openConfigBtn = document.getElementById("cookie-open-config");
  const saveConfigBtn = document.getElementById("cookie-save-preferences");
  const analyticsCheckbox = document.getElementById("cookie-chk-analytics");

  const savedConsent = localStorage.getItem(STORAGE_KEY);

  if (!savedConsent && banner) {
    banner.classList.remove("hidden");
  }

  const savePreferences = (preferences) => {
    const payload = {
      necessary: true,
      analytics: Boolean(preferences.analytics),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (banner) banner.classList.add("hidden");
    if (configModal) configModal.classList.add("hidden");
  };

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener("click", () => savePreferences({ analytics: true }));
  }

  if (essentialOnlyBtn) {
    essentialOnlyBtn.addEventListener("click", () => savePreferences({ analytics: false }));
  }

  if (openConfigBtn && configModal) {
    openConfigBtn.addEventListener("click", () => {
      configModal.classList.remove("hidden");
    });
  }

  if (saveConfigBtn) {
    saveConfigBtn.addEventListener("click", () => {
      savePreferences({
        analytics: analyticsCheckbox ? analyticsCheckbox.checked : false
      });
    });
  }

  // Botones adicionales en Política de Cookies o Footer para reabrir configuración
  document.querySelectorAll(".js-open-cookies-settings").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (configModal) {
        configModal.classList.remove("hidden");
      } else if (banner) {
        banner.classList.remove("hidden");
      }
    });
  });
}

/* ==========================================================================
   10. UTILIDADES GENERALES
   ========================================================================== */
function initCurrentYear() {
  const yearEls = document.querySelectorAll(".js-current-year, #current-year");
  const year = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = String(year);
  });
}

function normalizeText(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

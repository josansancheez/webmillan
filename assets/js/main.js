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
  initEntryAttentionAnimations();
  initMobileNavigation();
  initHeroCarousel();
  initCatalogsSystem();
  initReviewsCarousel();
  initFaqAccordion();
  initGalleryFilter();
  initContactFormAntiDuplicates();
  initCookieConsentBanner();
  initDesktopPhoneQrModal();
  initImageProtectionAndLightbox();
  initAnimatedCounters();
  initLiveStoreHoursStatus();
  initChimneyPillsAndCard3D();
  initAppleScrollAnimations();
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
   1B. ANIMACIONES DISCRETAS ÚNICAS AL ENTRAR EN LA WEB
   (Vibración única del icono de teléfono en "Llamar Ahora" + pulso único en WhatsApp)
   ========================================================================== */
function initEntryAttentionAnimations() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const phoneSvgMarkup = `
    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
    </svg>
  `;

  // Asegurar que todos los botones principales de llamada del Header tengan icono de teléfono
  document.querySelectorAll('header a[href^="tel:"]').forEach((callBtn) => {
    if (!callBtn.querySelector("svg")) {
      callBtn.insertAdjacentHTML("afterbegin", phoneSvgMarkup);
    }
  });

  // Ejecutar una única vez justo cuando se retira el preloader (~360ms tras cargar)
  setTimeout(() => {
    // 1. Vibración discreta única del icono de teléfono en los botones "Llamar Ahora"
    const callButtons = document.querySelectorAll(
      'header a[href^="tel:"], #hero-slider .hero-slide.active a[href^="tel:"]'
    );
    callButtons.forEach((btn) => {
      const icon = btn.querySelector("svg");
      if (icon) {
        icon.classList.add("phone-vibrate-once");
        setTimeout(() => icon.classList.remove("phone-vibrate-once"), 1150);
      }
      if (btn.classList.contains("btn-primary-green")) {
        btn.classList.add("cta-entry-pulse-once");
        setTimeout(() => btn.classList.remove("cta-entry-pulse-once"), 1250);
      }
    });

    // 2. Pulso discreto único en el botón flotante de WhatsApp al entrar en la web
    const whatsappBtn = document.querySelector(".whatsapp-float");
    if (whatsappBtn) {
      whatsappBtn.classList.add("whatsapp-entry-pulse-once");
      setTimeout(() => whatsappBtn.classList.remove("whatsapp-entry-pulse-once"), 1350);
    }
  }, 360);

  // Micro-interacción: si el usuario pasa el ratón por cualquier botón de teléfono más tarde, vibra 1 vez
  document.querySelectorAll('a[href^="tel:"]').forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      const icon = btn.querySelector("svg");
      if (!icon || icon.classList.contains("phone-vibrate-once")) return;
      icon.classList.add("phone-vibrate-once");
      setTimeout(() => icon.classList.remove("phone-vibrate-once"), 980);
    });
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
   3. CARRUSEL HERO (TÁCTIL + AUTOMÁTICO + BARRA DE PROGRESO EN INDICADORES)
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

  // Insertar barra de progreso visual dentro de cada dot del carrusel
  dots.forEach((dot) => {
    if (!dot.querySelector(".hero-dot-progress")) {
      const bar = document.createElement("span");
      bar.className = "hero-dot-progress";
      dot.appendChild(bar);
    }
  });

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
      dot.classList.remove("is-active-dot", "is-paused-dot");
      if (idx === currentIndex) {
        dot.classList.add("w-8", "bg-white", "shadow-md");
        dot.classList.remove("w-2.5", "bg-white/45");
        // Forzar reflow para reiniciar limpiamente la barra de progreso de 6s
        void dot.offsetWidth;
        dot.classList.add("is-active-dot");
        if (isPaused) dot.classList.add("is-paused-dot");
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

    const activeDot = dots[currentIndex];
    if (activeDot) {
      activeDot.classList.toggle("is-paused-dot", isPaused);
    }
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

    const rawPdfUrl = String(item.pdfUrl || "").trim();
    const isDemoPdf = rawPdfUrl.includes("catalogo-demo-millan.pdf");
    const cleanPdfUrl = isDemoPdf ? "" : rawPdfUrl;
    const externalCatalogUrl =
      item.externalUrl ||
      (/^https?:\/\//i.test(cleanPdfUrl) &&
      !/\.pdf(\?.*)?$/i.test(cleanPdfUrl) &&
      !cleanPdfUrl.includes("drive.google.com/file/")
        ? cleanPdfUrl
        : "");
    const hasPdfCatalog = Boolean(cleanPdfUrl && !externalCatalogUrl);
    const hasCatalog = Boolean(externalCatalogUrl || hasPdfCatalog);

    const catalogMetaHTML = externalCatalogUrl
      ? ""
      : hasPdfCatalog
        ? `<span class="inline-flex items-center gap-1 font-medium">
            <svg class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            ${item.pagesCount || 120} págs.
          </span>
          <span>Formato PDF · ${escapeHTML(item.fileSize || "15 MB")}</span>`
        : `<span class="inline-flex items-center gap-1 font-medium text-[#71717A]">
            <svg class="w-4 h-4 text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
            Sin catálogo online
          </span>
          <span class="text-[#71717A]">Consultar en tienda</span>`;

    const viewCatalogBtnHTML = externalCatalogUrl
      ? `<a
          href="${escapeHTML(externalCatalogUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full h-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-primary-green cursor-pointer text-center"
          title="Abrir catálogo de ${escapeHTML(item.name)} en una nueva pestaña"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span>Ver Catálogo</span>
        </a>`
      : hasPdfCatalog
        ? `<button
            type="button"
            data-open-catalog="${escapeHTML(item.id)}"
            class="w-full h-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-primary-green cursor-pointer text-center"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <span>Ver Catálogo</span>
          </button>`
        : `<span
            aria-disabled="true"
            class="w-full h-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#E5E7EB] text-[#71717A] border border-[#D1D5DB] cursor-not-allowed select-none text-center"
            title="Esta marca no dispone de catálogo digital"
          >
            <svg class="w-4 h-4 shrink-0 text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
            <span>Sin Catálogo</span>
          </span>`;

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
            ${
              catalogMetaHTML
                ? `<div class="flex items-center justify-between text-xs text-[#52525B] mb-3">${catalogMetaHTML}</div>`
                : ""
            }

            <!-- Botones de Acción (Tamaños iguales) -->
            <div class="grid grid-cols-2 gap-2.5 items-stretch">
              ${viewCatalogBtnHTML}

              <button
                type="button"
                data-open-brand-quote="${escapeHTML(item.id)}"
                class="w-full h-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-secondary-quote bg-[#F9FAFB] text-[#18181B] border border-[#D1D5DB] cursor-pointer text-center"
                title="Pedir presupuesto de ${escapeHTML(item.name)}"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>Pedir Presupuesto</span>
              </button>
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
      window.location.href = `marcas.html?q=${encodeURIComponent(brandName)}`;
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

  // Inicializar desplegables de marcas por sede en Inicio (index.html)
  document.querySelectorAll("[data-brands-collapsible]").forEach((box) => {
    const trigger = box.querySelector("[data-brands-collapsible-trigger]");
    const body = box.querySelector("[data-brands-collapsible-body]");
    const label = box.querySelector("[data-brands-collapsible-label]");
    const icon = box.querySelector("[data-brands-collapsible-icon]");
    if (!trigger || !body) return;

    trigger.addEventListener("click", () => {
      const isCurrentlyOpen = trigger.getAttribute("aria-expanded") === "true";
      const nextOpen = !isCurrentlyOpen;
      trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
      body.classList.toggle("hidden", !nextOpen);

      if (label) {
        label.textContent = nextOpen
          ? label.getAttribute("data-label-open") || "Ocultar marcas"
          : label.getAttribute("data-label-closed") || "Desplegar marcas";
      }
      if (icon) {
        icon.classList.toggle("rotate-180", nextOpen);
      }

      if (nextOpen) {
        requestAnimationFrame(() => {
          body.querySelectorAll(".apple-reveal").forEach((el) => {
            el.classList.add("is-inview");
          });
        });
      }
    });
  });

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

    const sectionsHtml = [];
    if (expoFiltered.length > 0) {
      sectionsHtml.push(`
        <div id="seccion-marcas-exposicion" class="scroll-mt-24">
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
        <div id="seccion-marcas-almacen" class="scroll-mt-24">
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

    // Animar suavemente las tarjetas filtradas
    fullCatalogContainer.querySelectorAll("article").forEach((card, idx) => {
      card.classList.add("filter-animate-in");
      card.style.animationDelay = `${Math.min(idx * 40, 320)}ms`;
    });

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

  // Inicializar Visor Modal / Flipbook de Catálogos y Modal de Presupuesto por Marca
  const allCatalogsCombined = [
    ...data.brandsCatalogs,
    ...(Array.isArray(data.fireplacesCatalogs) ? data.fireplacesCatalogs : [])
  ];
  initCatalogModalViewer(allCatalogsCombined);
  initBrandQuoteModal(allCatalogsCombined);
}

function formatBrandQuoteTarget(item) {
  if (!item) return "";
  const rawSede = String(item.sede || "").toLowerCase();
  const destino = rawSede.includes("almac") ? "Almacén" : "Exposición";
  const material = String(item.category || "Material").trim();
  return `${item.name} (${material}) - ${destino}`;
}

function initBrandQuoteModal(catalogs) {
  let modal = document.getElementById("brand-quote-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "brand-quote-modal";
    modal.className =
      "hidden modal-hidden fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm items-center justify-center p-3 sm:p-4 overflow-y-auto";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-labelledby", "brand-quote-modal-title");

    modal.innerHTML = `
      <div class="bg-white text-[#18181B] w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden my-auto">
        <!-- Cabecera del Modal -->
        <div class="bg-[#111111] text-white px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-3 border-b border-gray-800">
          <div class="min-w-0">
            <span class="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#D4D4D8] mb-0.5">
              Solicitud de Presupuesto por Marca
            </span>
            <h3 id="brand-quote-modal-title" class="text-lg sm:text-xl font-extrabold text-white truncate">
              Pedir Presupuesto
            </h3>
          </div>
          <button
            id="brand-quote-close-btn"
            type="button"
            aria-label="Cerrar ventana de presupuesto"
            class="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Formulario -->
        <form id="brand-quote-form" action="enviar-correo.php" method="POST" class="p-5 sm:p-7 space-y-4" novalidate>
          <!-- Honeypot y Tokens de Seguridad -->
          <div class="hidden" aria-hidden="true">
            <label for="bq-website-hp">No rellenar este campo</label>
            <input id="bq-website-hp" name="website_hp" type="text" tabindex="-1" autocomplete="off" />
          </div>
          <input id="bq-form-token" name="form_token" type="hidden" value="" />
          <input id="bq-idempotency-key" name="idempotency_key" type="hidden" value="" />
          <input id="bq-sede-interes" name="sede_interes" type="hidden" value="" />
          <input name="privacidad" type="hidden" value="1" />

          <!-- Cuadro fijo no editable: Marca (Tipo de material) - Destino -->
          <div>
            <label for="brand-quote-locked-input" class="block text-xs font-extrabold uppercase tracking-wider text-[#3F3F46] mb-1.5">
              Marca, Material y Destino Seleccionado
            </label>
            <div class="relative">
              <input
                id="brand-quote-locked-input"
                name="marca_presupuesto"
                type="text"
                readonly
                tabindex="-1"
                aria-readonly="true"
                value=""
                class="w-full px-4 py-3 pr-10 rounded-xl bg-[#F3F4F6] border-2 border-[#D1D5DB] text-sm font-extrabold text-[#111111] select-none cursor-not-allowed focus:outline-none"
              />
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52525B] pointer-events-none" title="Campo bloqueado">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
            </div>
          </div>

          <!-- Nombre y Teléfono -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="bq-nombre" class="block text-xs font-bold text-[#18181B] mb-1">
                Nombre <span class="text-red-600">*</span>
              </label>
              <input
                id="bq-nombre"
                name="nombre"
                type="text"
                required
                placeholder="Tu nombre y apellidos"
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-sm text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>

            <div>
              <label for="bq-telefono" class="block text-xs font-bold text-[#18181B] mb-1">
                Teléfono <span class="text-red-600">*</span>
              </label>
              <input
                id="bq-telefono"
                name="telefono"
                type="tel"
                required
                placeholder="Ej: 600 000 000"
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-sm text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>
          </div>

          <!-- Correo y Asunto -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="bq-email" class="block text-xs font-bold text-[#18181B] mb-1">
                Correo electrónico <span class="text-red-600">*</span>
              </label>
              <input
                id="bq-email"
                name="email"
                type="email"
                required
                placeholder="tucorreo@ejemplo.com"
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-sm text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>

            <div>
              <label for="bq-asunto" class="block text-xs font-bold text-[#18181B] mb-1">
                Asunto <span class="text-red-600">*</span>
              </label>
              <input
                id="bq-asunto"
                name="asunto"
                type="text"
                required
                placeholder="Ej: Presupuesto pavimento / serie..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-sm text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>
          </div>

          <!-- Mensaje -->
          <div>
            <label for="bq-mensaje" class="block text-xs font-bold text-[#18181B] mb-1">
              Mensaje <span class="text-red-600">*</span>
            </label>
            <textarea
              id="bq-mensaje"
              name="mensaje"
              rows="3"
              required
              placeholder="Indícanos el modelo, medidas aproximadas, cantidad o cualquier consulta sobre esta marca..."
              class="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-sm text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]"
            ></textarea>
          </div>

          <p class="text-[11px] text-[#52525B] leading-relaxed">
            Todos los campos marcados con <span class="text-red-600 font-bold">*</span> son obligatorios. Al enviar aceptas nuestra <a href="privacidad.html" target="_blank" class="underline font-semibold hover:text-[#111111]">Política de Privacidad</a>.
          </p>

          <!-- Mensaje de estado / feedback -->
          <div id="brand-quote-feedback" class="hidden rounded-xl p-3.5 text-xs sm:text-sm font-semibold"></div>

          <!-- Botones de acción del modal -->
          <div class="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              id="brand-quote-cancel-btn"
              type="button"
              class="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#18181B] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="brand-quote-submit-btn"
              type="submit"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold btn-primary-green cursor-pointer"
            >
              <svg class="btn-mail-icon w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="btn-mail-label">Enviar Solicitud de Presupuesto</span>
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const form = document.getElementById("brand-quote-form");
  const lockedInput = document.getElementById("brand-quote-locked-input");
  const sedeHiddenInput = document.getElementById("bq-sede-interes");
  const tokenInput = document.getElementById("bq-form-token");
  const idempotencyInput = document.getElementById("bq-idempotency-key");
  const titleEl = document.getElementById("brand-quote-modal-title");
  const closeBtn = document.getElementById("brand-quote-close-btn");
  const cancelBtn = document.getElementById("brand-quote-cancel-btn");
  const submitBtn = document.getElementById("brand-quote-submit-btn");
  const feedbackEl = document.getElementById("brand-quote-feedback");

  let currentLockedValue = "";

  // Garantizar que el cuadro bloqueado no se pueda alterar nunca
  if (lockedInput) {
    ["input", "change", "keydown", "paste", "cut"].forEach((evtName) => {
      lockedInput.addEventListener(evtName, (e) => {
        e.preventDefault();
        lockedInput.value = currentLockedValue;
      });
    });
  }

  const generateTokens = () => {
    const nowSec = Math.floor(Date.now() / 1000);
    if (idempotencyInput) {
      const rand = Math.random().toString(36).substring(2, 12);
      idempotencyInput.value = `bq_${nowSec}_${rand}`;
    }
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
        if (tokenInput && !tokenInput.value) {
          tokenInput.value = btoa(String(nowSec));
        }
      });
  };

  let isSubmitting = false;
  let cooldownTimer = null;
  const defaultBtnHTML = submitBtn ? submitBtn.innerHTML : "";

  const resetSubmitButton = () => {
    if (cooldownTimer) {
      clearTimeout(cooldownTimer);
      cooldownTimer = null;
    }
    isSubmitting = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.setAttribute("aria-busy", "false");
      submitBtn.classList.remove("opacity-75", "cursor-not-allowed", "pointer-events-none");
      submitBtn.innerHTML = defaultBtnHTML;
    }
  };

  const openQuoteModal = (brandId) => {
    const item = catalogs.find((c) => c.id === brandId);
    if (!item) return;

    currentLockedValue = formatBrandQuoteTarget(item);
    if (lockedInput) lockedInput.value = currentLockedValue;
    if (sedeHiddenInput) sedeHiddenInput.value = currentLockedValue;
    if (titleEl) titleEl.textContent = `Pedir Presupuesto · ${item.name}`;

    if (feedbackEl) {
      feedbackEl.className = "hidden rounded-xl p-3.5 text-xs sm:text-sm font-semibold";
      feedbackEl.textContent = "";
    }

    resetSubmitButton();
    generateTokens();

    modal.classList.remove("hidden", "modal-hidden");
    modal.classList.add("flex", "modal-visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const firstInput = document.getElementById("bq-nombre");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 60);
    }
  };

  const closeQuoteModal = () => {
    modal.classList.remove("flex", "modal-visible");
    modal.classList.add("hidden", "modal-hidden");
    modal.setAttribute("aria-hidden", "true");
    const catalogModal = document.getElementById("catalog-modal");
    const isCatalogModalOpen = catalogModal && catalogModal.classList.contains("modal-visible");
    if (!isCatalogModalOpen) {
      document.body.style.overflow = "";
    }
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-brand-quote]");
    if (trigger) {
      e.preventDefault();
      const brandId = trigger.getAttribute("data-open-brand-quote");
      openQuoteModal(brandId);
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeQuoteModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeQuoteModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeQuoteModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("modal-visible")) {
      closeQuoteModal();
    }
  });

  if (form) {
    const showFeedback = (msg, isError) => {
      if (!feedbackEl) return;
      feedbackEl.className = isError
        ? "rounded-xl p-3.5 text-xs sm:text-sm font-semibold bg-red-50 border border-red-300 text-red-900"
        : "rounded-xl p-3.5 text-xs sm:text-sm font-semibold bg-emerald-50 border border-emerald-300 text-emerald-900";
      feedbackEl.textContent = msg;
    };

    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        if (isSubmitting) {
          e.preventDefault();
          e.stopPropagation();
          showFeedback(
            "Estamos enviando tu solicitud. Con cobertura lenta (3G/datos) puede tardar unos segundos; no es necesario pulsar de nuevo.",
            false
          );
        }
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) {
        showFeedback(
          "Estamos enviando tu solicitud. Por favor espera unos segundos sin volver a pulsar.",
          false
        );
        return;
      }

      if (lockedInput) lockedInput.value = currentLockedValue;
      if (sedeHiddenInput) sedeHiddenInput.value = currentLockedValue;

      const nombre = (document.getElementById("bq-nombre")?.value || "").trim();
      const telefono = (document.getElementById("bq-telefono")?.value || "").trim();
      const email = (document.getElementById("bq-email")?.value || "").trim();
      const asunto = (document.getElementById("bq-asunto")?.value || "").trim();
      const mensaje = (document.getElementById("bq-mensaje")?.value || "").trim();

      if (!nombre || !telefono || !email || !asunto || !mensaje) {
        showFeedback("Por favor, completa todos los campos obligatorios (Nombre, Teléfono, Correo, Asunto y Mensaje).", true);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback("Por favor, introduce una dirección de correo electrónico válida.", true);
        return;
      }

      const phoneDigits = telefono.replace(/\D/g, "");
      if (phoneDigits.length < 9) {
        showFeedback("Por favor, introduce un número de teléfono válido (mínimo 9 dígitos).", true);
        return;
      }

      // Evitar reenvíos duplicados de la misma solicitud o en ventana de 60s
      const payloadFingerprint = `${email.toLowerCase()}|${phoneDigits}|${asunto.toLowerCase()}|${currentLockedValue.toLowerCase()}|${mensaje.toLowerCase()}`;
      const lastFingerprint = sessionStorage.getItem("millan_last_bq_fingerprint") || "";
      const lastSentTime = Number(sessionStorage.getItem("millan_last_bq_sent") || 0);
      const now = Date.now();

      if (payloadFingerprint === lastFingerprint && now - lastSentTime < 600000) {
        showFeedback(
          "¡Tu solicitud de presupuesto ya ha sido enviada! Hemos registrado tu mensaje correctamente y te responderemos muy pronto.",
          false
        );
        return;
      }

      if (now - lastSentTime < 60000) {
        const remaining = Math.ceil((60000 - (now - lastSentTime)) / 1000);
        showFeedback(
          `Hemos recibido tu solicitud correctamente. Si deseas pedir otro presupuesto distinto, espera ${remaining} segundos.`,
          false
        );
        return;
      }

      isSubmitting = true;
      if (submitBtn) {
        const iconEl = submitBtn.querySelector(".btn-mail-icon");
        if (
          iconEl &&
          !(
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          )
        ) {
          const btnRect = submitBtn.getBoundingClientRect();
          const iconRect = iconEl.getBoundingClientRect();
          const slideDist = Math.max(
            120,
            Math.round(btnRect.right - iconRect.right - 12)
          );
          submitBtn.style.minWidth = `${Math.ceil(btnRect.width)}px`;
          submitBtn.style.setProperty("--mail-slide-x", `${slideDist}px`);
          submitBtn.classList.remove("is-revealing-msg");
          submitBtn.classList.add("is-sliding-mail");
          await new Promise((r) => setTimeout(r, 680));
          submitBtn.classList.remove("is-sliding-mail");
          submitBtn.classList.add("is-revealing-msg");
        }
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.classList.add("opacity-75", "cursor-not-allowed", "pointer-events-none");
        submitBtn.innerHTML = `
          <svg class="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span class="btn-mail-label">Enviando solicitud, espera por favor...</span>
        `;
      }

      try {
        const formData = new FormData(form);
        formData.set("marca_presupuesto", currentLockedValue);
        formData.set("sede_interes", currentLockedValue);

        const response = await fetch(form.getAttribute("action") || "enviar-correo.php", {
          method: "POST",
          body: formData,
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
          }
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result && result.success) {
          sessionStorage.setItem("millan_last_bq_sent", String(Date.now()));
          sessionStorage.setItem("millan_last_bq_fingerprint", payloadFingerprint);

          showFeedback(
            result.message || "¡Solicitud enviada correctamente! Nuestro equipo te responderá con tu presupuesto lo antes posible.",
            false
          );
          form.reset();
          if (lockedInput) lockedInput.value = currentLockedValue;
          if (sedeHiddenInput) sedeHiddenInput.value = currentLockedValue;
          if (result.next_token && tokenInput) {
            tokenInput.value = result.next_token;
          } else {
            generateTokens();
          }

          if (submitBtn) {
            submitBtn.innerHTML = `<span>Solicitud enviada correctamente ✓</span>`;
          }
          cooldownTimer = setTimeout(() => {
            resetSubmitButton();
          }, 60000);
        } else {
          showFeedback(
            (result && result.message) || "No se pudo enviar la solicitud en este momento. También puedes llamarnos al 956 53 61 04.",
            true
          );
          resetSubmitButton();
        }
      } catch (err) {
        // Mantenemos el mismo idempotency_key por si la petición sí llegó al servidor con 3G lento y el usuario pulsa reintentar
        showFeedback(
          "Error de conexión al enviar el formulario. Si tienes poca cobertura, espera unos segundos antes de reintentar o llámanos al 956 53 61 04.",
          true
        );
        resetSubmitButton();
      }
    });
  }
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
                <button type="button" data-open-brand-quote="${escapeHTML(activeCatalog.id)}" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm btn-primary-wood cursor-pointer">
                  Pedir Presupuesto de ${escapeHTML(activeCatalog.name)}
                </button>
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
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h5 class="text-2xl font-extrabold text-[#18181B] mb-2">¿Necesitas presupuesto de ${escapeHTML(activeCatalog.name)}?</h5>
          <p class="text-sm text-[#52525B] mb-6">Puedes visualizar el catálogo completo pulsando en la pestaña superior <strong>«Visor PDF Integrado»</strong> o solicitar presupuesto directo de esta marca.</p>
          <div class="flex flex-wrap justify-center gap-3">
            <button type="button" data-open-brand-quote="${escapeHTML(activeCatalog.id)}" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm btn-primary-green cursor-pointer">
              Pedir Presupuesto de ${escapeHTML(activeCatalog.name)}
            </button>
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

    const rawPdfUrl = String(item.pdfUrl || "").trim();
    const cleanPdfUrl = rawPdfUrl.includes("catalogo-demo-millan.pdf") ? "" : rawPdfUrl;
    const externalCatalogUrl =
      item.externalUrl ||
      (/^https?:\/\//i.test(cleanPdfUrl) &&
      !/\.pdf(\?.*)?$/i.test(cleanPdfUrl) &&
      !cleanPdfUrl.includes("drive.google.com/file/")
        ? cleanPdfUrl
        : "");

    if (externalCatalogUrl) {
      window.open(externalCatalogUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (!cleanPdfUrl) return;

    activeCatalog = item;
    currentSpread = 1;

    if (titleEl) titleEl.textContent = item.name;
    if (subtitleEl) subtitleEl.textContent = item.edition;
    if (sedeBadgeEl) sedeBadgeEl.textContent = item.sede;

    if (downloadBtn) {
      downloadBtn.setAttribute("data-open-brand-quote", item.id);
      downloadBtn.removeAttribute("download");
      downloadBtn.setAttribute("href", `#presupuesto-${item.id}`);
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

      galleryItems.forEach((card, idx) => {
        const category = card.getAttribute("data-gallery-item");
        const visible = target === "all" || category === target;
        card.classList.toggle("hidden", !visible);
        if (visible) {
          card.classList.remove("filter-animate-in");
          void card.offsetWidth;
          card.classList.add("filter-animate-in");
          card.style.animationDelay = `${Math.min(idx * 45, 270)}ms`;
        }
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
  const btnMailIcon = document.getElementById("contact-btn-mail-icon");
  const btnText = document.getElementById("contact-btn-text");
  const btnSpinner = document.getElementById("contact-btn-spinner");
  const feedbackBox = document.getElementById("contact-form-feedback");
  const tokenInput = document.getElementById("form_token");
  const idempotencyInput = document.getElementById("idempotency_key");

  let isSubmitting = false;

  // Animación en el botón al enviar: desliza el icono de email desde donde está hasta el final del cuadro del botón
  const playMailSlideAnimation = () =>
    new Promise((resolve) => {
      if (
        !submitBtn ||
        !btnMailIcon ||
        (window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      ) {
        resolve();
        return;
      }

      const btnRect = submitBtn.getBoundingClientRect();
      const iconRect = btnMailIcon.getBoundingClientRect();
      const slideDist = Math.max(
        110,
        Math.round(btnRect.right - iconRect.right - 12)
      );

      submitBtn.style.minWidth = `${Math.ceil(btnRect.width)}px`;
      submitBtn.style.setProperty("--mail-slide-x", `${slideDist}px`);
      btnMailIcon.classList.remove("hidden");
      if (btnSpinner) btnSpinner.classList.add("hidden");

      submitBtn.classList.remove("is-revealing-msg");
      submitBtn.classList.add("is-sliding-mail");

      setTimeout(() => {
        submitBtn.classList.remove("is-sliding-mail");
        submitBtn.classList.add("is-revealing-msg");
        resolve();
      }, 680);
    });

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
    submitBtn.classList.toggle("pointer-events-none", locked);

    if (!locked) {
      submitBtn.style.minWidth = "";
      submitBtn.classList.remove("is-sliding-mail");
      submitBtn.classList.add("is-revealing-msg");
    }

    if (btnMailIcon) {
      btnMailIcon.classList.toggle("hidden", locked);
    }
    if (btnText) {
      btnText.textContent = locked
        ? "Enviando mensaje, por favor espera..."
        : "Enviar mensaje";
    }
    if (btnSpinner) {
      btnSpinner.classList.toggle("hidden", !locked);
    }
  };

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      if (isSubmitting) {
        e.preventDefault();
        e.stopPropagation();
        showFeedback(
          "success",
          "Enviando tu consulta...",
          "Con cobertura lenta (3G/datos) puede tardar unos segundos. No es necesario pulsar el botón de nuevo."
        );
      }
    });
  }

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

    isSubmitting = true;
    const formData = new FormData(form);

    // 1. Ejecutar primero el deslizamiento del icono de email hasta el final del botón
    const slidePromise = playMailSlideAnimation();

    // 2. Lanzar la petición en paralelo y mostrar a continuación el mensaje por defecto del botón
    const fetchPromise = fetch(form.getAttribute("action") || "enviar-correo.php", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    })
      .then((res) => res.json())
      .then((result) => ({ ok: true, result }))
      .catch((error) => ({ ok: false, error }));

    await slidePromise;
    // Mostrar el mensaje por defecto de envío justo al terminar el deslizamiento del sobre
    lockButtonState(true);

    const outcome = await fetchPromise;

    if (outcome.ok && outcome.result && outcome.result.success) {
      const result = outcome.result;
      sessionStorage.setItem("millan_last_form_sent", String(Date.now()));
      showFeedback(
        "success",
        result.title || "¡Mensaje enviado con éxito!",
        result.message ||
          "Hemos recibido tu consulta en Millán Chiclana. Nuestro equipo te responderá a la mayor brevedad."
      );
      form.reset();
      if (result.next_token && tokenInput) {
        tokenInput.value = result.next_token;
      }
      if (idempotencyInput) {
        idempotencyInput.value = generateIdempotencyKey();
      }
      if (btnMailIcon) {
        btnMailIcon.classList.add("hidden");
      }
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
      // Mantener visible brevemente el mensaje de envío antes de restaurar el botón por defecto
      await new Promise((r) => setTimeout(r, 550));
      if (outcome.ok) {
        const result = outcome.result;
        showFeedback(
          "warning",
          "Atención en el envío",
          (result && result.message) ||
            "Por favor, revisa los campos del formulario o llámanos directamente al 956 53 61 04."
        );
      } else {
        showFeedback(
          "warning",
          "No se pudo completar el envío automático",
          "Puedes llamarnos directamente al 956 53 61 04 o escribirnos a millan@millanchiclana.com."
        );
      }
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
   10. POPUP DE LLAMADA EN ORDENADOR CON CÓDIGO QR ESCANEABLE (tel:)
   ========================================================================== */
function generateQRCodeSVG(text) {
  const bytes = Array.from(unescape(encodeURIComponent(text))).map((ch) => ch.charCodeAt(0));
  const bits = [];
  const pushBits = (val, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  pushBits(0b0100, 4); // Modo Byte (ISO/IEC 18004)
  pushBits(bytes.length, 8);
  for (const b of bytes) pushBits(b, 8);
  pushBits(0, Math.min(4, 28 * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    data.push(b);
  }
  const pads = [0xec, 0x11];
  let pi = 0;
  while (data.length < 28) data.push(pads[pi++ % 2]);

  const exp = new Uint8Array(512);
  const log = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
  const mul = (a, b) => (a === 0 || b === 0 ? 0 : exp[log[a] + log[b]]);

  let gen = [1];
  for (let i = 0; i < 16; i++) {
    const next = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j];
      next[j + 1] ^= mul(gen[j], exp[i]);
    }
    gen = next;
  }

  const msg = [...data, ...new Array(16).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) msg[i + j] ^= mul(gen[j], coef);
    }
  }
  const codewords = [...data, ...msg.slice(data.length)];

  const N = 25;
  const grid = Array.from({ length: N }, () => new Array(N).fill(0));
  const reserved = Array.from({ length: N }, () => new Array(N).fill(false));

  const placeFinder = (r0, c0) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
        reserved[rr][cc] = true;
        if (
          r >= 0 &&
          r <= 6 &&
          c >= 0 &&
          c <= 6 &&
          (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
        ) {
          grid[rr][cc] = 1;
        }
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(0, N - 7);
  placeFinder(N - 7, 0);

  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      reserved[18 + r][18 + c] = true;
      if (Math.max(Math.abs(r), Math.abs(c)) !== 1) grid[18 + r][18 + c] = 1;
    }
  }

  for (let i = 8; i < N - 8; i++) {
    reserved[6][i] = reserved[i][6] = true;
    grid[6][i] = grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  reserved[17][8] = true;
  grid[17][8] = 1;
  for (let i = 0; i < 9; i++) {
    if (i !== 6) reserved[8][i] = reserved[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][N - 1 - i] = reserved[N - 1 - i][8] = true;
  }

  const cwBits = [];
  for (const cw of codewords) {
    for (let i = 7; i >= 0; i--) cwBits.push((cw >> i) & 1);
  }
  for (let i = 0; i < 7; i++) cwBits.push(0);

  let bitIdx = 0;
  let up = true;
  for (let col = N - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let step = 0; step < N; step++) {
      const r = up ? N - 1 - step : step;
      for (let dc = 0; dc < 2; dc++) {
        const c = col - dc;
        if (!reserved[r][c]) {
          const b = bitIdx < cwBits.length ? cwBits[bitIdx++] : 0;
          grid[r][c] = b ^ ((r + c) % 2 === 0 ? 1 : 0);
        }
      }
    }
    up = !up;
  }

  const fmt = 0x5412;
  const fbits = [];
  for (let i = 0; i < 15; i++) fbits.push((fmt >> i) & 1);
  const tlCoords = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) grid[tlCoords[i][0]][tlCoords[i][1]] = fbits[14 - i];
  for (let i = 0; i < 7; i++) grid[N - 1 - i][8] = fbits[14 - i];
  for (let i = 7; i < 15; i++) grid[8][N - 15 + i] = fbits[14 - i];

  const margin = 2;
  const size = N + margin * 2;
  let pathD = "";
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c]) {
        pathD += `M${c + margin},${r + margin}h1v1h-1z`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" class="w-full h-full block" role="img" aria-label="Código QR para llamar a ${escapeHTML(text)}"><rect width="${size}" height="${size}" fill="#FFFFFF"/><path d="${pathD}" fill="#111111"/></svg>`;
}

function initDesktopPhoneQrModal() {
  const PHONES = {
    exposicion: {
      key: "exposicion",
      label: "Sede Exposición",
      sublabel: "Azulejos, Baños, Grifería y Chimeneas · N23",
      formatted: "956 53 61 04",
      telUri: "tel:+34956536104",
      badgeClass: "bg-[#334155] text-white"
    },
    almacen: {
      key: "almacen",
      label: "Sede Almacén",
      sublabel: "Materiales de Construcción y Obra Gruesa · N16",
      formatted: "956 53 03 61",
      telUri: "tel:+34956530361",
      badgeClass: "bg-[#111111] text-white"
    }
  };

  const isMobilePhoneDevice = () => {
    const ua = navigator.userAgent || "";
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      return true;
    }
    if (window.innerWidth < 768 && window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      return true;
    }
    return false;
  };

  let modalEl = document.getElementById("desktop-phone-qr-modal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "desktop-phone-qr-modal";
    modalEl.className =
      "fixed inset-0 z-[120] hidden items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity";
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-labelledby", "desktop-phone-qr-title");

    modalEl.innerHTML = `
      <div class="bg-white rounded-3xl max-w-md w-full border border-[#E5E7EB] shadow-2xl overflow-hidden relative animate-[fadeIn_0.18s_ease-out]">
        <!-- Cabecera -->
        <div class="bg-[#111111] text-white px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/15 text-gray-100 mb-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span>Atención Telefónica Directa</span>
            </span>
            <h3 id="desktop-phone-qr-title" class="text-xl font-extrabold tracking-tight text-white">
              Llámanos desde tu móvil
            </h3>
          </div>
          <button
            type="button"
            data-close-phone-qr
            class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar ventana de llamada"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Cuerpo del Popup -->
        <div class="p-6 space-y-5">
          <!-- Selector de Sede (Exposición / Almacén) -->
          <div class="grid grid-cols-2 gap-2 p-1 bg-[#F3F4F6] rounded-2xl border border-[#E5E7EB]">
            <button
              type="button"
              data-phone-qr-tab="exposicion"
              class="py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center"
            >
              Sede Exposición
            </button>
            <button
              type="button"
              data-phone-qr-tab="almacen"
              class="py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center"
            >
              Sede Almacén
            </button>
          </div>

          <!-- Número de Teléfono Destacado + Copiar -->
          <div class="text-center bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB]">
            <p id="phone-qr-sede-subtitle" class="text-xs font-bold text-[#52525B] mb-1">
              Azulejos, Baños, Grifería y Chimeneas · N23
            </p>
            <div class="flex items-center justify-center gap-3">
              <span id="phone-qr-number-display" class="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                956 53 61 04
              </span>
              <button
                type="button"
                id="phone-qr-copy-btn"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-[#EDEDEF] text-[#18181B] border border-[#D1D5DB] transition-colors cursor-pointer"
                title="Copiar número de teléfono"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                <span id="phone-qr-copy-text">Copiar</span>
              </button>
            </div>
          </div>

          <!-- Código QR Escaneable -->
          <div class="flex flex-col items-center text-center">
            <div class="relative p-3 bg-white rounded-2xl border-2 border-[#111111] shadow-md w-48 h-48 flex items-center justify-center">
              <div id="phone-qr-svg-container" class="w-full h-full"></div>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-[#18181B] mt-3.5 max-w-xs leading-snug">
              Escanea este QR con la cámara de tu móvil para llamar del tirón sin marcar el número
            </p>
            <p class="text-[11px] text-[#52525B] mt-1">
              Horario: Lunes a Viernes 8:00–14:00 y 16:00–19:30 · Sábados 9:00–13:00
            </p>
          </div>

          <!-- Botón secundario para llamar desde aplicación en el ordenador -->
          <div class="pt-2 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
            <a
              id="phone-qr-direct-call-link"
              href="tel:+34956536104"
              data-direct-tel="true"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#18181B] transition-colors"
            >
              <svg class="w-4 h-4 text-[#3F3F46]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span>Llamar desde una aplicación en este ordenador</span>
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);
  }

  const tabBtns = modalEl.querySelectorAll("[data-phone-qr-tab]");
  const subtitleEl = document.getElementById("phone-qr-sede-subtitle");
  const numberEl = document.getElementById("phone-qr-number-display");
  const qrContainer = document.getElementById("phone-qr-svg-container");
  const directCallLink = document.getElementById("phone-qr-direct-call-link");
  const copyBtn = document.getElementById("phone-qr-copy-btn");
  const copyText = document.getElementById("phone-qr-copy-text");

  let activeSedeKey = "exposicion";

  const selectSede = (sedeKey) => {
    activeSedeKey = PHONES[sedeKey] ? sedeKey : "exposicion";
    const info = PHONES[activeSedeKey];

    tabBtns.forEach((btn) => {
      const isSelected = btn.getAttribute("data-phone-qr-tab") === activeSedeKey;
      btn.className = isSelected
        ? "py-2 px-3 rounded-xl text-xs font-extrabold bg-[#111111] text-white shadow-xs transition-all cursor-pointer text-center"
        : "py-2 px-3 rounded-xl text-xs font-bold text-[#52525B] hover:text-[#111111] transition-all cursor-pointer text-center";
    });

    if (subtitleEl) subtitleEl.textContent = info.sublabel;
    if (numberEl) numberEl.textContent = info.formatted;
    if (qrContainer) qrContainer.innerHTML = generateQRCodeSVG(info.telUri);
    if (directCallLink) directCallLink.setAttribute("href", info.telUri);
    if (copyText) copyText.textContent = "Copiar";
  };

  const openModal = (sedeKey) => {
    selectSede(sedeKey);
    modalEl.classList.remove("hidden");
    modalEl.classList.add("flex");
  };

  const closeModal = () => {
    modalEl.classList.add("hidden");
    modalEl.classList.remove("flex");
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectSede(btn.getAttribute("data-phone-qr-tab"));
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const info = PHONES[activeSedeKey];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(info.formatted).then(() => {
          if (copyText) copyText.textContent = "¡Copiado!";
          setTimeout(() => {
            if (copyText) copyText.textContent = "Copiar";
          }, 2000);
        });
      }
    });
  }

  modalEl.querySelectorAll("[data-close-phone-qr]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalEl.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Interceptar clics en enlaces tel: cuando el usuario navega desde ordenador
  document.addEventListener("click", (e) => {
    const telLink = e.target.closest('a[href^="tel:"]');
    if (!telLink) return;
    if (telLink.hasAttribute("data-direct-tel")) return;
    if (isMobilePhoneDevice()) return;

    e.preventDefault();
    const href = telLink.getAttribute("href") || "";
    const isAlmacen = href.includes("956530361");
    openModal(isAlmacen ? "almacen" : "exposicion");
  });
}

/* ==========================================================================
   11. PROTECCIÓN TOTAL ANTI-DESCARGA DE IMÁGENES Y VISOR LIGHTBOX EN PÁGINA
   ========================================================================== */
function initImageProtectionAndLightbox() {
  // 1. Deshabilitar descarga, clic derecho (contextmenu) y arrastre (dragstart) en TODAS las imágenes de la web
  const protectImagesInRoot = (root = document) => {
    root.querySelectorAll("img, svg").forEach((el) => {
      el.setAttribute("draggable", "false");
    });
  };
  protectImagesInRoot();

  document.addEventListener(
    "contextmenu",
    (e) => {
      if (
        e.target.closest("img, svg, picture, figure, #site-image-lightbox, [data-gallery-item]")
      ) {
        e.preventDefault();
      }
    },
    true
  );

  document.addEventListener(
    "dragstart",
    (e) => {
      if (e.target.closest("img, svg, picture, figure, #site-image-lightbox")) {
        e.preventDefault();
      }
    },
    true
  );

  // Observar imágenes inyectadas dinámicamente (catálogos, logos, etc.) para bloquear su arrastre
  if ("MutationObserver" in window) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches("img, svg")) {
              node.setAttribute("draggable", "false");
            } else if (node.querySelectorAll) {
              protectImagesInRoot(node);
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 2. Determinar qué fotografías se pueden ampliar en el visor Lightbox
  const isZoomablePhoto = (img) => {
    if (!img || img.tagName !== "IMG") return false;
    const src = img.getAttribute("src") || "";
    if (!src) return false;
    // Excluir logotipos, iconos y marcas vectoriales
    if (
      src.includes("logo-") ||
      src.includes("favicon") ||
      src.includes("caixabank-star") ||
      src.includes("assets/img/marcas/")
    ) {
      return false;
    }
    // Excluir fondos del carrusel hero, tarjetas de marcas/catálogos y el preloader
    if (
      img.closest(
        "#hero-slider, .hero-slide, [data-carousel-slide], [data-brand-id], #all-catalogs-grid, #fireplaces-catalogs-grid, #featured-catalogs-grid, #catalog-modal, #site-preloader, header, footer"
      )
    ) {
      return false;
    }
    return Boolean(img.closest("main"));
  };

  // Añadir cursor zoom-in a todas las fotografías ampliables
  const markZoomablePhotos = () => {
    document.querySelectorAll("main img").forEach((img) => {
      if (isZoomablePhoto(img)) {
        img.classList.add("js-lightbox-trigger");
        const fig = img.closest("figure[data-gallery-item]");
        if (fig) fig.classList.add("js-lightbox-trigger");
      }
    });
  };
  markZoomablePhotos();

  // 3. Crear el Modal Lightbox en la misma web con su botón de cerrar y escudo anti-descarga
  let lightboxEl = document.getElementById("site-image-lightbox");
  if (!lightboxEl) {
    lightboxEl = document.createElement("div");
    lightboxEl.id = "site-image-lightbox";
    lightboxEl.className =
      "fixed inset-0 z-[130] hidden items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none";
    lightboxEl.setAttribute("role", "dialog");
    lightboxEl.setAttribute("aria-modal", "true");
    lightboxEl.setAttribute("aria-label", "Visor de imagen a tamaño completo");

    lightboxEl.innerHTML = `
      <!-- Barra Superior con Contador y Botón de Cerrar -->
      <div class="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-[145] flex items-center justify-between pointer-events-none">
        <span id="lightbox-counter" class="pointer-events-auto px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white/15 text-white backdrop-blur-md border border-white/20">
          1 / 1
        </span>
        <button
          type="button"
          data-lightbox-close
          class="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-200 text-[#111111] font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
          aria-label="Cerrar imagen"
        >
          <span>Cerrar</span>
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Botón Anterior -->
      <button
        type="button"
        id="lightbox-prev-btn"
        class="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[145] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#111111] border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-lg"
        aria-label="Imagen anterior"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <!-- Botón Siguiente -->
      <button
        type="button"
        id="lightbox-next-btn"
        class="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[145] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#111111] border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-lg"
        aria-label="Imagen siguiente"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
      </button>

      <!-- Contenedor Central de la Imagen Protegida + Pie de Foto -->
      <div id="lightbox-content-box" class="relative max-w-5xl w-full flex flex-col items-center justify-center">
        <div class="relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#111111]">
          <img
            id="lightbox-main-img"
            src=""
            alt=""
            draggable="false"
            class="max-h-[76vh] max-w-[92vw] sm:max-w-[82vw] w-auto h-auto object-contain block select-none pointer-events-none"
          />
          <!-- Escudo transparente anti-descarga sobre la imagen ampliada -->
          <div class="absolute inset-0 z-10 select-none" aria-hidden="true"></div>
        </div>

        <div id="lightbox-caption-box" class="mt-4 text-center max-w-2xl px-4">
          <h4 id="lightbox-title" class="text-base sm:text-lg font-extrabold text-white leading-snug"></h4>
          <p id="lightbox-desc" class="text-xs sm:text-sm text-gray-300 mt-1"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lightboxEl);
  }

  const mainImgEl = document.getElementById("lightbox-main-img");
  const titleEl = document.getElementById("lightbox-title");
  const descEl = document.getElementById("lightbox-desc");
  const counterEl = document.getElementById("lightbox-counter");
  const prevBtn = document.getElementById("lightbox-prev-btn");
  const nextBtn = document.getElementById("lightbox-next-btn");

  let currentList = [];
  let currentIndex = 0;

  const extractPhotoMetadata = (img) => {
    const src = img.getAttribute("src") || "";
    const alt = img.getAttribute("alt") || "Instalaciones Millán Chiclana";
    let title = "";
    let desc = "";

    const figure = img.closest("figure");
    if (figure) {
      const h3 = figure.querySelector("figcaption h3");
      const p = figure.querySelector("figcaption p");
      if (h3) title = h3.textContent.trim();
      if (p) desc = p.textContent.trim();
    } else {
      const article = img.closest("article");
      if (article) {
        const h3 = article.querySelector("h3");
        const p = article.querySelector("p");
        if (h3) title = h3.textContent.trim();
        if (p) desc = p.textContent.trim();
      }
    }

    if (!title) {
      const wrapper = img.parentElement;
      const badge = wrapper ? wrapper.querySelector("span") : null;
      title = badge ? badge.textContent.trim() : alt;
      desc = title !== alt ? alt : "";
    }

    return { src, alt, title, desc };
  };

  const getVisibleZoomableImages = () => {
    return Array.from(document.querySelectorAll("main img")).filter((img) => {
      if (!isZoomablePhoto(img)) return false;
      const hiddenParent = img.closest(".hidden");
      return !hiddenParent && img.offsetParent !== null;
    });
  };

  const renderCurrentLightboxImage = () => {
    if (!currentList.length) return;
    const img = currentList[currentIndex];
    const meta = extractPhotoMetadata(img);

    if (mainImgEl) {
      mainImgEl.setAttribute("src", meta.src);
      mainImgEl.setAttribute("alt", meta.alt);
    }
    if (titleEl) titleEl.textContent = meta.title;
    if (descEl) {
      descEl.textContent = meta.desc;
      descEl.classList.toggle("hidden", !meta.desc);
    }
    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${currentList.length}`;
    }
    const showNav = currentList.length > 1;
    if (prevBtn) prevBtn.classList.toggle("hidden", !showNav);
    if (nextBtn) nextBtn.classList.toggle("hidden", !showNav);
  };

  const openLightboxForImage = (targetImg) => {
    currentList = getVisibleZoomableImages();
    currentIndex = currentList.indexOf(targetImg);
    if (currentIndex === -1) {
      currentList = [targetImg];
      currentIndex = 0;
    }
    renderCurrentLightboxImage();
    lightboxEl.classList.remove("hidden");
    lightboxEl.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightboxEl.classList.add("hidden");
    lightboxEl.classList.remove("flex");
    document.body.style.overflow = "";
  };

  const showPrev = () => {
    if (!currentList.length) return;
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    renderCurrentLightboxImage();
  };

  const showNext = () => {
    if (!currentList.length) return;
    currentIndex = (currentIndex + 1) % currentList.length;
    renderCurrentLightboxImage();
  };

  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });

  lightboxEl.querySelectorAll("[data-lightbox-close]").forEach((btn) => {
    btn.addEventListener("click", closeLightbox);
  });

  lightboxEl.addEventListener("click", (e) => {
    if (e.target === lightboxEl || e.target.id === "lightbox-content-box") {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (lightboxEl.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // Abrir Lightbox al pulsar sobre cualquier fotografía ampliable o tarjeta de galería
  document.addEventListener("click", (e) => {
    if (
      e.target.closest(
        "a, button, #hero-slider, .hero-slide, [data-brand-id], #all-catalogs-grid, #fireplaces-catalogs-grid, #featured-catalogs-grid, #catalog-modal"
      )
    ) {
      return;
    }

    let targetImg = e.target.closest("img");
    if (!targetImg) {
      const fig = e.target.closest("figure[data-gallery-item]");
      if (fig) {
        targetImg = fig.querySelector("img");
      } else {
        const cardBox = e.target.closest(".relative.overflow-hidden");
        if (
          cardBox &&
          !cardBox.closest(
            "#hero-slider, .hero-slide, [data-carousel-slide], [data-brand-id], #all-catalogs-grid, #fireplaces-catalogs-grid, #featured-catalogs-grid, #catalog-modal"
          )
        ) {
          targetImg = cardBox.querySelector("img");
        }
      }
    }

    if (targetImg && isZoomablePhoto(targetImg)) {
      e.preventDefault();
      openLightboxForImage(targetImg);
    }
  });
}

/* ==========================================================================
   11B. CONTADORES NUMÉRICOS SINCRONIZADOS Y DESTELLO DE ESTRELLAS (★)
   ========================================================================== */
function initAnimatedCounters() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  // Duración única exacta para que todos los contadores terminen en el mismo instante
  const DURATION_MS = 1600;

  // Preparar metadatos de un elemento contador
  const parseCounterElement = (el) => {
    if (!el || el.dataset.counterPrepared === "1") return null;
    // Si el elemento contenedor ya tiene dentro un sub-contador específico ([data-live-rating]), no sobreescribir el padre
    if (
      el.matches("p.text-4xl.font-extrabold") &&
      el.querySelector("[data-live-rating], [data-live-count]")
    ) {
      return null;
    }

    const rawText = (el.textContent || "").trim();
    const match = rawText.match(/^([+~]?)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!match) return null;

    const prefix = match[1] || "";
    const numStr = match[2];
    const suffix = match[3] || "";

    const isThousandDot = /^\d{1,3}\.\d{3}$/.test(numStr);
    const cleanNumber = isThousandDot
      ? parseFloat(numStr.replace(/\./g, ""))
      : parseFloat(numStr.replace(",", "."));

    if (Number.isNaN(cleanNumber) || cleanNumber <= 0) return null;

    const hasDecimal =
      !isThousandDot && (numStr.includes(".") || numStr.includes(","));
    const decimalPlaces = hasDecimal
      ? (numStr.split(/[.,]/)[1] || "").length
      : 0;
    const isSmallInteger = !hasDecimal && !isThousandDot && cleanNumber <= 10;

    el.dataset.counterPrepared = "1";

    // Para números pequeños como "2 Sedes", construir rodillo vertical (odómetro)
    // para que tenga movimiento continuo y fluido durante los 1600ms completos
    let odometerTrack = null;
    let odometerTotalSteps = 0;

    if (isSmallInteger) {
      const targetInt = Math.round(cleanNumber);
      const sequence = [];
      const cycles = 3;
      for (let c = 0; c < cycles; c++) {
        for (let n = 0; n <= targetInt; n++) {
          sequence.push(n);
        }
      }
      odometerTotalSteps = sequence.length - 1;

      el.innerHTML = `${escapeHTML(prefix)}<span class="counter-odometer-window"><span class="counter-odometer-track">${sequence
        .map((n) => `<span>${n}</span>`)
        .join("")}</span></span>${escapeHTML(suffix)}`;
      odometerTrack = el.querySelector(".counter-odometer-track");
    } else {
      // Estado inicial en 0 para que no parpadee el valor final antes de empezar
      const zeroFormatted = isThousandDot
        ? "0"
        : hasDecimal
          ? (0).toFixed(decimalPlaces)
          : "0";
      el.textContent = `${prefix}${zeroFormatted}${suffix}`;
    }

    return {
      el,
      rawText,
      prefix,
      suffix,
      cleanNumber,
      isThousandDot,
      hasDecimal,
      decimalPlaces,
      isSmallInteger,
      odometerTrack,
      odometerTotalSteps
    };
  };

  // Ejecutar un grupo de contadores sincronizados con el mismo startTime y DURATION_MS
  const runCounterGroup = (items) => {
    if (!items || !items.length) return;

    // Si la página acaba de cargar y el preloader aún se está desvaneciendo, esperar a que sea visible
    const initialDelay = performance.now() < 550 ? 400 : 0;

    setTimeout(() => {
      const startTime = performance.now();

      const stepGroup = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, Math.max(0, elapsed / DURATION_MS));
        // Curva suave calibrada para que TODOS los números sigan cambiando hasta progress === 1
        const eased = 1 - Math.pow(1 - progress, 1.65);

        items.forEach((item) => {
          if (progress < 1) {
            if (item.isSmallInteger && item.odometerTrack) {
              const offsetEm = eased * item.odometerTotalSteps * 1.15;
              item.odometerTrack.style.transform = `translate3d(0, -${offsetEm.toFixed(4)}em, 0)`;
            } else if (item.isThousandDot) {
              // Usar Math.floor durante progress < 1 para que alcance el número final exacto en progress === 1
              const val = Math.min(
                item.cleanNumber - 1,
                Math.floor(item.cleanNumber * eased)
              );
              item.el.textContent = `${item.prefix}${Math.max(0, val).toLocaleString("es-ES")}${item.suffix}`;
            } else if (item.hasDecimal) {
              const factor = Math.pow(10, item.decimalPlaces);
              const totalTicks = Math.round(item.cleanNumber * factor);
              const currentTick = Math.min(
                totalTicks - 1,
                Math.floor(totalTicks * eased)
              );
              const formatted = (Math.max(0, currentTick) / factor).toFixed(
                item.decimalPlaces
              );
              item.el.textContent = `${item.prefix}${formatted}${item.suffix}`;
            } else {
              const val = Math.min(
                item.cleanNumber - 1,
                Math.floor(item.cleanNumber * eased)
              );
              item.el.textContent = `${item.prefix}${Math.max(0, val)}${item.suffix}`;
            }
          } else {
            // En progress === 1 exacto, todos los contadores del grupo fijan su valor final en el mismo frame
            item.el.textContent = item.rawText;

            // Si el contador tiene una estrella única al lado (ej: "5.0 ★"), lanzar destello al terminar (excluyendo las filas de 5 estrellas de las fichas)
            const parentStar =
              item.el.parentElement &&
              item.el.parentElement.querySelector("span.text-amber-500, span.text-amber-400");
            if (
              parentStar &&
              parentStar.id !== "rating-stars-exposicion" &&
              parentStar.id !== "rating-stars-almacen" &&
              (parentStar.textContent || "").trim() === "★"
            ) {
              triggerStarSparkle(parentStar);
            }
          }
        });

        if (progress < 1) {
          requestAnimationFrame(stepGroup);
        }
      };

      requestAnimationFrame(stepGroup);
    }, initialDelay);
  };

  // Agrupar contadores por sección para que todos los de una misma vista arranquen y terminen a la vez
  const rawCandidates = Array.from(
    document.querySelectorAll(
      '[data-live-rating], [data-live-count], p.text-4xl.font-extrabold'
    )
  );

  const sectionGroups = new Map();
  rawCandidates.forEach((el) => {
    const parsed = parseCounterElement(el);
    if (!parsed) return;
    const groupKey = el.closest("section, header, footer") || document.body;
    if (!sectionGroups.has(groupKey)) {
      sectionGroups.set(groupKey, []);
    }
    sectionGroups.get(groupKey).push(parsed);
  });

  if (sectionGroups.size > 0) {
    if ("IntersectionObserver" in window) {
      const groupObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const groupItems = sectionGroups.get(entry.target);
              if (groupItems) {
                runCounterGroup(groupItems);
                sectionGroups.delete(entry.target);
              }
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      sectionGroups.forEach((_, sectionEl) => {
        groupObserver.observe(sectionEl);
      });
    } else {
      sectionGroups.forEach((groupItems) => runCounterGroup(groupItems));
    }
  }

  // Destello discreto en el emoji de estrella (★) de los botones "Dejar reseña" y distintivos cuando aparecen en pantalla
  function triggerStarSparkle(starEl) {
    if (!starEl || starEl.classList.contains("star-sparkle-once")) return;
    starEl.classList.add("star-sparkle-once");
    setTimeout(() => {
      starEl.classList.remove("star-sparkle-once");
    }, 1200);
  }

  const allStarSpans = Array.from(
    document.querySelectorAll("a span, button span, p span, div > span")
  ).filter((span) => {
    if (
      span.id === "rating-stars-exposicion" ||
      span.id === "rating-stars-almacen"
    ) {
      return false;
    }
    const txt = (span.textContent || "").trim();
    return txt === "★" && span.children.length === 0;
  });

  if (allStarSpans.length > 0) {
    if ("IntersectionObserver" in window) {
      const starObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const starEl = entry.target;
              const delay = performance.now() < 550 ? 480 : 220;
              setTimeout(() => triggerStarSparkle(starEl), delay);
              obs.unobserve(starEl);
            }
          });
        },
        { threshold: 0.35 }
      );

      allStarSpans.forEach((starEl) => starObserver.observe(starEl));
    } else {
      setTimeout(() => allStarSpans.forEach(triggerStarSparkle), 500);
    }

    // También hacer destellar la estrella al pasar el ratón por cualquier botón de "Dejar reseña"
    allStarSpans.forEach((starEl) => {
      const clickableParent = starEl.closest("a, button");
      if (clickableParent) {
        clickableParent.addEventListener("mouseenter", () => {
          triggerStarSparkle(starEl);
        });
      }
    });
  }
}

/* ==========================================================================
   11C. INDICADOR EN VIVO DE HORARIO ("ABIERTO AHORA" / "CERRADO AHORA")
   ========================================================================== */
function initLiveStoreHoursStatus() {
  const computeStoreStatus = (sedeType) => {
    try {
      const nowSpain = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" })
      );
      const day = nowSpain.getDay(); // 0 Dom, 1-5 L-V, 6 Sáb
      const minutes = nowSpain.getHours() * 60 + nowSpain.getMinutes();

      if (sedeType === "exposicion") {
        // L-V: 09:00-14:00 (540-840) y 17:00-20:00 (1020-1200) | Sáb: 10:00-13:00 (600-780)
        if (day >= 1 && day <= 5) {
          if (
            (minutes >= 540 && minutes < 840) ||
            (minutes >= 1020 && minutes < 1200)
          ) {
            return { open: true, label: "Abierto ahora" };
          }
          if (minutes < 540) return { open: false, label: "Abre hoy a las 09:00" };
          if (minutes >= 840 && minutes < 1020)
            return { open: false, label: "Abre a las 17:00" };
        } else if (day === 6) {
          if (minutes >= 600 && minutes < 780) {
            return { open: true, label: "Abierto ahora" };
          }
          if (minutes < 600) return { open: false, label: "Abre hoy a las 10:00" };
        }
        return { open: false, label: "Cerrado ahora" };
      }

      // Almacén: L-V: 07:30-14:00 (450-840) y 15:30-18:30 (930-1110) | Sáb: 08:30-13:00 (510-780)
      if (day >= 1 && day <= 5) {
        if (
          (minutes >= 450 && minutes < 840) ||
          (minutes >= 930 && minutes < 1110)
        ) {
          return { open: true, label: "Abierto ahora" };
        }
        if (minutes < 450) return { open: false, label: "Abre hoy a las 07:30" };
        if (minutes >= 840 && minutes < 930)
          return { open: false, label: "Abre a las 15:30" };
      } else if (day === 6) {
        if (minutes >= 510 && minutes < 780) {
          return { open: true, label: "Abierto ahora" };
        }
        if (minutes < 510) return { open: false, label: "Abre hoy a las 08:30" };
      }
      return { open: false, label: "Cerrado ahora" };
    } catch (_) {
      return null;
    }
  };

  const createBadgeHTML = (status) => {
    if (!status) return "";
    if (status.open) {
      return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs ml-auto">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>${status.label}</span>
      </span>`;
    }
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F4F4F5] text-[#52525B] border border-[#D4D4D8] ml-auto">
      <span class="w-1.5 h-1.5 rounded-full bg-[#71717A]"></span>
      <span>${status.label}</span>
    </span>`;
  };

  const expoStatus = computeStoreStatus("exposicion");
  const almacenStatus = computeStoreStatus("almacen");

  // Insertar en la franja rápida de las 2 Sedes de index.html
  const quickSedesSection = document.querySelector(
    'section[aria-label="Resumen de nuestras dos sedes"]'
  );
  if (quickSedesSection) {
    const cards = quickSedesSection.querySelectorAll(".grid > div");
    if (cards[0] && expoStatus) {
      const labelEl = cards[0].querySelector("span.text-xs.font-extrabold");
      if (labelEl && !cards[0].querySelector("[data-live-hours-badge]")) {
        labelEl.insertAdjacentHTML(
          "afterend",
          `<span data-live-hours-badge="exposicion" class="inline-block ml-2 align-middle">${createBadgeHTML(expoStatus)}</span>`
        );
      }
    }
    if (cards[1] && almacenStatus) {
      const labelEl = cards[1].querySelector("span.text-xs.font-extrabold");
      if (labelEl && !cards[1].querySelector("[data-live-hours-badge]")) {
        labelEl.insertAdjacentHTML(
          "afterend",
          `<span data-live-hours-badge="almacen" class="inline-block ml-2 align-middle">${createBadgeHTML(almacenStatus)}</span>`
        );
      }
    }
  }

  // Insertar en los bloques de horario de contacto.html
  document.querySelectorAll("#sede-exposicion .border-l-4").forEach((box) => {
    const headerRow = box.querySelector("div.flex.items-center");
    if (headerRow && !headerRow.querySelector("[data-live-hours-badge]")) {
      const wrap = document.createElement("span");
      wrap.setAttribute("data-live-hours-badge", "exposicion");
      wrap.className = "ml-auto";
      wrap.innerHTML = createBadgeHTML(expoStatus);
      headerRow.appendChild(wrap);
    }
  });

  document.querySelectorAll("#sede-almacen .border-l-4").forEach((box) => {
    const headerRow = box.querySelector("div.flex.items-center");
    if (headerRow && !headerRow.querySelector("[data-live-hours-badge]")) {
      const wrap = document.createElement("span");
      wrap.setAttribute("data-live-hours-badge", "almacen");
      wrap.className = "ml-auto";
      wrap.innerHTML = createBadgeHTML(almacenStatus);
      headerRow.appendChild(wrap);
    }
  });
}

/* ==========================================================================
   11D. EFECTOS TEMÁTICOS EN CHIMENEAS Y TARJETA 3D CAIXABANK
   ========================================================================== */
function initChimneyPillsAndCard3D() {
  // 1. Añadir resplandor cálido interactivo a las píldoras de tipos de chimeneas
  document
    .querySelectorAll(
      '#hero-slider .hero-slide span.rounded-full, a[href="#tipos-chimeneas"]'
    )
    .forEach((pill) => {
      const txt = pill.textContent || "";
      if (
        txt.includes("🔥") ||
        txt.includes("🌿") ||
        txt.includes("💧") ||
        txt.includes("⚡") ||
        txt.includes("✨")
      ) {
        pill.classList.add("chimney-pill-glow");
      }
    });

  // 2. Inclinación 3D sutil en la tarjeta bancaria ilustrada de Financiación CaixaBank
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const caixaSection = document.getElementById("financiacion-caixabank");
  if (!caixaSection) return;

  const cardEl = caixaSection.querySelector(".lg\\:col-span-5 .relative.rounded-3xl");
  if (!cardEl) return;

  cardEl.classList.add("caixabank-card-3d");

  cardEl.addEventListener("mousemove", (e) => {
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = (x * 10).toFixed(2);
    const rotateX = (-y * 10).toFixed(2);
    cardEl.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  cardEl.addEventListener("mouseleave", () => {
    cardEl.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
}

/* ==========================================================================
   12. COREOGRAFÍA DE SCROLL ESTILO APPLE (REVEAL 3D, ESCALA Y PARALAJE EN VIVO)
   ========================================================================== */
function initAppleScrollAnimations() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  // 1. Barra de progreso de scroll sutil en la parte inferior del Navbar sticky
  const headerEl = document.querySelector("header.sticky");
  let progressBarEl = document.getElementById("apple-scroll-progress-bar");
  if (headerEl && !progressBarEl) {
    const track = document.createElement("div");
    track.className = "w-full h-[2.5px] bg-transparent overflow-hidden pointer-events-none";
    progressBarEl = document.createElement("div");
    progressBarEl.id = "apple-scroll-progress-bar";
    progressBarEl.className =
      "h-full bg-gradient-to-r from-[#111111] via-[#52525B] to-[#111111] origin-left transition-transform duration-75";
    progressBarEl.style.transform = "scaleX(0)";
    track.appendChild(progressBarEl);
    headerEl.appendChild(track);
  }

  // 2. Observer bidireccional estilo Apple (entra suavemente al bajar y se rearma al subir)
  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const el = entry.target;
              if (entry.isIntersecting) {
                el.classList.add("is-inview");
              } else if (entry.boundingClientRect.top > window.innerHeight * 0.94) {
                // Si el elemento queda de nuevo por debajo de la pantalla al subir, se rearma
                el.classList.remove("is-inview");
              }
            });
          },
          {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
          }
        )
      : null;

  const registerReveal = (el, variant = "apple-reveal-up", delayMs = 0) => {
    if (!el || el.dataset.appleBound === "1") return;
    el.dataset.appleBound = "1";
    el.classList.add("apple-reveal", variant);
    if (delayMs > 0) {
      el.style.setProperty("--apple-delay", `${delayMs}ms`);
    }
    if (io) {
      io.observe(el);
      // Si ya está visible en el viewport inicial al cargar, activarlo de inmediato
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        requestAnimationFrame(() => el.classList.add("is-inview"));
      }
    } else {
      el.classList.add("is-inview");
    }
  };

  // 3. Asignar coreografía por tipo de bloque sin alterar el diseño visual
  const bindAllScrollTargets = () => {
    // Cabeceras de sección (efecto zoom de apertura estilo Apple)
    document.querySelectorAll("main section h2").forEach((h2) => {
      const headerBlock = h2.closest("div.max-w-3xl, div.text-center") || h2;
      registerReveal(headerBlock, "apple-reveal-zoom", 0);
    });

    // Cuadrículas de 2 columnas (Sede Exposición vs Sede Almacén, Chimeneas vs Obras Menores, etc.):
    // Columna izquierda entra desde la izquierda y columna derecha entra desde la derecha
    document.querySelectorAll("main .grid").forEach((grid) => {
      const cls = grid.className || "";
      const isTwoCol =
        (cls.includes("lg:grid-cols-2") || cls.includes("md:grid-cols-2")) &&
        !cls.includes("lg:grid-cols-3") &&
        !cls.includes("lg:grid-cols-4") &&
        !cls.includes("lg:grid-cols-6");

      const children = Array.from(grid.children).filter(
        (c) => c.tagName !== "SCRIPT" && c.tagName !== "STYLE"
      );

      if (isTwoCol && children.length === 2) {
        registerReveal(children[0], "apple-reveal-left", 0);
        registerReveal(children[1], "apple-reveal-right", 110);
      } else if (children.length > 0) {
        const colsPerRow = cls.includes("lg:grid-cols-6")
          ? 6
          : cls.includes("lg:grid-cols-4")
            ? 4
            : cls.includes("lg:grid-cols-3")
              ? 3
              : 2;
        children.forEach((child, idx) => {
          const delay = (idx % colsPerRow) * 75;
          registerReveal(child, "apple-reveal-up", delay);
        });
      }
    });

    // Tarjetas individuales, figuras de galería, preguntas frecuentes y bloques de logotipos
    document
      .querySelectorAll(
        "main article, main figure, main .faq-item, #exposicion-brands-logos-wall > div, #warehouse-brands-logos-wall > button"
      )
      .forEach((el, idx) => {
        registerReveal(el, "apple-reveal-up", (idx % 3) * 75);
      });
  };

  bindAllScrollTargets();

  // Observar contenedores dinámicos (catálogos filtrados, muro de marcas, reseñas) para aplicar la animación a nuevas tarjetas
  if ("MutationObserver" in window) {
    const dynObserver = new MutationObserver(() => {
      bindAllScrollTargets();
    });
    [
      "featured-catalogs-grid",
      "all-catalogs-grid",
      "exposicion-brands-logos-wall",
      "warehouse-brands-logos-wall",
      "reviews-carousel-track"
    ].forEach((id) => {
      const container = document.getElementById(id);
      if (container) {
        dynObserver.observe(container, { childList: true });
      }
    });
  }

  // Cuando se pulsa un botón de filtro de galería, asegurar que las fotos filtradas se muestren al instante
  document.querySelectorAll("[data-gallery-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      requestAnimationFrame(() => {
        document.querySelectorAll("figure[data-gallery-item]").forEach((fig) => {
          if (!fig.classList.contains("hidden")) {
            fig.classList.add("is-inview");
          }
        });
      });
    });
  });

  // 4. Efecto continuo vinculado al scroll en tiempo real (Escala progresiva en grandes bloques + Paralaje Hero + Estado Navbar)
  const stageSelectors = [
    "#montaje-chimeneas-obras-menores > div",
    "#financiacion-caixabank > div",
    "#categorias-productos > div.mt-10",
    "#sede-exposicion",
    "#sede-almacen"
  ];
  const stageEls = Array.from(
    document.querySelectorAll(stageSelectors.join(", "))
  );
  stageEls.forEach((el) => el.classList.add("apple-scroll-stage"));

  let ticking = false;
  const updateContinuousScrollEffects = () => {
    ticking = false;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 800;

    // Estado compacto/sombra del Navbar sticky al hacer scroll
    if (headerEl) {
      headerEl.classList.toggle("header-scrolled", scrollY > 36);
    }

    // Actualizar barra de progreso superior
    if (progressBarEl) {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - vh
      );
      const ratio = Math.min(1, Math.max(0, scrollY / maxScroll));
      progressBarEl.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }

    // Escala progresiva estilo ventana de Apple para los grandes contenedores destacados
    stageEls.forEach((stage) => {
      const rect = stage.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const enterProgress = Math.min(
          1,
          Math.max(0, (vh - rect.top) / (vh * 0.65))
        );
        const scale = 0.94 + enterProgress * 0.06;
        const yShift = (1 - enterProgress) * 24;
        stage.style.transform = `translate3d(0, ${yShift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      }
    });
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateContinuousScrollEffects);
      }
    },
    { passive: true }
  );

  updateContinuousScrollEffects();
}

/* ==========================================================================
   13. UTILIDADES GENERALES
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

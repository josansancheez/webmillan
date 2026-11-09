# Millán Chiclana — Sitio Web Corporativo

Sitio web oficial de **Millán Chiclana** (*Millán Servicios Montajes e Interiorismos S.L.*), especialistas en cerámica, baños, chimeneas y materiales de construcción en el **Polígono Industrial Pelagatos, Chiclana de la Frontera (Cádiz)**.

---

## 📁 Estructura del Proyecto

```text
├── index.html                  # Inicio: carrusel Hero, resumen de sedes, buscador global y marcas desplegables
├── marcas.html                 # Directorio de 78 marcas oficiales (41 Exposición + 37 Almacén) con filtros y catálogos online
├── chimeneas.html              # Sección especializada en chimeneas, estufas de leña y pellets
├── sobre-nosotros.html         # Historia desde 1986, instalaciones de ambas sedes, servicios y FAQ
├── contacto.html               # Horarios, mapas interactivos y formulario de presupuesto
├── mapa-web.html               # Mapa web estructurado
├── enviar-correo.php           # Backend de formulario con bloqueo anti-duplicados (3G/reintentos) y Reply-To directo
├── aviso-legal.html            # Aviso Legal (LSSI-CE)
├── politica-privacidad.html    # Política de Privacidad (RGPD / LOPDGDD)
├── politica-cookies.html       # Política de Cookies
├── sitemap.xml / robots.txt    # Indexación para buscadores tradicionales y motores de IA
├── llms.txt                    # Resumen estructurado del negocio para asistentes de IA (Google AI, ChatGPT, Perplexity)
└── assets/
    ├── css/
    │   └── styles.css          # Estilos compilados (Tailwind CSS v4 + diseño corporativo)
    ├── js/
    │   ├── data.js             # Base de datos centralizada: 78 marcas, enlaces a catálogos, reseñas y FAQ
    │   └── main.js             # Lógica de interfaz: horarios en vivo, festivos, modales, filtros y formulario
    └── img/                    # Fotografías reales de instalaciones, logotipos oficiales y favicons
```

---

## ⚡ Funcionalidades Principales

1. **Indicador de Horario en Vivo y Calendario de Festivos (`main.js`):**
   - Calcula en tiempo real (`Europe/Madrid`) si la **Sede Exposición (N23)** y la **Sede Almacén (N16)** están abiertas o cerradas.
   - Muestra el próximo tramo exacto de apertura (mediodía, día siguiente o lunes tras el fin de semana).
   - Incluye los festivos nacionales, autonómicos de Andalucía, locales de Chiclana (13 de junio y 8 de septiembre), Semana Santa automática (Jueves y Viernes Santo) y aviso de festivos trasladados de domingo a lunes.
2. **Directorio de 78 Marcas Oficiales y Catálogos Externos (`data.js` / `marcas.html`):**
   - Buscador instantáneo y filtrado por sede y categoría.
   - Acceso directo a los catálogos oficiales online de cada fabricante y solicitud de presupuesto precargada con la marca seleccionada.
3. **Formulario Anti-Duplicados y Respuesta Directa (`enviar-correo.php`):**
   - Destinatario: `millan@millanchiclana.com` | Remitente: `web@millanchiclana.com` (con respaldo automático).
   - Cabecera `Reply-To` configurada con el correo del cliente para responder directamente desde el gestor de correo.
   - Bloqueo en navegador y servidor (`flock` atómico + clave de idempotencia + token de sesión) para evitar envíos repetidos en conexiones móviles lentas.
4. **Modal "Llamar Ahora" para Ordenador y Móvil:**
   - En móvil lanza la llamada directa; en escritorio muestra los teléfonos de ambas sedes con código QR escaneable y estado de apertura actual.
5. **SEO Local y Optimización para IA (`Schema.org` + `llms.txt`):**
   - Datos estructurados `HomeAndConstructionBusiness` con coordenadas, teléfonos y horarios de ambas naves.
   - Archivo `llms.txt` y reglas en `robots.txt` para respuestas precisas en buscadores con IA.

---

## 🛠️ Mantenimiento Rápido

- **Editar marcas, enlaces de catálogos, reseñas o preguntas frecuentes:** [`assets/js/data.js`](./assets/js/data.js).
- **Cambiar el correo receptor de los formularios:** constante `RECIPIENT_EMAIL` en [`enviar-correo.php`](./enviar-correo.php).
- **Modificar horarios o festivos:** función `initLiveStoreHoursStatus` en [`assets/js/main.js`](./assets/js/main.js).

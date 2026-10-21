# Millán Chiclana — Sitio Web Corporativo

Sitio web multipágina de **Millán Chiclana** (*Millán Servicios Montajes e Interiorismos S.L.*), empresa de materiales de construcción, cerámica, baños e interiorismo ubicada en el **Polígono Industrial Pelagatos, Chiclana de la Frontera (Cádiz)**.

---

## 📁 Estructura del Proyecto

```text
├── index.html                  # Página de Inicio (Hero carrusel, categorías, catálogos destacados y reseñas)
├── marcas.html                 # Buscador en tiempo real y catálogos en PDF con visor interactivo
├── sobre-nosotros.html         # Historia, galería de instalaciones (Exposición y Almacén) y FAQ
├── contacto.html               # Ubicación de las 2 sedes, horarios, mapas y formulario anti-duplicados
├── enviar-correo.php           # Script PHP para envío de formulario con protección anti-duplicados
├── aviso-legal.html            # Aviso Legal (LSSI-CE)
├── politica-privacidad.html    # Política de Privacidad (RGPD / LOPDGDD)
├── politica-cookies.html       # Política de Cookies
├── catalogos/                  # Archivos PDF de catálogos de marcas
└── assets/
    ├── css/
    │   └── styles.css          # Estilos personalizados (Modo Claro, paleta verde y madera)
    └── js/
        ├── data.js             # Datos centralizados: marcas/catálogos, reseñas de Google y preguntas frecuentes
        └── main.js             # Lógica interactiva de la web (menú móvil, visor PDF, filtros y formulario)
```

---

## 🛠️ Cómo actualizar contenido rápidamente

- **Añadir o editar Marcas, Reseñas o Preguntas Frecuentes:**  
  Edita únicamente el archivo [`assets/js/data.js`](./assets/js/data.js).
- **Cambiar el correo donde llegan los formularios:**  
  Edita la constante `RECIPIENT_EMAIL` en [`enviar-correo.php`](./enviar-correo.php).
- **Subir nuevos catálogos PDF:**  
  Guarda los archivos PDF en la carpeta `catalogos/` y enlázalos en `assets/js/data.js`.

---

## 🚀 Tecnologías

- **Frontend:** HTML5 semántico, Tailwind CSS (CDN) + CSS3 personalizado, JavaScript Vanilla (ES6+).
- **Backend:** PHP 8+ (`enviar-correo.php`) con control de sesión e idempotencia anti-duplicados.
- **SEO Local:** Datos estructurados `Schema.org` (`JSON-LD`) para las dos sedes (*Sede Exposición* y *Sede Almacén*).

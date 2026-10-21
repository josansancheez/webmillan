/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios e Interiorismo S.L.
 * Gestión de Datos Centralizada y Desacoplada (assets/js/data.js)
 * ============================================================================
 * Edita este archivo para añadir, modificar o eliminar:
 *  1. Datos corporativos y enlaces a fichas de Google Maps (COMPANY_DATA)
 *  2. Marcas y Catálogos en PDF (BRANDS_CATALOGS)
 *  3. Reseñas de Google diferenciadas por sede (GOOGLE_REVIEWS)
 *  4. Preguntas Frecuentes (FAQ_ITEMS)
 */

window.MILLAN_DATA = {
  // 1. CONFIGURACIÓN CORPORATIVA Y SEDES
  company: {
    commercialName: "Millán Chiclana",
    legalName: "Millán Servicios Montajes e Interiorismos S.L.",
    cif: "B72232101",
    fiscalAddress: "Avenida Bahía de Algeciras N23, Pol. Ind. Pelagatos, 11130 Chiclana de la Frontera (Cádiz)",
    phoneDisplay: "956 53 61 04",
    phoneHref: "tel:+34956536104",
    phoneAlmacenDisplay: "956 53 03 61",
    phoneAlmacenHref: "tel:+34956530361",
    phoneSecondaryDisplay: "956 53 03 61",
    whatsappHref: "https://wa.me/34600000000?text=Hola%20Mill%C3%A1n%20Chiclana%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta.",
    email: "millan@millanchiclana.com",
    emailHref: "mailto:millan@millanchiclana.com",
    poligono: "Avenida Bahía de Algeciras N23 · Polígono Industrial Pelagatos, Chiclana de la Frontera (Cádiz)",
    sedes: {
      exposicion: {
        id: "Sede Exposición",
        shortName: "Sede Exposición",
        fullName: "Millán Chiclana · Sede Exposición e Interiorismo",
        address: "Avenida Bahía de Algeciras N23 (Pol. Ind. Pelagatos), Nave Exposición, 11130 Chiclana de la Frontera, Cádiz",
        scheduleWeekdays: "Lunes a Viernes: 09:00 – 13:30 y 16:30 – 20:00",
        scheduleSaturday: "Sábados: 09:30 – 13:30",
        googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Bahia+de+Algeciras+23+Chiclana+Millan+Exposicion",
        googleReviewUrl: "https://www.google.com/maps/search/?api=1&query=Millan+Chiclana+Exposicion+Pelagatos",
        rating: "4.9",
        totalReviews: 148
      },
      almacen: {
        id: "Sede Almacén",
        shortName: "Sede Almacén",
        fullName: "Millán Chiclana · Sede Almacén de Construcción",
        address: "Avenida Bahía de Algeciras N23 (Pol. Ind. Pelagatos), Nave Almacén (en la misma calle a pocos metros), 11130 Chiclana de la Frontera, Cádiz",
        scheduleWeekdays: "Lunes a Viernes: 07:30 – 14:00 y 16:00 – 19:00",
        scheduleSaturday: "Sábados: 08:00 – 13:00",
        googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Bahia+de+Algeciras+23+Chiclana+Millan+Almacen",
        googleReviewUrl: "https://www.google.com/maps/search/?api=1&query=Millan+Chiclana+Almacen+Pelagatos",
        rating: "4.8",
        totalReviews: 215
      }
    }
  },

  // 2. MARCAS Y CATÁLOGOS PDF (Añade o quita objetos libremente)
  // Nota: `pdfUrl` admite tanto rutas locales (ej. "catalogos/pamesa-2026.pdf")
  // como URLs externas (CDN, Google Drive, servidor propio).
  brandsCatalogs: [
    {
      id: "pamesa-ceramica",
      name: "Pamesa Cerámica",
      edition: "Catálogo General Porcelánico & Gran Formato 2026",
      year: "2026",
      category: "Cerámica y Pavimentos",
      sede: "Sede Exposición",
      featured: true,
      logoUrl: "", // Opcional: "assets/img/marcas/pamesa.png"
      logoMonogram: "PAMESA",
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description: "Colecciones de gres porcelánico, maderas cerámicas, efecto piedra natural y revestimientos de tendencia para salón, cocina y terrazas.",
      pagesCount: 164,
      fileSize: "18.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["azulejos", "suelos", "porcelanico", "imitacion madera", "pamesa", "pavimentos"]
    },
    {
      id: "roca-banos",
      name: "Roca",
      edition: "Colección Espacios de Baño, Sanitarios y Grifería 2026",
      year: "2026",
      category: "Baños y Grifería",
      sede: "Sede Exposición",
      featured: true,
      logoUrl: "",
      logoMonogram: "ROCA",
      coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      description: "Soluciones integrales para el cuarto de baño: inodoros suspendidos, platos de ducha extraplanos, muebles de baño y grifería termostática.",
      pagesCount: 210,
      fileSize: "22.1 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["baños", "sanitarios", "griferia", "ducha", "inodoros", "roca", "muebles de baño"]
    },
    {
      id: "argenta-ceramica",
      name: "Argenta Cerámica",
      edition: "Series Arquitectónicas & Interiorismo Mediterráneo 2026",
      year: "2026",
      category: "Cerámica y Pavimentos",
      sede: "Sede Exposición",
      featured: true,
      logoUrl: "",
      logoMonogram: "ARGENTA",
      coverImage: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
      description: "Acabados cerámicos de alta gama en tonos tierra, piedra caliza, barros artesanales y porcelánico antideslizante C3 para exteriores y piscinas.",
      pagesCount: 142,
      fileSize: "15.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["argenta", "exteriores", "piscinas", "antideslizante", "revestimiento", "ceramica"]
    },
    {
      id: "weber-saint-gobain",
      name: "Weber Saint-Gobain",
      edition: "Guía Técnica de Morteros, Adhesivos y Sistemas SATE 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: true,
      logoUrl: "",
      logoMonogram: "WEBER",
      coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      description: "Morteros cola flexibles C2TE S1/S2 para porcelánico, morteros técnicos de reparación de fachadas, impermeabilizantes y rejuntados.",
      pagesCount: 128,
      fileSize: "14.2 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["weber", "pegoland", "mortero cola", "fachadas", "sate", "impermeabilizacion", "sacos"]
    },
    {
      id: "tres-griferia",
      name: "TRES Grifería",
      edition: "Catálogo Grifería de Diseño para Baño y Cocina 2026",
      year: "2026",
      category: "Baños y Grifería",
      sede: "Sede Exposición",
      featured: true,
      logoUrl: "",
      logoMonogram: "TRES",
      coverImage: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
      description: "Grifería empotrada, columnas de ducha y grifos de cocina en acabados cromo, negro mate, oro cepillado y acero inoxidable.",
      pagesCount: 176,
      fileSize: "19.5 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["grifos", "tres", "negro mate", "oro cepillado", "ducha empotrada", "cocina"]
    },
    {
      id: "sika-construccion",
      name: "Sika",
      edition: "Soluciones Químicas, Selladores e Impermeabilización 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: true,
      logoUrl: "",
      logoMonogram: "SIKA",
      coverImage: "https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=800&q=80",
      description: "Aditivos para hormigón, masillas de poliuretano Sikaflex, láminas impermeabilizantes para cubiertas, terrazas y depósitos.",
      pagesCount: 116,
      fileSize: "12.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["sika", "sikaflex", "quimicos", "humedades", "cubiertas", "selladores", "impermeabilizar"]
    },
    {
      id: "marazzi-ceramica",
      name: "Marazzi",
      edition: "Colección Gres Porcelánico & Revestimientos de Autor 2026",
      year: "2026",
      category: "Cerámica y Pavimentos",
      sede: "Sede Exposición",
      featured: false,
      logoUrl: "",
      logoMonogram: "MARAZZI",
      coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
      description: "Diseño italiano en pavimentos residenciales y comerciales, pequeños formatos decorativos tipo hidráulico y mármoles cerámicos.",
      pagesCount: 190,
      fileSize: "21.0 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["marazzi", "hidraulico", "marmol", "azulejos baño", "cocinas", "porcelanico"]
    },
    {
      id: "salgar-banos",
      name: "Salgar",
      edition: "Mobiliario de Baño, Mamparas y Espejos LED 2026",
      year: "2026",
      category: "Baños y Grifería",
      sede: "Sede Exposición",
      featured: false,
      logoUrl: "",
      logoMonogram: "SALGAR",
      coverImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
      description: "Muebles de baño modulares en acabados madera natural, lacados mate, encimeras solid surface, mamparas de ducha y espejos retroiluminados.",
      pagesCount: 154,
      fileSize: "17.3 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["salgar", "muebles de baño", "mamparas", "espejos led", "lavabos", "madera"]
    },
    {
      id: "danosa-aislamiento",
      name: "Danosa",
      edition: "Catálogo de Aislamiento Térmico, Acústico y Láminas 2026",
      year: "2026",
      category: "Aislamientos",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "",
      logoMonogram: "DANOSA",
      coverImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
      description: "Poliestireno extruido (XPS), láminas asfálticas, barreras de vapor, drenajes y aislamiento acústico para obra nueva y rehabilitación.",
      pagesCount: 98,
      fileSize: "10.6 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["danosa", "aislamiento", "xps", "tela asfaltica", "acustico", "termico", "cubiertas"]
    },
    {
      id: "knauf-placa-yeso",
      name: "Knauf",
      edition: "Sistemas de Construcción Seca, Placas PYL y Techos 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "",
      logoMonogram: "KNAUF",
      coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      description: "Placas de yeso laminado estándar, hidrófugas e ignífugas, perfilería metálica, pastas de juntas y falsos techos registrables.",
      pagesCount: 132,
      fileSize: "14.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["knauf", "pladur", "yeso laminado", "perfiles", "tabiqueria", "techos"]
    },
    {
      id: "rubi-herramientas",
      name: "RUBI",
      edition: "Herramientas Profesionales de Corte y Colocación 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "",
      logoMonogram: "RUBI",
      coverImage: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80",
      description: "Cortadoras manuales y eléctricas para gran formato, discos de diamante, sistemas de nivelación cerámica, mezcladores y llanas.",
      pagesCount: 148,
      fileSize: "16.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["rubi", "herramientas", "cortadora", "discos diamante", "nivelacion", "ferreteria"]
    },
    {
      id: "ceramica-la-escandella",
      name: "La Escandella",
      edition: "Tejas Cerámicas, Cubiertas Ventiladas y Obra Gruesa 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "",
      logoMonogram: "ESCANDELLA",
      coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      description: "Teja curva, mixta y plana en acabados envejecidos mediterráneos, piezas especiales de cumbrera y sistemas de tejado ventilado.",
      pagesCount: 88,
      fileSize: "11.2 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["tejas", "cubiertas", "tejados", "obra gruesa", "ceramica estructural", "ladrillos"]
    }
  ],

  // 3. RESEÑAS DE GOOGLE (Diferenciadas por Sede Almacén y Sede Exposición)
  googleReviews: [
    {
      id: "rev-1",
      author: "Carlos Rodríguez Gómez",
      initials: "CR",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 2 semanas",
      role: "Particular · Reforma integral de vivienda en Chiclana",
      text: "Fuimos a la Sede de Exposición en Pelagatos para elegir los suelos porcelánicos imitación madera y los dos cuartos de baño completos. El trato y el asesoramiento fueron de 10, nos dedicaron todo el tiempo del mundo combinando texturas y nos prepararon el presupuesto rapidísimo."
    },
    {
      id: "rev-2",
      author: "Construcciones y Reformas Bahía S.L.",
      initials: "CB",
      sede: "Sede Almacén",
      rating: 5,
      date: "Hace 3 semanas",
      role: "Empresa Constructora · Cliente Profesional",
      text: "Trabajamos a diario con el Almacén de Millán en Pelagatos. Tienen muchísimo stock de sacos, morteros, ladrillos, aislamientos y ferretería. Lo mejor es la rapidez de carga por las mañanas temprano: entras, cargas y sigues hacia la obra sin perder tiempo."
    },
    {
      id: "rev-3",
      author: "María del Carmen Sánchez",
      initials: "MC",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 1 mes",
      role: "Particular · Reforma de baño y terraza en Novo Sancti Petri",
      text: "Una exposición preciosa, muy bien iluminada y con las mejores marcas de azulejos y muebles de baño. Además, como tienen el almacén justo en la misma calle a pocos metros, compramos allí mismo el mortero cola y los materiales de agarre que nos pidió el albañil."
    },
    {
      id: "rev-4",
      author: "Antonio Jesús Morales",
      initials: "AJ",
      sede: "Sede Almacén",
      rating: 5,
      date: "Hace 1 mes",
      role: "Particular · Obra exterior y jardín en El Marquesado",
      text: "Aunque no soy profesional de la construcción me atendieron en el almacén con una amabilidad increíble. Me explicaron exactamente qué impermeabilizante y qué áridos necesitaba para arreglar mi azotea y el porche. Buenos precios y gente de confianza."
    },
    {
      id: "rev-5",
      author: "Laura Domínguez & Estudio Interiorismo",
      initials: "LD",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 2 meses",
      role: "Interiorista · Proyectos en Cádiz, San Fernando y Conil",
      text: "Llevo años trayendo a mis clientes de toda la provincia de Cádiz a la exposición de Millán Chiclana. La variedad de catálogos actualizados, griferías en acabados especiales y pavimentos para interior y piscina es espectacular."
    },
    {
      id: "rev-6",
      author: "Francisco Javier Benítez",
      initials: "FJ",
      sede: "Sede Almacén",
      rating: 5,
      date: "Hace 2 meses",
      role: "Profesional Autónomo · Solador y Alicatador",
      text: "Tanto el almacén de materiales como la exposición están en la misma calle del Polígono Pelagatos, lo que es comodísimo. Siempre tienen morteros Weber, Sika, crucetas, niveladores y herramientas RUBI en stock. Totalmente recomendables."
    }
  ],

  // 4. PREGUNTAS FRECUENTES (FAQ)
  faqs: [
    {
      id: "faq-1",
      category: "Ubicación y Sedes",
      question: "¿Cuál es la diferencia entre la Sede Exposición y la Sede Almacén de Millán Chiclana?",
      answer: "Contamos con dos instalaciones especializadas en la misma calle del Polígono Industrial Pelagatos (separadas por apenas unos metros). En la Sede Exposición encontrarás ambientes de baños, azulejos, pavimentos porcelánicos, grifería, cocinas y asesoramiento de interiorismo. En la Sede Almacén disponemos de material de obra gruesa, áridos, sacos de cemento y mortero, ladrillos, bloques, aislamientos, químicos y ferretería con zona de carga rápida."
    },
    {
      id: "faq-2",
      category: "Particulares y Profesionales",
      question: "¿Vendéis tanto a clientes particulares como a empresas y profesionales de la construcción?",
      answer: "Sí, por supuesto. Atendemos tanto al cliente particular (minorista) que está reformando su vivienda, cuarto de baño, cocina o jardín y busca asesoramiento cercano, como a empresas constructoras, reformistas, albañiles, promotores e interioristas con condiciones y agilidad adaptadas al profesional."
    },
    {
      id: "faq-3",
      category: "Ubicación y Sedes",
      question: "¿Dónde estáis exactamente y es fácil aparcar o cargar mercancía?",
      answer: "Estamos en el Polígono Industrial Pelagatos en Chiclana de la Frontera (Cádiz), con acceso directo desde la autovía A-48. Ambas sedes se encuentran en la misma vía a escasos metros una de otra, con amplias zonas de aparcamiento en la puerta para turismos en la Exposición y zona de carga directa para furgonetas, remolques y camiones en el Almacén."
    },
    {
      id: "faq-4",
      category: "Presupuestos y Catálogos",
      question: "¿Cómo puedo pedir un presupuesto para mi reforma o consultar un producto de los catálogos PDF?",
      answer: "Puedes consultar todos nuestros catálogos desde la sección 'Marcas y Catálogos' de esta web, anotar la marca o colección que te gusta y llamarnos directamente por teléfono, enviarnos un mensaje desde el formulario de contacto o visitarnos en el Polígono Pelagatos. Te preparamos tu presupuesto personalizado sin compromiso."
    },
    {
      id: "faq-5",
      category: "Servicio y Reparto",
      question: "¿Realizáis envíos de materiales de construcción y cerámica fuera de Chiclana?",
      answer: "Sí. Además de dar servicio en todo el término municipal de Chiclana (centro, Sancti Petri, La Barrosa, El Marquesado, Pago del Humo, Pinar de los Franceses...), suministramos materiales y cerámica a toda la provincia de Cádiz (Cádiz capital, San Fernando, Puerto Real, El Puerto de Santa María, Jerez, Conil, Vejer, Medina Sidonia, Campo de Gibraltar), zonas limítrofes de Sevilla y Málaga, Gibraltar y Ceuta. Consúltanos condiciones de transporte a pie de obra."
    },
    {
      id: "faq-6",
      category: "Asesoramiento",
      question: "¿Necesito pedir cita previa para visitar la Exposición o el Almacén?",
      answer: "Para el Almacén no necesitas cita previa: puedes venir directamente en horario de apertura y retirar tu material al momento. Para la Exposición tampoco es obligatorio pedir cita, aunque si deseas un estudio detenido de varios baños o el pavimento completo de tu vivienda, puedes llamarnos antes por teléfono para asegurarte atención inmediata sin esperas."
    }
  ]
};

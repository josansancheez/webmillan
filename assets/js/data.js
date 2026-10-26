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
    whatsappDisplay: "+34 628 11 55 85",
    whatsappHref: "https://wa.me/34628115585?text=Hola%20Mill%C3%A1n%20Chiclana%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta.",
    email: "millan@millanchiclana.com",
    emailHref: "contacto.html#formulario-contacto",
    instagramUrl: "https://www.instagram.com/millanservicios/",
    instagramHandle: "@millanservicios",
    facebookUrl: "https://www.facebook.com/millan.chiclana.5",
    facebookName: "Millán Chiclana",
    poligono: "Avenida Bahía de Algeciras N23 · Polígono Industrial Pelagatos, Chiclana de la Frontera (Cádiz)",
    sedes: {
      exposicion: {
        id: "Sede Exposición",
        shortName: "Sede Exposición",
        fullName: "Millán Chiclana · Sede Exposición e Interiorismo",
        address: "Avenida Bahía de Algeciras N23 (Pol. Ind. Pelagatos), Nave Exposición, 11130 Chiclana de la Frontera, Cádiz",
        scheduleWeekdays: "Lunes a Viernes: 09:00 – 14:00 y 17:00 – 20:00",
        scheduleSaturday: "Sábados: 10:00 – 13:00",
        googleMapsDirectionsUrl: "https://maps.app.goo.gl/hja5eodfEP7cb46U8",
        googleReviewUrl: "https://maps.app.goo.gl/hja5eodfEP7cb46U8",
        writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJNXgh8Vw0DA0R0cXykAhE4BI",
        placeId: "ChIJNXgh8Vw0DA0R0cXykAhE4BI",
        fid: "0xd0c345cf1217835:0x12e0440890f2c5d1",
        rating: "4.2",
        totalReviews: 72
      },
      almacen: {
        id: "Sede Almacén",
        shortName: "Sede Almacén",
        fullName: "Millán Chiclana · Sede Almacén de Construcción",
        address: "Avenida Bahía de Algeciras N23 (Pol. Ind. Pelagatos), Nave Almacén (en la misma calle a pocos metros), 11130 Chiclana de la Frontera, Cádiz",
        scheduleWeekdays: "Lunes a Viernes: 07:30 – 14:00 y 15:30 – 18:30",
        scheduleSaturday: "Sábados: 08:30 – 13:00",
        googleMapsDirectionsUrl: "https://maps.app.goo.gl/zsD1AbVrbpVkRBYB8",
        googleReviewUrl: "https://maps.app.goo.gl/zsD1AbVrbpVkRBYB8",
        writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJaQJxUbg1DA0RH90b007PRt0",
        placeId: "ChIJaQJxUbg1DA0RH90b007PRt0",
        fid: "0xd0c35b851710269:0xdd46cf4ed31bdd1f",
        rating: "5.0",
        totalReviews: 1
      }
    }
  },

  // 2A. ESTRUCTURA DE FAMILIAS DE MARCAS DE LA EXPOSICIÓN
  exposicionSections: [
      {
          "id": "Cerámica",
          "title": "Cerámica",
          "brandIds": [
              "realonda",
              "saloni",
              "vives",
              "fanal",
              "ascot",
              "vallelunga",
              "cerdomus",
              "azulev",
              "cristacer",
              "navarti",
              "equipe",
              "tribeca-keros",
              "exagres",
              "alcalagres",
              "estilker",
              "ezarri",
              "ribesalbes",
              "provenza",
              "stn"
          ]
      },
      {
          "id": "Piedras",
          "title": "Piedras",
          "brandIds": [
              "verni-prens",
              "ceramat"
          ]
      },
      {
          "id": "Sanitario",
          "title": "Sanitario",
          "brandIds": [
              "sanindusa",
              "duravit",
              "grohe",
              "bathco",
              "cifial",
              "olympia"
          ]
      },
      {
          "id": "Grifería",
          "title": "Grifería",
          "brandIds": [
              "tres",
              "grohe",
              "hansgrohe",
              "claus-bath",
              "tiempo",
              "gedy"
          ]
      },
      {
          "id": "Accesorios",
          "title": "Accesorios",
          "brandIds": [
              "gedy",
              "cosmic",
              "pedro-beltran",
              "inda"
          ]
      },
      {
          "id": "Mamparas",
          "title": "Mamparas",
          "brandIds": [
              "doccia",
              "glassinox",
              "mampasystem",
              "split"
          ]
      },
      {
          "id": "Mobiliario",
          "title": "Mobiliario",
          "brandIds": [
              "sanchis",
              "valman",
              "doccia"
          ]
      }
  ],

  // 2. MARCAS Y CATÁLOGOS PDF (Sede Exposición + Sede Almacén)
  brandsCatalogs: [
    // =========================================================================
    // MARCAS SEDE EXPOSICIÓN (41 Marcas Oficiales en 7 Familias)
    // =========================================================================
    {
          "id": "realonda",
          "name": "Realonda",
          "edition": "Catálogo General de Gres Porcelánico, Revestimientos y Piezas Especiales 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": true,
          "logoUrl": "assets/img/marcas/realonda.svg",
          "logoMonogram": "REALONDA",
          "coverImage": "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
          "description": "Colecciones cerámicas de vanguardia, gres porcelánico con relieve, texturas pétreas, hidráulicos e imitación barro y madera.",
          "pagesCount": 196,
          "fileSize": "21.4 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "realonda",
                "ceramica",
                "azulejos",
                "porcelanico",
                "exposicion"
          ]
    },
    {
          "id": "saloni",
          "name": "Saloni",
          "edition": "Colecciones de Pavimentos y Revestimientos Cerámicos de Diseño 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": true,
          "logoUrl": "assets/img/marcas/saloni.svg",
          "logoMonogram": "SALONI",
          "coverImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "description": "Referente nacional en cerámica arquitectónica: porcelánicos rectificados gran formato, revestimientos pasta blanca para baños y suelos continuos In&Out.",
          "pagesCount": 240,
          "fileSize": "24.8 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "saloni",
                "ceramica",
                "pavimentos",
                "azulejos",
                "porcelanico",
                "exposicion"
          ]
    },
    {
          "id": "vives",
          "name": "Vives",
          "edition": "Catálogo de Suelos Hidráulicos, Terrazos y Porcelánico Contemporáneo 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/vives.svg",
          "logoMonogram": "VIVES",
          "coverImage": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
          "description": "Diseños cerámicos con personalidad propia: baldosas hidráulicas, pequeño formato decorativo, terrazos cerámicos y maderas porcelánicas.",
          "pagesCount": 180,
          "fileSize": "19.2 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "vives",
                "vives azulejos",
                "ceramica",
                "hidraulico",
                "pavimentos",
                "exposicion"
          ]
    },
    {
          "id": "fanal",
          "name": "Fanal",
          "edition": "Colección de Porcelánicos Imitación Mármol, Piedra y Madera 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/fanal.svg",
          "logoMonogram": "FANAL",
          "coverImage": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
          "description": "Superficies porcelánicas pulidas, satinadas y mates en grandes formatos para salones, cocinas, fachadas y cuartos de baño.",
          "pagesCount": 148,
          "fileSize": "16.5 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "fanal",
                "ceramica",
                "marmol porcelanico",
                "suelos",
                "exposicion"
          ]
    },
    {
          "id": "ascot",
          "name": "Ascot",
          "edition": "Diseño Cerámico Italiano en Revestimientos y Suelos Porcelánicos 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/ascot.svg",
          "logoMonogram": "ASCOT",
          "coverImage": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
          "description": "Cerámica italiana de alta gama con acabados tridimensionales, texturas minerales y tonalidades cálidas para proyectos de interiorismo.",
          "pagesCount": 156,
          "fileSize": "17.8 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "ascot",
                "ceramica italiana",
                "porcelanico",
                "revestimientos",
                "exposicion"
          ]
    },
    {
          "id": "vallelunga",
          "name": "Vallelunga",
          "edition": "Colección Vallelunga & Co. de Mármoles, Piedras y Cerámica Decorativa 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/vallelunga.svg",
          "logoMonogram": "VALLELUNGA",
          "coverImage": "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
          "description": "Elegancia italiana en gres porcelánico y revestimiento cerámico con colecciones inspiradas en mármoles clásicos, travertinos y maderas nobles.",
          "pagesCount": 172,
          "fileSize": "18.9 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "vallelunga",
                "ceramica",
                "marmol",
                "revestimiento",
                "exposicion"
          ]
    },
    {
          "id": "cerdomus",
          "name": "Cerdomus",
          "edition": "Porcelánico Técnico y Colecciones Arquitectónicas Cerdomus 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/cerdomus.svg",
          "logoMonogram": "CERDOMUS",
          "coverImage": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
          "description": "Gres porcelánico de altísima resistencia y realismo superficial para pavimentos interiores, terrazas exteriores y espacios comerciales.",
          "pagesCount": 164,
          "fileSize": "18.2 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "cerdomus",
                "ceramica",
                "porcelanico",
                "pavimentos",
                "exposicion"
          ]
    },
    {
          "id": "azulev",
          "name": "Azulev",
          "edition": "Catálogo de Pavimentos Porcelánicos, Pasta Blanca y Serie Slim 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/azulev.svg",
          "logoMonogram": "AZULEV",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Soluciones cerámicas sostenibles para baños, cocinas y salones: revestimientos rectificados, suelos antideslizantes C3 y láminas de fino espesor.",
          "pagesCount": 188,
          "fileSize": "20.1 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "azulev",
                "ceramica",
                "azulejos",
                "pasta blanca",
                "exposicion"
          ]
    },
    {
          "id": "cristacer",
          "name": "Cristacer",
          "edition": "Catálogo General de Gres Porcelánico, Pasta Roja y Revestimiento 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/cristacer.svg",
          "logoMonogram": "CRISTACER",
          "coverImage": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
          "description": "Amplio abanico de formatos en pavimentos y azulejos cerámicos con acabados madera, cemento, piedra y marmoleados de gran durabilidad.",
          "pagesCount": 160,
          "fileSize": "17.4 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "cristacer",
                "ceramica",
                "azulejos",
                "gres",
                "exposicion"
          ]
    },
    {
          "id": "navarti",
          "name": "Navarti",
          "edition": "Colección de Porcelánicos de Gran Formato y Revestimientos 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/navarti.svg",
          "logoMonogram": "NAVARTI",
          "coverImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "description": "Superficies cerámicas versátiles para reformas integrales y obra nueva con diseños actuales en tonos neutros, tierras y grises.",
          "pagesCount": 152,
          "fileSize": "16.8 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "navarti",
                "ceramica",
                "porcelanico",
                "pavimentos",
                "exposicion"
          ]
    },
    {
          "id": "equipe",
          "name": "Equipe",
          "edition": "Especialistas en Azulejo Pequeño Formato, Zelliges, Metro y Hexágonos 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/equipe.svg",
          "logoMonogram": "EQUIPE",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Líder internacional en cerámica decorativa de pequeño formato: azulejos artesanales efecto Zellige, biselados, escamas y mosaicos geométricos.",
          "pagesCount": 204,
          "fileSize": "22.3 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "equipe",
                "equipe ceramicas",
                "pequeño formato",
                "zellige",
                "azulejos",
                "exposicion"
          ]
    },
    {
          "id": "tribeca-keros",
          "name": "Tribeca (Keros)",
          "edition": "Serie Tribeca y Colecciones Cerámicas Keros de Diseño Urbano 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/tribeca-keros.svg",
          "logoMonogram": "TRIBECA (KEROS)",
          "coverImage": "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
          "description": "Colección Tribeca de Keros Cerámica y gamas de revestimiento brillante, destonificado y pavimentos porcelánicos para baños y cocinas.",
          "pagesCount": 128,
          "fileSize": "14.5 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "tribeca",
                "keros",
                "tribeca keros",
                "ceramica",
                "azulejos",
                "exposicion"
          ]
    },
    {
          "id": "exagres",
          "name": "Exagres",
          "edition": "Gres Porcelánico Extruido, Peldaños, Terrazas y Coronación de Piscinas 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/exagres.svg",
          "logoMonogram": "EXAGRES",
          "coverImage": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
          "description": "Especialistas en soluciones técnicas en gres extruido: peldaños de escalera de una pieza, bordes skimmer e infinity para piscinas y suelos exteriores C3.",
          "pagesCount": 168,
          "fileSize": "18.6 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "exagres",
                "peldaños",
                "piscinas",
                "gres extruido",
                "terrazas",
                "ceramica",
                "exposicion"
          ]
    },
    {
          "id": "alcalagres",
          "name": "Alcalagres",
          "edition": "Gres Porcelánico Todo Masa de Altas Prestaciones 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/alcalagres.svg",
          "logoMonogram": "ALCALAGRES",
          "coverImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "description": "Porcelánico técnico integral de gran resistencia al desgaste, ideal para viviendas modernas, garajes, terrazas, fachadas ventiladas y zonas de alto tránsito.",
          "pagesCount": 136,
          "fileSize": "15.2 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "alcalagres",
                "porcelanico tecnico",
                "todo masa",
                "ceramica",
                "suelos",
                "exposicion"
          ]
    },
    {
          "id": "estilker",
          "name": "Estilker",
          "edition": "Colección de Porcelánicos Decorativos, Relieves y Maderas 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/estilker.svg",
          "logoMonogram": "ESTILKER",
          "coverImage": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
          "description": "Diseños vanguardistas en cerámica decorativa, listones porcelánicos efecto madera y revestimientos con textura para paredes de acento.",
          "pagesCount": 140,
          "fileSize": "15.8 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "estilker",
                "ceramica",
                "decoracion",
                "porcelanico",
                "exposicion"
          ]
    },
    {
          "id": "ezarri",
          "name": "Ezarri",
          "edition": "Catálogo de Gresite y Mosaico Vítreo para Piscinas, Spas y Baños 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/ezarri.svg",
          "logoMonogram": "EZARRI",
          "coverImage": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
          "description": "Referente mundial en mosaico de vidrio reciclado con sistema JointPoint para revestimiento de piscinas, duchas de obra, wellness e interiorismo.",
          "pagesCount": 144,
          "fileSize": "16.4 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "ezarri",
                "gresite",
                "mosaico",
                "piscinas",
                "duchas",
                "ceramica",
                "exposicion"
          ]
    },
    {
          "id": "ribesalbes",
          "name": "Ribesalbes",
          "edition": "Revestimientos Cerámicos para Cocinas, Baños y Decoración 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/ribesalbes.svg",
          "logoMonogram": "RIBESALBES",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Tradición e innovación en azulejos cerámicos de alta luminosidad, esmaltes brillantes y mates para el revestimiento de baños y cocinas.",
          "pagesCount": 132,
          "fileSize": "14.9 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "ribesalbes",
                "ceramica",
                "azulejos",
                "revestimientos",
                "exposicion"
          ]
    },
    {
          "id": "provenza",
          "name": "Provenza",
          "edition": "Colecciones Cerámicas de Alta Decoración Provenza 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/provenza.svg",
          "logoMonogram": "PROVENZA",
          "coverImage": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
          "description": "Superficies de autor inspiradas en piedras naturales, lavas volcánicas, terracotas y maderas recuperadas con un acabado táctil inigualable.",
          "pagesCount": 162,
          "fileSize": "18.3 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "provenza",
                "ceramica",
                "porcelanico",
                "diseño italiano",
                "exposicion"
          ]
    },
    {
          "id": "stn",
          "name": "STN",
          "edition": "Catálogo General de Gres Porcelánico, Suelos Madera y Gran Formato 2026",
          "year": "2026",
          "category": "Cerámica",
          "exposicionFamilies": [
                "Cerámica"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/stn.svg",
          "logoMonogram": "STN",
          "coverImage": "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
          "description": "Uno de los mayores fabricantes europeos de pavimento porcelánico, tarimas cerámicas imitación madera y revestimientos rectificados.",
          "pagesCount": 210,
          "fileSize": "22.7 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "stn",
                "stn ceramica",
                "porcelanico",
                "imitacion madera",
                "azulejos",
                "exposicion"
          ]
    },
    {
          "id": "verni-prens",
          "name": "Verni-prens",
          "edition": "Revestimientos Pétreos, Piedra Decorativa, Celosías y Jardín 2026",
          "year": "2026",
          "category": "Piedras",
          "exposicionFamilies": [
                "Piedras"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/verni-prens.svg",
          "logoMonogram": "VERNI-PRENS",
          "coverImage": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
          "description": "Plaquetas decorativas de piedra reconstituida para fachadas e interiores, celosías, albardillas, cubremuros, baldosas y decoración de jardín.",
          "pagesCount": 144,
          "fileSize": "16.2 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "verni-prens",
                "verniprens",
                "piedras",
                "celosias",
                "fachadas",
                "exposicion"
          ]
    },
    {
          "id": "ceramat",
          "name": "Ceramat",
          "edition": "Piedra Natural, Cuarcitas, Pizarras, Paneles Premontados yMosaicos 2026",
          "year": "2026",
          "category": "Piedras",
          "exposicionFamilies": [
                "Piedras"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/ceramat.svg",
          "logoMonogram": "CERAMAT",
          "coverImage": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
          "description": "Selección de piedras naturales, paneles de mampostería premontada, lajas, cuarcitas, pizarras y cantos rodados para revestimiento interior y exterior.",
          "pagesCount": 116,
          "fileSize": "13.8 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "ceramat",
                "piedras",
                "piedra natural",
                "cuarcita",
                "pizarra",
                "exposicion"
          ]
    },
    {
          "id": "sanindusa",
          "name": "Sanindusa",
          "edition": "Colección de Inodoros Suspendidos, Lavabos y Porcelana Sanitaria 2026",
          "year": "2026",
          "category": "Sanitario",
          "exposicionFamilies": [
                "Sanitario"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/sanindusa.svg",
          "logoMonogram": "SANINDUSA",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Sanitarios rimless de descarga limpia, inodoros compactos y suspendidos, lavabos sobre encimera, bidés y platos de ducha cerámicos.",
          "pagesCount": 176,
          "fileSize": "19.0 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "sanindusa",
                "sanitario",
                "inodoros",
                "lavabos",
                "baños",
                "exposicion"
          ]
    },
    {
          "id": "duravit",
          "name": "Duravit",
          "edition": "Sanitarios de Autor, Lavabos y Equipamiento de Baño Alemán 2026",
          "year": "2026",
          "category": "Sanitario",
          "exposicionFamilies": [
                "Sanitario"
          ],
          "sede": "Sede Exposición",
          "featured": true,
          "logoUrl": "assets/img/marcas/duravit.svg",
          "logoMonogram": "DURAVIT",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Porcelana sanitaria de precisión alemana firmada por diseñadores internacionales (Philippe Starck, Cecilie Manz): inodoros HygieneGlaze y lavabos DuraCeram.",
          "pagesCount": 220,
          "fileSize": "23.6 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "duravit",
                "sanitario",
                "inodoros",
                "lavabos",
                "baños",
                "exposicion"
          ]
    },
    {
          "id": "grohe",
          "name": "Grohe",
          "edition": "Sistemas de Ducha Termostáticos, Grifería Baño/Cocina y Sanitarios 2026",
          "year": "2026",
          "category": "Sanitario y Grifería",
          "exposicionFamilies": [
                "Sanitario",
                "Grifería"
          ],
          "sede": "Sede Exposición",
          "featured": true,
          "logoUrl": "assets/img/marcas/grohe.svg",
          "logoMonogram": "GROHE",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Ingeniería alemana para el agua: grifería monomando, columnas y sistemas empotrados SmartControl, cisternas ocultas Rapid SL y porcelana sanitaria Grohe.",
          "pagesCount": 248,
          "fileSize": "25.4 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "grohe",
                "sanitario",
                "griferia",
                "termostatica",
                "cisternas empotradas",
                "duchas",
                "exposicion"
          ]
    },
    {
          "id": "bathco",
          "name": "Bathco",
          "edition": "Lavabos de Diseño en Porcelana, Piedra, Resina y Sanitarios 2026",
          "year": "2026",
          "category": "Sanitario",
          "exposicionFamilies": [
                "Sanitario"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/bathco.svg",
          "logoMonogram": "BATHCO",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Especialistas en lavabos sobre encimera y murales en porcelana, piedra natural, Solid Surface, bambú y acabados decorados a mano en su Atelier.",
          "pagesCount": 192,
          "fileSize": "20.8 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "bathco",
                "sanitario",
                "lavabos",
                "inodoros",
                "baños",
                "exposicion"
          ]
    },
    {
          "id": "cifial",
          "name": "Cifial",
          "edition": "Porcelana Sanitaria y Equipamiento Contemporáneo para el Baño 2026",
          "year": "2026",
          "category": "Sanitario",
          "exposicionFamilies": [
                "Sanitario"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/cifial.svg",
          "logoMonogram": "CIFIAL",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Líneas minimalistas y arquitectónicas en sanitarios suspendidos y a suelo, lavabos integrados y soluciones completas para cuartos de baño.",
          "pagesCount": 140,
          "fileSize": "15.5 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "cifial",
                "sanitario",
                "inodoros",
                "lavabos",
                "baños",
                "exposicion"
          ]
    },
    {
          "id": "olympia",
          "name": "Olympia",
          "edition": "Sanitarios y Lavabos de Diseño Italiano en Acabados Mate y Color 2026",
          "year": "2026",
          "category": "Sanitario",
          "exposicionFamilies": [
                "Sanitario"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/olympia.svg",
          "logoMonogram": "OLYMPIA",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Cerámica sanitaria italiana de vanguardia con colecciones de lavabos e inodoros en blanco brillo, blanco mate, negro mate y tonos tierra.",
          "pagesCount": 154,
          "fileSize": "17.1 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "olympia",
                "olympia ceramica",
                "sanitario",
                "lavabos colores",
                "inodoros",
                "exposicion"
          ]
    },
    {
          "id": "tres",
          "name": "Tres",
          "edition": "Catálogo de Grifería de Baño, Cocina y Duchas Empotradas Block-System 2026",
          "year": "2026",
          "category": "Grifería",
          "exposicionFamilies": [
                "Grifería"
          ],
          "sede": "Sede Exposición",
          "featured": true,
          "logoUrl": "assets/img/marcas/tres.svg",
          "logoMonogram": "TRES",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Fabricante nacional líder en grifería monomando y termostática en acabados cromo, negro mate, oro cepillado, acero y bronce para baño y cocina.",
          "pagesCount": 216,
          "fileSize": "23.1 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "tres",
                "tres griferia",
                "griferia",
                "grifos negro mate",
                "duchas empotradas",
                "exposicion"
          ]
    },
    {
          "id": "hansgrohe",
          "name": "Hansgrohe",
          "edition": "Duchas Raindance, Grifería Talis/Metropol y Tecnología EcoSmart 2026",
          "year": "2026",
          "category": "Grifería",
          "exposicionFamilies": [
                "Grifería"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/hansgrohe.svg",
          "logoMonogram": "HANSGROHE",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Innovación alemana desde 1901 en rociadores de ducha, grifería con ahorro de agua EcoSmart, sistemas empotrados iBox universal y acabados FinishPlus.",
          "pagesCount": 208,
          "fileSize": "22.4 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "hansgrohe",
                "griferia",
                "duchas",
                "raindance",
                "ibox",
                "exposicion"
          ]
    },
    {
          "id": "claus-bath",
          "name": "Claus&Bath",
          "edition": "Colección de Grifería Monomando, Columnas de Ducha y Empotrados 2026",
          "year": "2026",
          "category": "Grifería",
          "exposicionFamilies": [
                "Grifería"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/claus-bath.svg",
          "logoMonogram": "CLAUS&BATH",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Conjuntos de ducha termostáticos, grifería empotrada de lavabo y ducha, caños altos y grifos de cocina extraíbles en múltiples acabados.",
          "pagesCount": 124,
          "fileSize": "14.2 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "claus&bath",
                "claus and bath",
                "claus bath",
                "griferia",
                "columnas ducha",
                "exposicion"
          ]
    },
    {
          "id": "tiempo",
          "name": "Tiempo",
          "edition": "Gama de Grifería Funcional y Contemporánea para Baño y Cocina 2026",
          "year": "2026",
          "category": "Grifería",
          "exposicionFamilies": [
                "Grifería"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/tiempo.svg",
          "logoMonogram": "TIEMPO",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Soluciones fiables en grifería de lavabo, bidé, bañera-ducha y fregadero con cartuchos cerámicos de alta durabilidad.",
          "pagesCount": 98,
          "fileSize": "11.6 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "tiempo",
                "griferia tiempo",
                "griferia",
                "grifos",
                "baños",
                "exposicion"
          ]
    },
    {
          "id": "gedy",
          "name": "Gedy",
          "edition": "Colección Italiana de Accesorios de Baño, Complementos y Grifería 2026",
          "year": "2026",
          "category": "Grifería y Accesorios",
          "exposicionFamilies": [
                "Grifería",
                "Accesorios"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/gedy.svg",
          "logoMonogram": "GEDY",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Diseño italiano desde 1953 en accesorios murales (toalleros, portarrollos, dosificadores con fijación con o sin taladro) y series de grifería para baño.",
          "pagesCount": 168,
          "fileSize": "18.4 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "gedy",
                "griferia",
                "accesorios",
                "toalleros",
                "complementos baño",
                "exposicion"
          ]
    },
    {
          "id": "cosmic",
          "name": "Cosmic",
          "edition": "Accesorios de Baño Arquitectónicos, Espejos y Complementos Cosmic 2026",
          "year": "2026",
          "category": "Accesorios",
          "exposicionFamilies": [
                "Accesorios"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/cosmic.svg",
          "logoMonogram": "COSMIC",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Referente en accesorios de baño minimalistas de alta resistencia anticorrosión, espejos de aumento, repisas de ducha y papeleras de diseño.",
          "pagesCount": 152,
          "fileSize": "16.9 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "cosmic",
                "accesorios",
                "accesorios baño",
                "toalleros",
                "espejos",
                "exposicion"
          ]
    },
    {
          "id": "pedro-beltran",
          "name": "Pedro Beltrán",
          "edition": "Catálogo de Accesorios de Baño, Barras de Apoyo y Espejos LED 2026",
          "year": "2026",
          "category": "Accesorios",
          "exposicionFamilies": [
                "Accesorios"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/pedro-beltran.svg",
          "logoMonogram": "PEDRO BELTRÁN",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Fabricación y distribución de accesorios de baño en acero inoxidable y latón, ayudas técnicas de movilidad reducida y espejos retroiluminados.",
          "pagesCount": 136,
          "fileSize": "15.1 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "pedro beltran",
                "accesorios",
                "espejos baño",
                "toalleros",
                "barras apoyo",
                "exposicion"
          ]
    },
    {
          "id": "inda",
          "name": "Inda",
          "edition": "Accesorios de Baño Italianos de Alta Gama y Soluciones Hotel/Hogar 2026",
          "year": "2026",
          "category": "Accesorios",
          "exposicionFamilies": [
                "Accesorios"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/inda.svg",
          "logoMonogram": "INDA",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Más de 75 años de excelencia italiana en accesorios de baño en latón cromado, negro mate, níquel cepillado y acabados PVD.",
          "pagesCount": 148,
          "fileSize": "16.3 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "inda",
                "accesorios",
                "accesorios baño",
                "toalleros",
                "portarrollos",
                "exposicion"
          ]
    },
    {
          "id": "doccia",
          "name": "Doccia",
          "edition": "Catálogo de Mamparas de Ducha a Medida, Platos de Resina y Muebles 2026",
          "year": "2026",
          "category": "Mamparas y Mobiliario",
          "exposicionFamilies": [
                "Mamparas",
                "Mobiliario"
          ],
          "sede": "Sede Exposición",
          "featured": true,
          "logoUrl": "assets/img/marcas/doccia.svg",
          "logoMonogram": "DOCCIA",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Soluciones integrales de baño fabricadas en Andalucía: mamparas con vidrio templado antical, platos de ducha de carga mineral y mobiliario de baño.",
          "pagesCount": 184,
          "fileSize": "20.2 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "doccia",
                "mamparas",
                "mobiliario",
                "platos de ducha",
                "muebles de baño",
                "exposicion"
          ]
    },
    {
          "id": "glassinox",
          "name": "Glassinox",
          "edition": "Mamparas de Ducha en Acero Inoxidable y Vidrio Templado a Medida 2026",
          "year": "2026",
          "category": "Mamparas",
          "exposicionFamilies": [
                "Mamparas"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/glassinox.svg",
          "logoMonogram": "GLASSINOX",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Especialistas en mamparas de ducha correderas, abatibles y fijos walk-in con perfilería y rodamientos en acero inoxidable de máxima durabilidad.",
          "pagesCount": 128,
          "fileSize": "14.7 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "glassinox",
                "mamparas",
                "mamparas acero inoxidable",
                "ducha",
                "exposicion"
          ]
    },
    {
          "id": "mampasystem",
          "name": "Mampasystem",
          "edition": "Colección de Mamparas de Ducha y Bañera Personalizadas 2026",
          "year": "2026",
          "category": "Mamparas",
          "exposicionFamilies": [
                "Mamparas"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/mampasystem.svg",
          "logoMonogram": "MAMPASYSTEM",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Mamparas frontales, angulares, plegables y paneles fijos con tratamiento antical de serie y perfilería en plata brillo, negro mate, blanco y oro.",
          "pagesCount": 118,
          "fileSize": "13.6 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "mampasystem",
                "mamparas",
                "mamparas ducha",
                "antical",
                "exposicion"
          ]
    },
    {
          "id": "split",
          "name": "Split",
          "edition": "Gama de Mamparas de Ducha Funcionales y Minimalistas Split 2026",
          "year": "2026",
          "category": "Mamparas",
          "exposicionFamilies": [
                "Mamparas"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/split.svg",
          "logoMonogram": "SPLIT",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Mamparas de ducha de entrega rápida y fabricación a medida con vidrio de seguridad de 6 y 8 mm y cierres magnéticos herméticos.",
          "pagesCount": 104,
          "fileSize": "12.1 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "split",
                "mamparas split",
                "mamparas",
                "ducha",
                "exposicion"
          ]
    },
    {
          "id": "sanchis",
          "name": "Sanchis",
          "edition": "Colección de Muebles de Baño Suspendidos, Auxiliares y Encimeras 2026",
          "year": "2026",
          "category": "Mobiliario",
          "exposicionFamilies": [
                "Mobiliario"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/sanchis.svg",
          "logoMonogram": "SANCHIS",
          "coverImage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
          "description": "Muebles de baño con cajones de extracción total y cierre amortiguado, acabados en maderas naturales, lacados mates y frentes alistonados.",
          "pagesCount": 160,
          "fileSize": "17.9 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "sanchis",
                "mobiliario",
                "muebles de baño",
                "encimeras baño",
                "exposicion"
          ]
    },
    {
          "id": "valman",
          "name": "Valman",
          "edition": "Mobiliario de Baño Contemporáneo, Camerinos y Columnas Auxiliares 2026",
          "year": "2026",
          "category": "Mobiliario",
          "exposicionFamilies": [
                "Mobiliario"
          ],
          "sede": "Sede Exposición",
          "featured": false,
          "logoUrl": "assets/img/marcas/valman.svg",
          "logoMonogram": "VALMAN",
          "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
          "description": "Fabricación de mobiliario de baño funcional y de diseño con múltiples combinaciones de lavabos cerámicos, carga mineral y espejos LED.",
          "pagesCount": 142,
          "fileSize": "15.8 MB",
          "pdfUrl": "catalogos/catalogo-demo-millan.pdf",
          "keywords": [
                "valman",
                "mobiliario",
                "muebles de baño",
                "baños",
                "exposicion"
          ]
    },

    // =========================================================================
    // MARCAS SEDE ALMACÉN (38 Marcas Oficiales)
    // =========================================================================
    {
      id: "holcim",
      name: "Holcim",
      edition: "Catálogo de Cementos, Hormigones y Soluciones Sostenibles 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: true,
      logoUrl: "assets/img/marcas/holcim.svg",
      logoMonogram: "HOLCIM",
      coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      description: "Cementos de alta resistencia, conglomerantes hidráulicos ECOPlanet y soluciones para cimentaciones, estructuras y albañilería profesional.",
      pagesCount: 124,
      fileSize: "14.6 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["holcim", "cemento", "hormigon", "sacos", "obra gruesa", "almacen"]
    },
    {
      id: "sika",
      name: "Sika",
      edition: "Soluciones Químicas, Selladores Sikaflex e Impermeabilización 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: true,
      logoUrl: "assets/img/marcas/sika.svg",
      logoMonogram: "SIKA",
      coverImage: "assets/img/categorias/morteros-quimicos.jpg",
      description: "Aditivos para hormigón, masillas de poliuretano Sikaflex, resinas epoxi, morteros de reparación estructural e impermeabilizantes para cubiertas y terrazas.",
      pagesCount: 168,
      fileSize: "18.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["sika", "sikaflex", "quimicos", "humedades", "cubiertas", "selladores", "impermeabilizar", "almacen"]
    },
    {
      id: "grupo-puma",
      name: "Grupo Puma",
      edition: "Catálogo Técnico Pegoland, Morteros Secos y Sistemas SATE 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: true,
      logoUrl: "assets/img/marcas/grupo-puma.svg",
      logoMonogram: "GRUPO PUMA",
      coverImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      description: "Adhesivos cementosos Pegoland C2TE S1/S2 para gres porcelánico, morteros de albañilería y enfoscado, morteros de juntas e impermeabilización.",
      pagesCount: 152,
      fileSize: "16.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["grupo puma", "pegoland", "mortero cola", "enfoscado", "sate", "sacos", "almacen"]
    },
    {
      id: "bellota",
      name: "Bellota",
      edition: "Herramientas Profesionales para Construcción y Alicatado 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/bellota.svg",
      logoMonogram: "BELLOTA",
      coverImage: "assets/img/categorias/ferreteria-herramientas.jpg",
      description: "Paletas forjadas en una sola pieza, llanas y peines dentados, macetas, cinceles, cortadoras manuales de cerámica, discos de diamante y niveles.",
      pagesCount: 184,
      fileSize: "20.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["bellota", "herramientas", "paletas", "llanas", "discos", "ferreteria", "almacen"]
    },
    {
      id: "cosmos",
      name: "Cementos Cosmos",
      edition: "Gama de Cementos Portland y Especiales para Edificación 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/cosmos.svg",
      logoMonogram: "COSMOS",
      coverImage: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
      description: "Cementos ensacados de alta trabajabilidad y resistencia para hormigones, soleras, morteros de albañilería y prefabricados.",
      pagesCount: 76,
      fileSize: "9.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["cosmos", "cementos cosmos", "cemento", "sacos", "obra gruesa", "almacen"]
    },
    {
      id: "colotool",
      name: "Colotool",
      edition: "Útiles Profesionales para Alicatador, Pladur y Aislamiento 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/colotool.svg",
      logoMonogram: "COLOTOOL",
      coverImage: "assets/img/categorias/nivelacion-ceramica.jpg",
      description: "Herramientas especializadas para colocadores de cerámica, sistemas de nivelación, ventosas, talochas, espátulas y útiles para placa de yeso laminado.",
      pagesCount: 112,
      fileSize: "13.1 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["colotool", "herramientas", "alicatador", "llanas", "ventosas", "pladur", "almacen"]
    },
    {
      id: "rofer-and-rodi",
      name: "Rofer & Rodi (Demetrio)",
      edition: "Suministros de Fontanería, Saneamiento, Riego y Construcción 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/rofer-rodi.svg",
      logoMonogram: "ROFER & RODI",
      coverImage: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
      description: "Catálogo Demetrio Romero (Rofer & Rodi): tuberías, canalización, evacuación, valvulonería, accesorios de fontanería, piscinas y suministros de obra.",
      pagesCount: 196,
      fileSize: "21.5 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["rofer", "rodi", "demetrio", "fontaneria", "saneamiento", "tuberias", "almacen"]
    },
    {
      id: "lasur",
      name: "Lasur",
      edition: "Soluciones Técnicas, Impermeabilización y Protección en Obra 2026",
      year: "2026",
      category: "Aislamientos",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/lasur.svg",
      logoMonogram: "LASUR",
      coverImage: "assets/img/categorias/aislamientos-cubiertas.jpg",
      description: "Protectores y tratamientos técnicos para superficies, láminas impermeabilizantes, aislamientos y soluciones auxiliares de construcción.",
      pagesCount: 92,
      fileSize: "10.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["lasur", "tratamientos", "proteccion", "aislamiento", "impermeabilizacion", "almacen"]
    },
    {
      id: "cofan",
      name: "Cofan",
      edition: "Catálogo General de Ferretería Profesional y Suministro Industrial 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/cofan.svg",
      logoMonogram: "COFAN",
      coverImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80",
      description: "Amplio surtido en ferretería de obra, tornillería, fijación, abrasivos, herramientas manuales, señalización, bricolaje y equipos de protección individual.",
      pagesCount: 240,
      fileSize: "24.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["cofan", "ferreteria", "tornilleria", "herramientas", "epis", "industrial", "almacen"]
    },
    {
      id: "valenplas",
      name: "Valenplas",
      edition: "Plásticos para Construcción, Film de Polietileno y Sacos 2026",
      year: "2026",
      category: "Aislamientos",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/valenplas.svg",
      logoMonogram: "VALENPLAS",
      coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      description: "Bobinas de plástico negro y natural para soleras y barreras de vapor, film protector para reformas, sacos de escombro y mallas de señalización.",
      pagesCount: 68,
      fileSize: "8.2 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["valenplas", "plasticos", "polietileno", "film", "sacos escombro", "soleras", "almacen"]
    },
    {
      id: "tector-holcim",
      name: "Tector (Holcim)",
      edition: "Gama de Morteros Industriales, Adhesivos y Revocos Técnicos 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/tector.svg",
      logoMonogram: "TECTOR",
      coverImage: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=800&q=80",
      description: "Morteros secos Tector by Holcim para albañilería, adhesivos cerámicos de altas prestaciones, autonivelantes y morteros de acabado para fachadas.",
      pagesCount: 118,
      fileSize: "13.7 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["tector", "holcim", "morteros", "adhesivos", "revocos", "autonivelante", "almacen"]
    },
    {
      id: "fal-seguridad",
      name: "Fal Seguridad",
      edition: "Calzado de Seguridad Profesional para Construcción e Industria 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/fal-seguridad.svg",
      logoMonogram: "FAL SEGURIDAD",
      coverImage: "assets/img/categorias/ferreteria-herramientas.jpg",
      description: "Botas y zapatos de seguridad S3 con puntera no metálica, plantilla antiperforación, suelas antideslizantes de alta resistencia y membrana impermeable.",
      pagesCount: 104,
      fileSize: "12.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["fal seguridad", "botas obra", "calzado seguridad", "epis", "vestuario laboral", "almacen"]
    },
    {
      id: "ruiz-dorantes",
      name: "Ruiz Dorantes",
      edition: "Yesos de Construcción, Escayolas y Prefabricados 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/ruiz-dorantes.svg",
      logoMonogram: "RUIZ DORANTES",
      coverImage: "assets/img/categorias/obra-gruesa.jpg",
      description: "Yesos manuales y de proyección, escayolas de alta blancura, placas para techos registrables, molduras y prefabricados de escayola.",
      pagesCount: 86,
      fileSize: "10.1 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["ruiz dorantes", "yeso", "escayola", "techos", "prefabricados", "sacos", "almacen"]
    },
    {
      id: "ceramica-la-perdiz",
      name: "Cerámica La Perdiz",
      edition: "Cerámica Estructural, Ladrillería y Materiales de Albañilería 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/ceramica-la-perdiz.svg",
      logoMonogram: "CERÁMICA LA PERDIZ",
      coverImage: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      description: "Ladrillos huecos dobles y triples, ladrillo perforado, rasillones machihembrados, bovedillas cerámicas y piezas para tabiquería y cerramientos.",
      pagesCount: 74,
      fileSize: "9.0 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["ceramica la perdiz", "la perdiz", "ladrillos", "rasillones", "tabiqueria", "ceramica estructural", "obra gruesa", "almacen"]
    },
    {
      id: "arcobloc",
      name: "Arcobloc",
      edition: "Bloques de Hormigón, Bovedillas y Prefabricados 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/arcobloc.svg",
      logoMonogram: "ARCOBLOC",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
      description: "Bloques de hormigón vibrado lisos y split, bovedillas para forjados, adoquines, bordillos, arquetas prefabricadas y cubremuros.",
      pagesCount: 96,
      fileSize: "11.5 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["arcobloc", "bloques hormigon", "bovedillas", "arquetas", "prefabricados", "obra gruesa", "almacen"]
    },
    {
      id: "lafarge",
      name: "Lafarge",
      edition: "Cementos Especiales, Morteros y Conglomerantes de Obra 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/lafarge.svg",
      logoMonogram: "LAFARGE",
      coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      description: "Cementos grises y blancos de alta durabilidad, conglomerantes para albañilería y hormigones de uso estructural y civil.",
      pagesCount: 90,
      fileSize: "10.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["lafarge", "cemento", "cemento blanco", "hormigon", "sacos", "obra gruesa", "almacen"]
    },
    {
      id: "mustang",
      name: "Mustang",
      edition: "Sistemas de Nivelación Cerámica, Crucetas y Accesorios 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/mustang.svg",
      logoMonogram: "MUSTANG",
      coverImage: "assets/img/categorias/nivelacion-ceramica.jpg",
      description: "Calzos, cuñas y tenazas de nivelación para alicatado y solado de gran formato, crucetas separadoras de precisión y accesorios de colocación.",
      pagesCount: 82,
      fileSize: "9.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["mustang", "nivelacion", "crucetas", "cuñas", "calzos", "alicatado", "almacen"]
    },
    {
      id: "fischer",
      name: "Fischer",
      edition: "Sistemas de Fijación Profesional, Tacos Químicos y Anclajes 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/fischer.svg",
      logoMonogram: "FISCHER",
      coverImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80",
      description: "Tacos multimaterial DuoPower, anclajes químicos de alta carga, fijaciones metálicas, espumas de poliuretano, siliconas y adhesivos de montaje.",
      pagesCount: 172,
      fileSize: "19.2 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["fischer", "tacos", "duopower", "taco quimico", "anclajes", "fijacion", "espuma", "almacen"]
    },
    {
      id: "fredimar",
      name: "Fredimar",
      edition: "Discos de Diamante, Brocas y Herramienta Diamantada 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/fredimar.svg",
      logoMonogram: "FREDIMAR",
      coverImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      description: "Discos de diamante profesionales para corte de porcelánico, hormigón, granito y obra general, coronas perforadoras y platos de desbaste.",
      pagesCount: 94,
      fileSize: "11.3 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["fredimar", "discos diamante", "corte porcelanico", "brocas", "coronas", "herramientas", "almacen"]
    },
    {
      id: "solera",
      name: "Solera",
      edition: "Material Eléctrico, Cajas de Empotrar y Canalización de Obra 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/solera.svg",
      logoMonogram: "SOLERA",
      coverImage: "assets/img/categorias/ferreteria-herramientas.jpg",
      description: "Cajas universales de mecanismos y registro para tabiquería y pladur, cuadros de distribución empotrar/superficie, tubo corrugado y pequeño material eléctrico.",
      pagesCount: 136,
      fileSize: "15.1 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["solera", "material electrico", "cajas registro", "cuadros electricos", "tubo corrugado", "almacen"]
    },
    {
      id: "weber",
      name: "Weber",
      edition: "Guía Técnica de Morteros Cola, Rejuntados y Sistemas SATE 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: true,
      logoUrl: "assets/img/marcas/weber.svg",
      logoMonogram: "WEBER",
      coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      description: "Morteros cola flexibles webercol para porcelánico y piscinas, morteros de juntas webercolor, revocos técnicos de fachada e impermeabilizantes.",
      pagesCount: 164,
      fileSize: "17.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["weber", "saint-gobain", "webercol", "mortero cola", "rejuntado", "fachadas", "almacen"]
    },
    {
      id: "aquasal",
      name: "Aquasal",
      edition: "Sal en Pastillas para Descalcificadores y Cloración Salina de Piscinas 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/aquasal.svg",
      logoMonogram: "AQUASAL",
      coverImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      description: "Sacos de sal compactada de alta pureza para equipos descalcificadores domésticos e industriales y sal especial para piscinas con clorador salino.",
      pagesCount: 48,
      fileSize: "6.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["aquasal", "sal", "sal piscinas", "descalcificador", "cloracion salina", "sacos", "almacen"]
    },
    {
      id: "quilosa",
      name: "Quilosa",
      edition: "Catálogo de Siliconas, Selladores, Polímeros MS y Espumas PU 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/quilosa.svg",
      logoMonogram: "QUILOSA",
      coverImage: "assets/img/categorias/morteros-quimicos.jpg",
      description: "Siliconas neutras y sanitarias antimoho, adhesivos de montaje Sintex, polímeros híbridos MS, espumas de poliuretano y selladores acrílicos.",
      pagesCount: 128,
      fileSize: "14.5 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["quilosa", "silicona", "selladores", "espuma poliuretano", "adhesivos", "sintex", "almacen"]
    },
    {
      id: "dakota",
      name: "Dakota",
      edition: "Canaletas de Drenaje, Arquetas, Plots y Soluciones de Evacuación 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/dakota.svg",
      logoMonogram: "DAKOTA",
      coverImage: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
      description: "Canaletas y rejillas de evacuación de aguas pluviales, arquetas sifónicas y de registro, sumideros de terraza, plots regulables para pavimento técnico y perfiles.",
      pagesCount: 142,
      fileSize: "16.1 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["dakota", "canaletas", "drenaje", "arquetas", "rejillas", "plots", "evacuacion", "almacen"]
    },
    {
      id: "macofema",
      name: "Macofema",
      edition: "Suministros de Materiales de Construcción, Maderas y Obra 2026",
      year: "2026",
      category: "Material de Obra Gruesa",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/macofema.svg",
      logoMonogram: "MACOFEMA",
      coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      description: "Distribución especializada de materiales de construcción, tableros de encofrar, suministros sanitarios y complementos para edificación y reforma.",
      pagesCount: 84,
      fileSize: "9.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["macofema", "materiales construccion", "encofrado", "obra", "suministros", "almacen"]
    },
    {
      id: "crearplast",
      name: "Crearplast",
      edition: "Accesorios de Evacuación en PVC, Sumideros, Sifones y Saneamiento 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/crearplast.svg",
      logoMonogram: "CREARPLAST",
      coverImage: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
      description: "Piezas e injertos de PVC para evacuación, sumideros sifónicos, válvulas antirretorno, arquetas, calderetas y canalización sanitaria.",
      pagesCount: 156,
      fileSize: "17.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["crearplast", "pvc", "evacuacion", "sumideros", "sifones", "saneamiento", "fontaneria", "almacen"]
    },
    {
      id: "juancode",
      name: "Juancode",
      edition: "Suministros de Fontanería, Saneamiento y Tratamiento de Piscinas 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/juancode.svg",
      logoMonogram: "JUANCODE",
      coverImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      description: "Productos químicos para mantenimiento de piscinas (cloro multiacción, antialgas, floculantes), accesorios de fontanería, grifería técnica y ferretería.",
      pagesCount: 112,
      fileSize: "12.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["juancode", "piscinas", "cloro", "fontaneria", "saneamiento", "quimicos piscina", "almacen"]
    },
    {
      id: "tecnoagua",
      name: "Tecnoagua",
      edition: "Soluciones Hidrosanitarias, Evacuación, Sifones y Riego 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/tecnoagua.svg",
      logoMonogram: "TECNOAGUA",
      coverImage: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
      description: "Sifones de lavabo y fregadero, válvulas de desagüe, latiguillos, mecanismos de cisterna, accesorios de polietileno y riego.",
      pagesCount: 138,
      fileSize: "15.3 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["tecnoagua", "fontaneria", "sifones", "desagues", "latiguillos", "riego", "almacen"]
    },
    {
      id: "fominaya",
      name: "Fominaya",
      edition: "Mecanismos de Descarga para Cisternas, Grifos Flotadores y Recambios 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/fominaya.svg",
      logoMonogram: "FOMINAYA",
      coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      description: "Descargadores universales de doble pulsador, grifos flotadores silenciosos, cisternas altas y bajas, juntas y recambios originales de fontanería.",
      pagesCount: 92,
      fileSize: "10.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["fominaya", "mecanismos cisterna", "flotador", "descargador", "fontaneria", "recambios", "almacen"]
    },
    {
      id: "astralpool",
      name: "AstralPool",
      edition: "Equipamiento Integral para Piscinas: Filtración, Bombas y Accesorios 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/astralpool.svg",
      logoMonogram: "ASTRALPOOL",
      coverImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      description: "Skimmers, boquillas de impulsión, sumideros, focos LED subacuáticos, filtros de arena, bombas de filtración, limpiafondos y escaleras de piscina.",
      pagesCount: 220,
      fileSize: "23.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["astralpool", "astrapool", "piscinas", "skimmer", "depuradora", "bombas piscina", "almacen"]
    },
    {
      id: "enkel",
      name: "Enkel",
      edition: "Impermeabilizantes Elásticos, Cauchos Acrílicos y Pinturas Técnicas 2026",
      year: "2026",
      category: "Aislamientos",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/enkel.svg",
      logoMonogram: "ENKEL",
      coverImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      description: "Revestimientos elásticos antigoteras con fibra para azoteas y terrazas, membranas impermeabilizantes, mallas de refuerzo y pinturas para fachadas.",
      pagesCount: 78,
      fileSize: "9.2 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["enkel", "antigoteras", "caucho", "impermeabilizante", "azoteas", "pintura fachada", "almacen"]
    },
    {
      id: "jar",
      name: "JAR",
      edition: "Cepillería Industrial, Rodillos, Brochas y Útiles de Obra 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/jar.svg",
      logoMonogram: "JAR",
      coverImage: "assets/img/categorias/ferreteria-herramientas.jpg",
      description: "Cepillos de barrer de obra, escobas industriales, rodillos para fachada e impermeabilización, brochas, cubos, espuertas y útiles de limpieza.",
      pagesCount: 88,
      fileSize: "10.3 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["jar", "cepillos", "rodillos", "brochas", "espuertas", "ferreteria", "utiles obra", "almacen"]
    },
    {
      id: "patriol",
      name: "Patriol",
      edition: "Desincrustantes, Limpiadores de Obra e Hidrofugantes 2026",
      year: "2026",
      category: "Morteros y Químicos",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/patriol.svg",
      logoMonogram: "PATRIOL",
      coverImage: "assets/img/categorias/morteros-quimicos.jpg",
      description: "Limpiadores ácidos y desincrustantes de restos de cemento y salitre fin de obra, hidrofugantes para piedra, ladrillo visto y barro cocido.",
      pagesCount: 64,
      fileSize: "7.8 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["patriol", "quitacementos", "desincrustante", "limpieza obra", "hidrofugante", "quimicos", "almacen"]
    },
    {
      id: "tayg",
      name: "Tayg",
      edition: "Cajas de Herramientas, Gavetas de Ordenación y Enrollacables 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/tayg.svg",
      logoMonogram: "TAYG",
      coverImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80",
      description: "Cajas y maletines de herramientas de alta resistencia, estuches organizadores, gavetas apilables, enrollacables eléctricos de obra y proyectores LED.",
      pagesCount: 116,
      fileSize: "13.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["tayg", "cajas herramientas", "gavetas", "ordenacion", "enrollacables", "ferreteria", "almacen"]
    },
    {
      id: "arttros",
      name: "Arttros",
      edition: "Sistemas de Nivelación para Alicatado y Crucetas Profesionales 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/arttros.svg",
      logoMonogram: "ARTTROS",
      coverImage: "assets/img/categorias/nivelacion-ceramica.jpg",
      description: "Fabricante de sistemas de nivelación cerámica de alta precisión, calzos, cuñas reutilizables, crucetas, T y cuñas para colocadores profesionales.",
      pagesCount: 72,
      fileSize: "8.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["arttros", "nivelacion", "calzos", "cuñas", "crucetas", "alicatado", "almacen"]
    },
    {
      id: "viat",
      name: "Viat",
      edition: "Perfilería, Guardavivos y Complementos Técnicos de Construcción 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/viat.svg",
      logoMonogram: "VIAT",
      coverImage: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=800&q=80",
      description: "Guardavivos, cantoneras, junquillos, perfiles de remate y dilatación y accesorios auxiliares para albañilería, yeso y revestimientos.",
      pagesCount: 80,
      fileSize: "9.5 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["viat", "perfiles", "guardavivos", "cantoneras", "obra", "ferreteria", "almacen"]
    },
    {
      id: "bosch",
      name: "Bosch Professional",
      edition: "Herramienta Eléctrica Profesional, Martillos, Amoladoras y Medición Láser 2026",
      year: "2026",
      category: "Ferretería y Herramientas",
      sede: "Sede Almacén",
      featured: true,
      logoUrl: "assets/img/marcas/bosch.svg",
      logoMonogram: "BOSCH",
      coverImage: "assets/img/categorias/ferreteria-herramientas.jpg",
      description: "Herramientas eléctricas gama azul Bosch Professional (18V y cable), martillos perforadores SDS-plus/max, amoladoras, niveles láser, brocas y discos.",
      pagesCount: 210,
      fileSize: "22.6 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["bosch", "bosch professional", "herramienta electrica", "taladro", "amoladora", "radial", "laser", "almacen"]
    },
    {
      id: "simop",
      name: "Simop",
      edition: "Depósitos de Agua, Fosas Sépticas, Separadores y Tratamiento de Aguas 2026",
      year: "2026",
      category: "Fontanería, Riego y Piscinas",
      sede: "Sede Almacén",
      featured: false,
      logoUrl: "assets/img/marcas/simop.svg",
      logoMonogram: "SIMOP",
      coverImage: "assets/img/categorias/depositos-saneamiento.jpg",
      description: "Depósitos de polietileno para agua potable y pluviales, fosas sépticas con filtro biológico, depuradoras compactas de oxidación total y separadores de grasas.",
      pagesCount: 126,
      fileSize: "14.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["simop", "fosas septicas", "depositos agua", "depuradoras", "separador grasas", "saneamiento", "almacen"]
    }
  ],

  // 2B. MARCAS EXCLUSIVAS DE CHIMENEAS Y CALEFACCIÓN (chimeneas.html)
  // Únicamente las marcas comercializadas e instaladas por Millán Chiclana:
  // BRONPI, FM CALEFACCIÓN, HERGÓM, BOSCH MARÍN (Austroflamm, M-Design, Faber, Charlton & Jenrick) y EXOJO.
  fireplacesCatalogs: [
    {
      id: "bronpi-chimeneas",
      name: "Bronpi",
      edition: "Catálogo General de Chimeneas de Leña, Pellet, Insertables e Hidroestufas 2026",
      year: "2026",
      category: "Leña, Pellet e Insertables",
      sede: "Exposición y Montaje",
      featured: true,
      isMainBrand: true,
      logoUrl: "assets/img/marcas/bronpi.svg",
      logoMonogram: "BRONPI",
      coverImage: "assets/img/chimeneas/exposicion-estufas-lena-bronpi.jpg",
      description: "Estufas y chimeneas de leña, hogares panorámicos, casetes insertables con turbinas, estufas de pellet canalizables, bioetanol y eléctricas de alta eficiencia energética.",
      pagesCount: 212,
      fileSize: "23.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["bronpi", "chimeneas", "leña", "pellet", "bioetanol", "electrica", "insertables", "estufas", "calefaccion"]
    },
    {
      id: "fm-calefaccion",
      name: "FM Calefacción",
      edition: "Colección de Chimeneas de Leña, Pellet, Bioetanol y Eléctricas 2026",
      year: "2026",
      category: "Leña, Pellet e Insertables",
      sede: "Exposición y Montaje",
      featured: true,
      isMainBrand: true,
      logoUrl: "assets/img/marcas/fm-calefaccion.svg",
      logoMonogram: "FM CALEFACCIÓN",
      coverImage: "assets/img/chimeneas/exposicion-estufas-pellet-rincon.jpg",
      description: "Amplia gama de chimeneas de rincón y frontales, estufas de leña con horno superior, insertables ventilados, estufas de pellet, biochimeneas de bioetanol y eléctricas.",
      pagesCount: 164,
      fileSize: "18.1 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["fm", "fm calefaccion", "chimeneas", "leña", "horno leña", "insertables", "pellet", "bioetanol", "electrica", "estufas"]
    },
    {
      id: "hergom-chimeneas",
      name: "Hergóm",
      edition: "Hogares, Insertables y Estufas de Leña y Pellet en Hierro Fundido 2026",
      year: "2026",
      category: "Hierro Fundido y Hogares",
      sede: "Exposición y Montaje",
      featured: true,
      isMainBrand: true,
      logoUrl: "assets/img/marcas/hergom.svg",
      logoMonogram: "HERGÓM",
      coverImage: "assets/img/chimeneas/exposicion-estufa-nordica-patas-madera.jpg",
      description: "Referente en fundición propia: estufas de hierro fundido de gran durabilidad, hogares de combustión limpia Ecodesign en leña y pellet, compactos insertables y cocinas de leña.",
      pagesCount: 148,
      fileSize: "16.9 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["hergom", "hierro fundido", "chimeneas", "hogares", "compactos", "leña", "pellet", "ecodesign"]
    },
    {
      id: "bosch-marin",
      name: "Bosch Marín",
      edition: "Distribuidor Oficial de Chimeneas: Austroflamm, M-Design, Faber y Charlton & Jenrick",
      year: "2026",
      category: "Chimeneas Bosch Marín",
      sede: "Exposición y Montaje",
      featured: true,
      isMainBrand: true,
      subBrands: ["Austroflamm", "M-Design", "Faber", "Charlton & Jenrick"],
      logoUrl: "assets/img/marcas/bosch-marin.svg",
      logoMonogram: "BOSCH MARÍN",
      coverImage: "assets/img/chimeneas/exposicion-barbacoa-bonfeu-chimeneas.jpg",
      description: "Chimeneas arquitectónicas de diseño exclusivo distribuidas por Bosch Marín: Austroflamm, M-Design, Faber y Charlton & Jenrick (leña, pellet, bioetanol, gas y eléctricas).",
      pagesCount: 196,
      fileSize: "24.6 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["bosch marin", "austroflamm", "m-design", "faber", "charlton", "jenrick", "leña", "pellet", "bioetanol", "gas", "electrica"]
    },
    {
      id: "exojo-conductos",
      name: "Exojo",
      edition: "Conductos de Evacuación de Humos, Tubería Vitrificada e Inoxidable Doble Pared",
      year: "2026",
      category: "Conductos y Tubería",
      sede: "Exposición y Montaje",
      featured: true,
      isMainBrand: true,
      logoUrl: "assets/img/marcas/exojo.svg",
      logoMonogram: "EXOJO",
      coverImage: "assets/img/chimeneas/exposicion-chimenea-metalica-campana.jpg",
      description: "Sistemas certificados de evacuación de humos para instalaciones seguras: tubería acero inoxidable aislada doble pared, tubo vitrificado negro mate para leña, pellet y gas, codos y sombreretes.",
      pagesCount: 118,
      fileSize: "13.5 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["exojo", "tubos chimenea", "conductos humos", "doble pared", "inoxidable", "vitrificado", "sombreretes", "leña", "pellet", "gas"]
    },
    {
      id: "austroflamm-bosch-marin",
      name: "Austroflamm (Bosch Marín)",
      edition: "Estufas y Hogares de Leña y Pellet con Acumulación Térmica Keramott",
      year: "2026",
      category: "Chimeneas Bosch Marín",
      sede: "Distribuido por Bosch Marín",
      featured: false,
      isMainBrand: false,
      distributor: "Bosch Marín",
      logoUrl: "assets/img/marcas/austroflamm.svg",
      logoMonogram: "AUSTROFLAMM",
      coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      description: "Marca distribuida por Bosch Marín. Estufas y hogares de leña y pellet con interior blanco Keramott de autolimpieza pirolítica y acumuladores de calor Heat Memory System.",
      pagesCount: 132,
      fileSize: "17.2 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["austroflamm", "bosch marin", "keramott", "acumulacion termica", "diseño", "leña", "pellet"]
    },
    {
      id: "m-design-bosch-marin",
      name: "M-Design (Bosch Marín)",
      edition: "Hogares Panorámicos Minimalistas en Leña y Gas (Series Luna & Diamond)",
      year: "2026",
      category: "Chimeneas Bosch Marín",
      sede: "Distribuido por Bosch Marín",
      featured: false,
      isMainBrand: false,
      distributor: "Bosch Marín",
      logoUrl: "assets/img/marcas/m-design.svg",
      logoMonogram: "M-DESIGN",
      coverImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      description: "Marca belga de alta gama distribuida por Bosch Marín. Chimeneas encastrables de leña y gas de visión total sin marco con puerta guillotina motorizada, de 1, 2 y 3 caras.",
      pagesCount: 144,
      fileSize: "19.0 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["m-design", "mdesign", "bosch marin", "luna", "diamond", "guillotina", "panoramica", "leña", "gas"]
    },
    {
      id: "faber-bosch-marin",
      name: "Faber (Bosch Marín)",
      edition: "Chimeneas de Gas, Eléctricas y Fuego de Vapor de Agua e-MatriX / Opti-myst",
      year: "2026",
      category: "Chimeneas Bosch Marín",
      sede: "Distribuido por Bosch Marín",
      featured: false,
      isMainBrand: false,
      distributor: "Bosch Marín",
      logoUrl: "assets/img/marcas/faber.svg",
      logoMonogram: "FABER",
      coverImage: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=900&q=80",
      description: "Firma neerlandesa distribuida por Bosch Marín. Chimeneas eléctricas y de vapor de agua e-MatriX sin salida de humos, bioetanol y chimeneas de gas con control por App.",
      pagesCount: 120,
      fileSize: "15.6 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["faber", "bosch marin", "e-matrix", "opti-myst", "gas", "electrica", "bioetanol", "vapor de agua"]
    },
    {
      id: "charlton-jenrick-bosch-marin",
      name: "Charlton & Jenrick (Bosch Marín)",
      edition: "Chimeneas Eléctricas Panorámicas iRange, Gas y Leña de Diseño Británico",
      year: "2026",
      category: "Chimeneas Bosch Marín",
      sede: "Distribuido por Bosch Marín",
      featured: false,
      isMainBrand: false,
      distributor: "Bosch Marín",
      logoUrl: "assets/img/marcas/charlton-jenrick.svg",
      logoMonogram: "CHARLTON & JENRICK",
      coverImage: "assets/img/chimeneas/exposicion-chimenea-electrica-panoramica.jpg",
      description: "Prestigiosa firma británica distribuida por Bosch Marín. Especialistas en chimeneas eléctricas encastrables de gran formato para paredes Media Wall, además de gamas de gas y leña.",
      pagesCount: 110,
      fileSize: "14.4 MB",
      pdfUrl: "catalogos/catalogo-demo-millan.pdf",
      keywords: ["charlton", "jenrick", "charlton & jenrick", "bosch marin", "electrica", "gas", "leña", "media wall"]
    }
  ],

  // 3. RESEÑAS REALES DE GOOGLE MAPS (Sincronizadas automáticamente de ambas fichas)
  googleReviews: [
    {
      id: "Ci9DQUlRQUNvZENodHljRjlvT2pCMmJVbExjMmQ1VVROdU9ITldkelpsY1c0NWJXYxAB",
      author: "jose lopez",
      initials: "JL",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocIpMavjdxCjtOTJ7kX8h_1i5F-6-BeQPY3V-e-ljZI6CkJogg=s120-c-rp-mo-ba12-br100",
      authorUrl: "https://www.google.com/maps/contrib/107677644107599135127/reviews?hl=es",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 7 meses",
      timestampMs: 1771659387307,
      role: "Local Guide · 156 reseñas · Google Maps",
      text: "Quiero pedir perdón por que por equivocación puse una reseña aquí. Ya la he borrado y tengo que decir que las veces que he comprado en Millan ha sido una experiencia grata tanto el trato como la asesoría como el precio. Gracias por todo y por como sois. TOTALMENTE RECOMENDABLE",
      hasText: true
    },
    {
      id: "Ci9DQUlRQUNvZENodHljRjlvT21wc1luRXhSQzFhYVdSQ1dtWmxWa2QyZDBVNGVtYxAB",
      author: "José Antonio Sánchez",
      initials: "JA",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXwFrmKsmAUzNqfZLWZUmS4ACfTIZ7ySPZDxdfWtnyqqZaqR7bCgQ=s120-c-rp-mo-ba12-br100",
      authorUrl: "https://www.google.com/maps/contrib/102312248817353497069/reviews?hl=es",
      sede: "Sede Almacén",
      rating: 5,
      date: "Hace 2 semanas",
      timestampMs: 1791209865963,
      role: "Local Guide · 52 reseñas · Google Maps",
      text: "Valoración verificada de 5 estrellas en Google Maps (Sede Almacén).",
      hasText: false
    },
    {
      id: "Ci9DQUlRQUNvZENodHljRjlvT2tjNWJGaEZWbEZxY3pCZmVHRlpaRGRGVEdGWk1IYxAB",
      author: "Maribel H.",
      initials: "MH",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocI_5r1M-zsSTizNyPu6BfpuUehDVPeBYO-OmGd7Gpk9Ym7LzQ=s120-c-rp-mo-ba12-br100",
      authorUrl: "https://www.google.com/maps/contrib/110643088361668623731/reviews?hl=es",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 8 meses",
      timestampMs: 1771143020275,
      role: "Local Guide · 75 reseñas · Google Maps",
      text: "Muy buena atención y tiene muy buenos productos y a buen precio",
      hasText: true
    },
    {
      id: "Ci9DQUlRQUNvZENodHljRjlvT25GVExXTkhkRmxUZVZaS2VHcEhPVXRRZDJGNWRYYxAB",
      author: "Adrian Ariza Serrano",
      initials: "AA",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocJTRsQTQj_mUku96AnwLC6BM5zRu-lI0PQLXbcuLv645IuuZA=s120-c-rp-mo-ba12-br100",
      authorUrl: "https://www.google.com/maps/contrib/105322559778761403545/reviews?hl=es",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 8 meses",
      timestampMs: 1770985817377,
      role: "Local Guide · 43 reseñas · Google Maps",
      text: "100 × 100 recomendable muchas gracias",
      hasText: true
    },
    {
      id: "ChZDSUhNMG9nS0VJQ0FnSUNybVBiMmFREAE",
      author: "Carolina Morales Muñoz",
      initials: "CM",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocLj3AjTr95uuU4X1kG3Zr_P95dWWhdd9GzHOyQ-IwlAthbKqw=s120-c-rp-mo-br100",
      authorUrl: "https://www.google.com/maps/contrib/100155446453982290696/reviews?hl=es",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 2 años",
      timestampMs: 1720039373270,
      role: "6 reseñas · Google Maps",
      text: "Trato espectacular. Buenos precios y tienen mucha variedad. Trato postventa espectacular. Muy agradecida por su atención y especial agradecimiento a Montse que fue quien nos atendió. Mil gracias!!!!",
      hasText: true
    },
    {
      id: "ChdDSUhNMG9nS0VJQ0FnSUQ2MTd1ODZBRRAB",
      author: "Farmacia Carbajal",
      initials: "FC",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocJ5hEYFVXH_X5o1hUuE_3x9I6rVCv7sYf1x-aw5yBEzyacS1Q=s120-c-rp-mo-br100",
      authorUrl: "https://www.google.com/maps/contrib/102122372846884304607/reviews?hl=es",
      sede: "Sede Exposición",
      rating: 5,
      date: "Hace 5 años",
      timestampMs: 1634197108530,
      role: "4 reseñas · Google Maps",
      text: "¨Trato excelente y profesionalidad¨ Instalamos dos chimeneas la semana pasada y todo salió a la perfección.",
      hasText: true
    },
    {
      id: "Ci9DQUlRQUNvZENodHljRjlvT2xjeU5sSmxNVXhoT1ZKd01WRjJSMHMwZFVwT2NHYxAB",
      author: "Adrian Eusebio",
      initials: "AE",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV-4WsLkBmp6TcgU8Xh4s920wTrjyhb-NRpvGv2cdveGlbgRWMP=s120-c-rp-mo-ba12-br100",
      authorUrl: "https://www.google.com/maps/contrib/101270509121498819905/reviews?hl=es",
      sede: "Sede Exposición",
      rating: 4,
      date: "Hace 6 meses",
      timestampMs: 1776776132862,
      role: "Local Guide · 303 reseñas · Google Maps",
      text: "Valoración verificada de 4 estrellas en Google Maps (Sede Exposición).",
      hasText: false
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
    },
    {
      id: "faq-7",
      category: "Financiación",
      question: "¿Puedo financiar mis compras y qué documentación necesito?",
      answer: "Sí, ofrecemos financiación de tus compras con CaixaBank y puedes tramitarla directamente en cualquiera de nuestras instalaciones. Si eres cliente de CaixaBank, solo necesitas tu DNI / NIE y tu tarjeta de CaixaBank. Si no eres cliente de La Caixa, no es necesario cambiar de banco y lo tramitamos con documentación mínima."
    }
  ]
};

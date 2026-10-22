/**
 * ============================================================================
 * MILLÁN CHICLANA - Sincronizador Automático de Reseñas de Google Maps
 * (scripts/sync-google-reviews.js)
 * ============================================================================
 * Extrae en tiempo real la puntuación media, el número total de reseñas y las
 * reseñas reales de ambas fichas de Google Maps:
 *   1. Sede Exposición (Millan - Exposición): 0xd0c345cf1217835:0x12e0440890f2c5d1
 *   2. Sede Almacén (Millán - Almacén):       0xd0c35b851710269:0xdd46cf4ed31bdd1f
 *
 * Guarda el resultado en `assets/js/google-reviews.json` para su consumo
 * automático en la web.
 */

const fs = require("fs");
const path = require("path");

const SEDES_CONFIG = [
  {
    key: "exposicion",
    sedeLabel: "Sede Exposición",
    placeId: "ChIJNXgh8Vw0DA0R0cXykAhE4BI",
    fid: "0xd0c345cf1217835:0x12e0440890f2c5d1",
    queryName: "Millan",
    mapsShortUrl: "https://maps.app.goo.gl/hja5eodfEP7cb46U8",
    writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJNXgh8Vw0DA0R0cXykAhE4BI",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJNXgh8Vw0DA0R0cXykAhE4BI"
  },
  {
    key: "almacen",
    sedeLabel: "Sede Almacén",
    placeId: "ChIJaQJxUbg1DA0RH90b007PRt0",
    fid: "0xd0c35b851710269:0xdd46cf4ed31bdd1f",
    queryName: "Millán - Almacén",
    mapsShortUrl: "https://maps.app.goo.gl/zsD1AbVrbpVkRBYB8",
    writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJaQJxUbg1DA0RH90b007PRt0",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJaQJxUbg1DA0RH90b007PRt0"
  }
];

function buildPreviewUrl(fid, queryName, sortCode = 3) {
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
}

function getInitials(name) {
  if (!name) return "MC";
  const parts = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "MC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

async function fetchPlaceData(sedeConfig, sortCode) {
  const url = buildPreviewUrl(sedeConfig.fid, sedeConfig.queryName, sortCode);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      "Accept-Language": "es-ES,es;q=0.9"
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} al consultar ${sedeConfig.key}`);
  }
  const text = await res.text();
  const jsonStr = text.replace(/^\)\]\}'\n/, "");
  const parsed = JSON.parse(jsonStr);
  return parsed[6];
}

async function syncAll() {
  const summary = {
    updatedAt: new Date().toISOString(),
    sedes: {},
    reviews: []
  };

  const seenIds = new Set();

  for (const sede of SEDES_CONFIG) {
    // Consultar orden 3 (mejor valoradas) y orden 2 (más recientes)
    const placeBest = await fetchPlaceData(sede, 3);
    const placeRecent = await fetchPlaceData(sede, 2);

    const rawRating = placeBest?.[4]?.[7] ?? 5;
    const rawCount = placeBest?.[4]?.[8] ?? 1;

    summary.sedes[sede.key] = {
      id: sede.sedeLabel,
      placeId: sede.placeId,
      fid: sede.fid,
      rating: Number(rawRating).toFixed(1),
      totalReviews: Number(rawCount),
      googleMapsDirectionsUrl: sede.mapsShortUrl,
      googleReviewUrl: sede.mapsShortUrl,
      writeReviewUrl: sede.writeReviewUrl
    };

    const blocks = [
      ...(placeBest?.[175]?.[9]?.[0]?.[0] || []),
      ...(placeRecent?.[175]?.[9]?.[0]?.[0] || [])
    ];

    for (const entry of blocks) {
      const r = entry?.[0];
      if (!r) continue;
      const revId = r[0];
      if (!revId || seenIds.has(revId)) continue;

      const rating = r?.[2]?.[0]?.[0] || 5;
      // Mostrar reseñas positivas (4★ y 5★)
      if (rating < 4) continue;

      seenIds.add(revId);
      const author = r?.[1]?.[4]?.[5]?.[0] || "Cliente de Google";
      const avatar = r?.[1]?.[4]?.[5]?.[1] || "";
      const authorUrl = r?.[1]?.[4]?.[2]?.[0] || sede.mapsShortUrl;
      const badgeRaw = (r?.[1]?.[4]?.[5]?.[10]?.[0] || "Cliente verificado en Google").replace(/\u00a0/g, " ");
      const relTimeRaw = (r?.[1]?.[6] || "Reciente").replace(/^Fecha de edición:\s*/i, "");
      const timestampMicros = r?.[1]?.[2] || Date.now() * 1000;
      const timestampMs = Math.round(Number(timestampMicros) / 1000);
      const rawText = r?.[2]?.[15]?.[0]?.[0];

      const cleanText = rawText
        ? rawText.replace(/\s+/g, " ").trim()
        : `Valoración verificada de ${rating} estrellas en Google Maps (${sede.sedeLabel}).`;

      summary.reviews.push({
        id: revId,
        author,
        initials: getInitials(author),
        avatar,
        authorUrl,
        sede: sede.sedeLabel,
        rating,
        date: relTimeRaw,
        timestampMs,
        role: `${badgeRaw} · Google Maps`,
        text: cleanText,
        hasText: Boolean(rawText)
      });
    }
  }

  // Ordenar priorizando 5★ sobre 4★ y asegurando presencia de ambas sedes en portada
  summary.reviews.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    if (a.hasText !== b.hasText) return a.hasText ? -1 : 1;
    return b.timestampMs - a.timestampMs;
  });

  // Asegurar que al menos una reseña de Sede Almacén aparezca en segunda posición en la vista general
  const firstAlmacenIdx = summary.reviews.findIndex((r) => r.sede === "Sede Almacén");
  if (firstAlmacenIdx > 1) {
    const [almRev] = summary.reviews.splice(firstAlmacenIdx, 1);
    summary.reviews.splice(1, 0, almRev);
  }

  const outPath = path.join(__dirname, "..", "assets", "js", "google-reviews.json");
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), "utf8");
  console.log("Sincronización completada con éxito:", {
    updatedAt: summary.updatedAt,
    exposicion: summary.sedes.exposicion,
    almacen: summary.sedes.almacen,
    totalReviewsExtracted: summary.reviews.length
  });
}

syncAll().catch((err) => {
  console.error("Error sincronizando reseñas:", err);
  process.exit(1);
});

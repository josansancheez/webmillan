/**
 * Actualiza automáticamente el parámetro de versión (?v=...) de CSS y JS
 * e inyecta cabeceras <meta> anti-caché en todas las páginas HTML del proyecto
 * para que cualquier cambio se refleje al instante en navegadores de visitantes recurrentes.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const demoCatalogFile = path.join(rootDir, 'catalogos', 'catalogo-demo-millan.pdf');
if (fs.existsSync(demoCatalogFile)) {
  try {
    fs.unlinkSync(demoCatalogFile);
  } catch (_) {}
}
const version = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

// Sincronizar favicon en raíz (/favicon.png y /favicon.ico) para navegadores y Google Search
const faviconSrc = path.join(rootDir, 'assets', 'img', 'favicon.png');
if (fs.existsSync(faviconSrc)) {
  const buf = fs.readFileSync(faviconSrc);
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
  const width = isPng ? buf.readUInt32BE(16) : 0;
  const height = isPng ? buf.readUInt32BE(20) : 0;
  console.log(`Favicon source: isPng=${isPng}, isJpg=${isJpg}, size=${buf.length}B, dims=${width}x${height}`);

  // Copiar a /favicon.png en la raíz
  fs.writeFileSync(path.join(rootDir, 'favicon.png'), buf);

  // Generar /favicon.ico válido en la raíz y en assets/img/favicon.ico si es PNG
  if (isPng) {
    const icoHeader = Buffer.alloc(22);
    icoHeader.writeUInt16LE(0, 0); // Reserved
    icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
    icoHeader.writeUInt16LE(1, 4); // 1 image
    icoHeader.writeUInt8(width >= 256 ? 0 : width, 6);
    icoHeader.writeUInt8(height >= 256 ? 0 : height, 7);
    icoHeader.writeUInt8(0, 8); // Palette
    icoHeader.writeUInt8(0, 9); // Reserved
    icoHeader.writeUInt16LE(1, 10); // Color planes
    icoHeader.writeUInt16LE(32, 12); // Bits per pixel
    icoHeader.writeUInt32LE(buf.length, 14); // Image byte size
    icoHeader.writeUInt32LE(22, 18); // Offset (6 + 16)
    const icoBuf = Buffer.concat([icoHeader, buf]);
    fs.writeFileSync(path.join(rootDir, 'favicon.ico'), icoBuf);
    fs.writeFileSync(path.join(rootDir, 'assets', 'img', 'favicon.ico'), icoBuf);
  }
}

const htmlFiles = fs.readdirSync(rootDir).filter((f) => f.endsWith('.html'));

for (const file of htmlFiles) {
  const fullPath = path.join(rootDir, file);
  let html = fs.readFileSync(fullPath, 'utf8');

  // 1. Asegurar meta tags de control de caché en el <head>
  if (!html.includes('http-equiv="Cache-Control"')) {
    html = html.replace(
      /(<meta\s+name="viewport"[^>]*>\r?\n)/i,
      '$1  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n  <meta http-equiv="Pragma" content="no-cache" />\n  <meta http-equiv="Expires" content="0" />\n'
    );
  }

  // 1b. Asegurar etiqueta de verificación de Google Search Console en todas las páginas
  if (!html.includes('name="google-site-verification"')) {
    html = html.replace(
      /(<meta\s+name="robots"[^>]*>\r?\n)/i,
      '$1  <meta name="google-site-verification" content="up6_0oLfwvQNJWsLQT4vfPjAtW0gvHixhDYx3h9A61A" />\n'
    );
  }

  // 2. Actualizar ?v=... en assets/css/styles.css, assets/js/data.js, assets/js/main.js y favicons
  html = html.replace(
    /href="assets\/css\/styles\.css(?:\?v=[^"]*)?"/g,
    `href="assets/css/styles.css?v=${version}"`
  );
  html = html.replace(
    /src="assets\/js\/data\.js(?:\?v=[^"]*)?"/g,
    `src="assets/js/data.js?v=${version}"`
  );
  html = html.replace(
    /src="assets\/js\/main\.js(?:\?v=[^"]*)?"/g,
    `src="assets/js/main.js?v=${version}"`
  );

  // Asegurar enlaces completos de favicon (ICO + PNG + Apple Touch Icon) con anti-caché ?v=...
  html = html.replace(
    /(?:[ \t]*<link\s+rel="(?:shortcut )?icon"[^>]*>\r?\n)+[ \t]*<link\s+rel="apple-touch-icon"[^>]*>/g,
    `  <link rel="icon" type="image/x-icon" href="favicon.ico?v=${version}" />\n  <link rel="icon" type="image/png" sizes="192x192" href="assets/img/favicon.png?v=${version}" />\n  <link rel="shortcut icon" href="favicon.ico?v=${version}" />\n  <link rel="apple-touch-icon" href="assets/img/favicon.png?v=${version}" />`
  );

  fs.writeFileSync(fullPath, html, 'utf8');
}

// 3. Mantener sitemap.xml con fecha <lastmod> actualizada al día actual
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8').replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${todayIso}</lastmod>`
  );
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
}

console.log(`Cache version bumped to ${version} across ${htmlFiles.length} HTML files.`);

/**
 * Actualiza automáticamente el parámetro de versión (?v=...) de CSS y JS
 * e inyecta cabeceras <meta> anti-caché en todas las páginas HTML del proyecto
 * para que cualquier cambio se refleje al instante en navegadores de visitantes recurrentes.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const version = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

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

  // 2. Actualizar ?v=... en assets/css/styles.css, assets/js/data.js y assets/js/main.js
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

  fs.writeFileSync(fullPath, html, 'utf8');
}

console.log(`Cache version bumped to ${version} across ${htmlFiles.length} HTML files.`);

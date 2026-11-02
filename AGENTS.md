# Reglas del Proyecto - Millán Chiclana (WEB Millan)

## 1. Autonomía Total (No Preguntar al Usuario)
- **Regla permanente:** No preguntes nada al usuario ni pidas confirmaciones o aclaraciones. Toma siempre la mejor decisión técnica y de diseño por tu cuenta y **ejecuta todos los cambios directamente**.

## 2. Prohibido Preguntar o Ejecutar Comandos de GitHub / Git que Pidan Confirmación
- **Regla permanente:** **NUNCA** ejecutes comandos relacionados con GitHub / `GitHubDesktop` / `git` ni uses `BypassSandbox: true` para Git, ya que eso genera ventanas de confirmación al usuario preguntándole permisos de GitHub. No menciones ni preguntes nada relacionado con GitHub.

## 3. Cache-Busting Automático en Sandbox
- **Regla permanente:** Siempre que realices cualquier cambio en archivos del proyecto, actualiza la versión anti-caché ejecutando únicamente `node scripts/bump-cache-version.js` con `BypassSandbox: false` (en segundo plano sin pedir confirmación).

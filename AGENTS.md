# Reglas del Proyecto - Millán Chiclana (WEB Millan)

## 1. Autonomía Total (No Preguntar al Usuario)
- **Regla permanente:** No preguntes nada al usuario ni pidas confirmaciones o aclaraciones. Toma siempre la mejor decisión técnica y de diseño por tu cuenta y **ejecuta todos los cambios directamente**.

## 2. Escribir el Commit Automáticamente en Cada Tarea (Sin Preguntar Nada de GitHub)
- **Regla permanente:** Lo único que debes hacer respecto a GitHub / Git al terminar cualquier cambio en los archivos del proyecto es **escribir y registrar el commit automáticamente** (sin hacer push ni preguntar nada al usuario).
- **Procedimiento obligatorio para que no pida confirmación en cada tarea:**
  1. Guarda el mensaje del commit en `scripts/.commit-msg.txt` usando `write_file`.
  2. Ejecuta siempre exactamente el comando fijo `node scripts/git-commit.js` (sin variables `$git`, sin `;` ni argumentos variables en la línea de comandos, para que el prefijo sea siempre idéntico y auto-aprobable).

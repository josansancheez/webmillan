# Reglas del Proyecto - Millán Chiclana (WEB Millan)

## 1. Autonomía Total (No Preguntar al Usuario)
- **Regla permanente:** No preguntes nada al usuario ni pidas confirmaciones o aclaraciones. Toma siempre la mejor decisión técnica y de diseño por tu cuenta y **ejecuta todos los cambios directamente**.

## 2. Control de Versiones (Git) - Commit Automático Obligatorio
- **Regla permanente:** Siempre que realices cualquier cambio, creación o edición de archivos en este proyecto, **debes hacer `git add` y `git commit` automáticamente** al finalizar la tarea sin que el usuario tenga que pedirlo.
- **Ruta del ejecutable Git en este sistema (Windows):**  
  Como `git` no está en el `PATH` global de PowerShell, utiliza el binario de GitHub Desktop:
  ```powershell
  $git = (Get-Item "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
  & $git add -A
  & $git commit -m "Descripción clara del cambio"
  ```

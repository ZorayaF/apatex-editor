#!/bin/bash

# ✅ Configurado para ejecutarse directamente dentro de la carpeta 'config'
TARGET_DIRS=("forms" "preview")

for TARGET in "${TARGET_DIRS[@]}"; do
  if [ ! -d "$TARGET" ]; then
    echo "⚠️ La carpeta local '$TARGET' no existe. Saltando..."
    continue
  fi

  echo "🚀 Procesando carpeta: $TARGET"

  # Creamos o sobreescribimos el archivo index.js principal de la carpeta
  BARREL_FILE="$TARGET/index.js"
  echo "// Exportador centralizado automático" >"$BARREL_FILE"

  # Iteración segura sobre los archivos .jsx de forma directa
  for filepath in "$TARGET"/*.jsx; do
    # Evitar errores si no se encuentran archivos .jsx
    [ -e "$filepath" ] || continue

    filename=$(basename -- "$filepath")
    component_name="${filename%.*}"

    # Saltamos archivos de control o el enrutador estructural si no queremos moverlo
    if [ "$component_name" == "index" ] || [ "$component_name" == "StructurePreview" ]; then
      continue
    fi

    echo "  📦 Modularizando componente: $component_name"

    # 1. Crear la subcarpeta del componente atómico
    COMP_DIR="$TARGET/$component_name"
    mkdir -p "$COMP_DIR"

    # 2. Mover el archivo JSX original a su nuevo contenedor
    mv "$filepath" "$COMP_DIR/$filename"

    # 3. Crear el archivo CSS Module vacío para tus estilos
    touch "$COMP_DIR/$component_name.module.css"

    # 4. Crear el index.js puente dentro de la carpeta del componente
    echo "export { $component_name } from './$component_name';" >"$COMP_DIR/index.js"

    # 5. Registrar la exportación en el index.js global de la carpeta
    echo "export { $component_name } from './$component_name';" >>"$BARREL_FILE"
  done

  echo "✅ Carpeta '$TARGET' completada con su respectivo index.js."
  echo "--------------------------------------------------------"
done

echo "🎉 ¡Refactorización dinámica en Ubuntu terminada con éxito!"

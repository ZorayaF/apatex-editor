#!/bin/bash

# ✅ Configurado para ejecutarse dentro de la carpeta 'writer'
TARGET_DIRS=("blocks/complex" "blocks/text" "canvas" "header" "inspector/forms/figure" "inspector/forms/reference" "inspector/forms/table" "navbar")

for TARGET in "${TARGET_DIRS[@]}"; do
  if [ ! -d "$TARGET" ]; then
    echo "⚠️ La subcarpeta '$TARGET' no existe. Saltando..."
    continue
  fi

  echo "🚀 Procesando módulo en writer: $TARGET"

  # Creamos o reseteamos el index.js barrel de esa carpeta específica
  BARREL_FILE="$TARGET/index.js"
  echo "// Exportador centralizado de $TARGET" >"$BARREL_FILE"

  # Iteración segura sobre archivos .jsx y .js de forma directa
  for filepath in "$TARGET"/*.jsx "$TARGET"/*.js; do
    [ -e "$filepath" ] || continue

    filename=$(basename -- "$filepath")
    component_name="${filename%.*}"

    # Evitamos ciclar los archivos index existentes o ficheros de registro globales
    if [ "$component_name" == "index" ] || [ "$component_name" == "BlockRegistry" ]; then
      # Si es BlockRegistry.js, simplemente lo exportamos en el barrel sin moverlo de su raíz core
      if [ "$component_name" == "BlockRegistry" ]; then
        echo "export { BlockRegistry } from './BlockRegistry';" >>"$BARREL_FILE"
      fi
      continue
    fi

    echo "  📦 Encapsulando: $component_name"

    # 1. Crear la subcarpeta atómica del componente
    COMP_DIR="$TARGET/$component_name"
    mkdir -p "$COMP_DIR"

    # 2. Mover el archivo original
    mv "$filepath" "$COMP_DIR/$filename"

    # 3. Crear el archivo CSS Module para limpiar el JSX de estilos inline
    touch "$COMP_DIR/$component_name.module.css"

    # 4. Crear el index.js puente del componente
    echo "export { $component_name } from './$component_name';" >"$COMP_DIR/index.js"

    # 5. Registrar la exportación en el index general del módulo
    echo "export { $component_name } from './$component_name';" >>"$BARREL_FILE"
  done

  echo "✅ Módulo '$TARGET' completado e indexado."
  echo "--------------------------------------------------------"
done

echo "🎉 ¡Refactorización de la arquitectura 'writer' terminada en Ubuntu!"

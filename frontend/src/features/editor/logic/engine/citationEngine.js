// src/features/editor/logic/engine/citationEngine.js

/**
 * Transforma marcadores ((ref:id)) en HTML formateado para el editor.
 */
export const parseCitations = (text, sources) => {
  if (!text) return "";

  // Expresión regular: busca el patrón ((ref:CUALQUIER_ID))
  const regex = /\(\(ref:([\w-]+)\)\)/g;

  return text.replace(regex, (match, sourceId) => {
    // Buscamos la fuente en nuestro array de referencias
    const source = sources.find((s) => s.id === sourceId);

    // Si no existe la fuente (ej: fue eliminada), mostramos un aviso
    if (!source) {
      return `<span class="apa-citation-error" style="color: red; border-bottom: 1px dotted red;">(Fuente no encontrada)</span>`;
    }

    // Formato APA básico: (Autor, Año)
    const author = source.author || "Anónimo";
    const year = source.year || "s.f.";
    const citationText = `${author}, ${year}`;

    // IMPORTANTE: contenteditable="false" hace que la cita sea un "bloque sólido"
    // El usuario no podrá borrar una letra dentro de la cita, borrará la cita completa.
    return `<span 
      class="apa-citation" 
      data-ref-id="${sourceId}" 
      contenteditable="false" 
      style="
        display: inline;
        background-color: #f1f3f5;
        color: #1971c2;
        padding: 0 6px;
        border-radius: 4px;
        font-weight: 500;
        user-select: none;
        margin: 0 2px;
      "
    >(${citationText})</span>`;
  });
};

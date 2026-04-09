/**
 * Formatea los nombres de los autores según las reglas de APA 7ma Edición.
 */
const formatAuthorsAPA = (authorField) => {
  if (!authorField) return "Anónimo";

  // Suponemos autores separados por comas en el formulario
  const authors = authorField.split(",").map((a) => a.trim());

  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} y ${authors[1]}`;

  // Regla de oro APA 7: 3 o más autores siempre es el primero + et al.
  return `${authors[0]} et al.`;
};

/**
 * Transforma marcadores complejos ((ref:id|type:type|page:page))
 * en HTML interactivo para el editor.
 */
export const parseCitations = (text, sources) => {
  if (!text) return "";

  // Esta Regex busca el nuevo formato con 3 partes: ID, Tipo y Página
  const regex = /\(\(ref:([\w-]+)\|type:(\w+)\|page:(.*?)\)\)/g;

  return text.replace(regex, (match, sourceId, type, page) => {
    // Buscamos la fuente en nuestro array de referencias
    const source = sources.find((s) => s.id === sourceId);

    // Si no existe la fuente (ej: fue eliminada)
    if (!source) {
      return `<span class="apa-citation-error" style="color: red; border-bottom: 1px dotted red;">(Fuente no encontrada)</span>`;
    }

    const authors = formatAuthorsAPA(source.author);
    const year = source.year || "s.f.";
    const pageSuffix = page ? `, p. ${page}` : "";

    // Construimos el texto según el caso (Narrativa vs Parentética)
    let visualText = "";
    if (type === "narrative") {
      // Casos 1 y 2: Autor (Año, p. 10)
      visualText = `${authors} (${year}${pageSuffix})`;
    } else {
      // Casos 3 al 8: (Autor, Año, p. 10)
      visualText = `(${authors}, ${year}${pageSuffix})`;
    }

    // Retornamos el HTML con atributos data para que useBlockHandlers pueda reconstruir el marcador
    return `<span 
      class="apa-citation" 
      data-ref-id="${sourceId}" 
      data-type="${type}" 
      data-page="${page}" 
      contenteditable="false" 
      style="
        display: inline;
        background-color: #e7f5ff;
        color: #1971c2;
        padding: 0 4px;
        border-radius: 4px;
        font-weight: 500;
        user-select: none;
      "
    >${visualText}</span>`;
  });
};

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
export const parseCitations = (content, sources) => {
  if (!content) return "";

  // LA MAGIA: Nueva Expresión Regular que captura ID, Tipo y Página
  const regex = /\(\(ref:([\w-]+)\|type:(\w+)\|page:(.*?)\)\)/g;

  return content.replace(regex, (match, id, type, page) => {
    // Buscamos la fuente en la base de datos de Zustand
    const source = sources?.find((s) => s.id === id);

    // Si por alguna razón la fuente fue borrada, mostramos una alerta visual
    if (!source) {
      return `<span class="citationBadge" contenteditable="false" style="color: red;">[Fuente no encontrada]</span>`;
    }

    // Extraemos los datos base
    const authorStr = source.author || "Anónimo";
    const year = source.year || "s.f.";
    const pageText = page ? `, p. ${page}` : "";

    // Lógica APA básica para "Et al." (Si detecta comas o 'y', asume múltiples autores)
    const firstAuthor = authorStr.split(/,| y | & /)[0].trim();
    const isMultiple =
      authorStr.includes(",") ||
      authorStr.includes(" y ") ||
      authorStr.includes(" & ");
    const displayAuthor = isMultiple ? `${firstAuthor} et al.` : firstAuthor;

    // Armamos el texto visual según el tipo de cita
    let label = "";
    if (type === "narrative") {
      label = `${displayAuthor} (${year}${pageText})`;
    } else {
      label = `(${displayAuthor}, ${year}${pageText})`;
    }

    // Retornamos la pastilla en formato HTML para que useBlockSync la inyecte.
    // IMPORTANTE: contenteditable="false" evita que el usuario rompa el bloque al borrar
    return `<span class="citationBadge" contenteditable="false" data-ref-id="${id}" style="user-select: all;">${label}</span>`;
  });
};

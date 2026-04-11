/**
 * Formatea autores para la bibliografía (Regla de hasta 20 y +20).
 */
const formatAuthors = (authorStr) => {
  if (!authorStr) return "Anónimo";
  const authors = authorStr.split(",").map((a) => a.trim());

  if (authors.length === 1) return authors[0];
  if (authors.length <= 20) {
    const last = authors.pop();
    return `${authors.join(", ")}, & ${last}`;
  }
  // Caso +20 autores
  return `${authors.slice(0, 19).join(", ")}, ... ${authors[authors.length - 1]}`;
};

/**
 * Diccionario de plantillas por tipo de obra.
 */
const TEMPLATES = {
  libro: (s) => {
    const pub = s.metadata?.publisher ? `. ${s.metadata.publisher}` : "";
    return `${formatAuthors(s.author)} (${s.year}). <i>${s.title}</i>${pub}.`;
  },
  articulo: (s) => {
    const m = s.metadata || {};
    const journal = m.journal ? `<i>${m.journal}</i>` : "";
    const vol = m.volume ? `, <i>${m.volume}</i>` : "";
    const num = m.number ? `(${m.number})` : "";
    const pag = m.pages ? `, ${m.pages}` : "";
    const url = s.url ? `. ${s.url}` : "";
    return `${formatAuthors(s.author)} (${s.year}). ${s.title}. ${journal}${vol}${num}${pag}.${url}`;
  },
  sentencia: (s) => {
    const m = s.metadata || {};
    return `${s.author}. (${s.year}). <i>${m.number || "S.N."}. Magistrado Ponente ${m.judge || "N.N."}</i>. ${s.url || ""}`;
  },
};

export const renderSourceAPA = (source) => {
  const renderer = TEMPLATES[source.type] || TEMPLATES.libro;
  return renderer(source);
};

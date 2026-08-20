// features/editor/logic/engine/bibliographyRenderer.js

/**
 * Formatea autores para la bibliografía bajo normas APA 7ma Edición.
 * Maneja autor único, 2 a 20 autores (con &) y más de 20 autores (...).
 */
const formatAuthors = (authorStr) => {
  if (!authorStr || !authorStr.trim()) return "Anónimo";
  const authors = authorStr
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  if (authors.length === 1) return authors[0];
  if (authors.length <= 20) {
    const last = authors.pop();
    return `${authors.join(", ")}, & ${last}`;
  }
  // Caso +20 autores: primeros 19, puntos suspensivos y el último
  return `${authors.slice(0, 19).join(", ")}, ... ${authors[authors.length - 1]}`;
};

/**
 * Resuelve la fecha o año para la referencia bibliográfica.
 */
const resolveDate = (source) => {
  const m = source.metadata || {};
  if (m.fullDate && source.year) {
    return `${source.year}, ${m.fullDate}`;
  }
  return m.fullDate || source.year || m.year || "s.f.";
};

/**
 * Diccionario de plantillas APA 7 por tipo de obra.
 */
const TEMPLATES = {
  // --- LIBROS ---
  libro_1: (s) => {
    const m = s.metadata || {};
    const subtitle = m.subtitle ? `: ${m.subtitle}` : "";
    const pub = m.publisher ? `. ${m.publisher}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>${s.title}${subtitle}</i>${pub}.`;
  },
  libro_2_20: (s) => {
    const m = s.metadata || {};
    const pub = m.publisher ? `. ${m.publisher}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>${s.title}</i>${pub}.`;
  },
  libro_plus_20: (s) => {
    const m = s.metadata || {};
    const ed = m.edition ? ` (${m.edition})` : "";
    const pub = m.publisher ? `. ${m.publisher}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>${s.title}</i>${ed}${pub}.`;
  },
  libro_sin_autor: (s) => {
    const m = s.metadata || {};
    const pub = m.publisher ? `. ${m.publisher}` : "";
    return `<i>${s.title}</i>. (${resolveDate(s)})${pub}.`;
  },
  capitulo_libro: (s) => {
    const m = s.metadata || {};
    const editor = m.editor ? `En ${m.editor} (Ed.), ` : "En ";
    const bookTitle = m.bookTitle ? `<i>${m.bookTitle}</i>` : "";
    const edPages = [];
    if (m.edition) edPages.push(m.edition);
    if (m.pages) edPages.push(`pp. ${m.pages}`);
    const details = edPages.length > 0 ? ` (${edPages.join(", ")})` : "";
    const pub = m.publisher ? `. ${m.publisher}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). ${s.title}. ${editor}${bookTitle}${details}${pub}.`;
  },

  // --- ARTÍCULOS CIENTÍFICOS ---
  articulo: (s) => {
    const m = s.metadata || {};
    const journal = m.journal ? `<i>${m.journal}</i>` : "";
    const vol = m.volume ? `, <i>${m.volume}</i>` : "";
    const num = m.number ? `(${m.number})` : "";
    const pag = m.pages ? `, ${m.pages}` : "";
    const doi = m.doi
      ? `. https://doi.org/${m.doi.replace(/^https?:\/\/doi\.org\//, "")}`
      : "";
    const url = !doi && (m.url || s.url) ? `. ${m.url || s.url}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). ${s.title}. ${journal}${vol}${num}${pag}${doi}${url}.`;
  },

  // --- CONTENIDO DIGITAL Y WEB ---
  web: (s) => {
    const m = s.metadata || {};
    const site = m.siteName ? `. ${m.siteName}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>${s.title}</i>${site}${url}`;
  },
  video: (s) => {
    const m = s.metadata || {};
    const platform = m.platform ? ` [Video]. ${m.platform}` : " [Video]";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>${s.title}</i>${platform}${url}`;
  },
  redes_sociales: (s) => {
    const m = s.metadata || {};
    const user = m.username ? ` [${m.username}]` : "";
    const site = m.siteName ? `. ${m.siteName}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${formatAuthors(s.author)}${user} (${resolveDate(s)}). <i>${s.title}</i>${site}${url}`;
  },

  // --- ACADÉMICO / CONFERENCIAS ---
  tesis: (s) => {
    const m = s.metadata || {};
    const typeAndInst = [m.thesisType, m.institution]
      .filter(Boolean)
      .join(", ");
    const bracket = typeAndInst ? ` [${typeAndInst}]` : "";
    const db = m.database ? `. ${m.database}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>${s.title}</i>${bracket}${db}${url}`;
  },
  ponencia: (s) => {
    const m = s.metadata || {};
    const conf = m.conference
      ? ` [Sesión de conferencia]. ${m.conference}`
      : " [Ponencia]";
    const loc = m.location ? `, ${m.location}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>${s.title}</i>${conf}${loc}${url}`;
  },

  // --- LEGALES ---
  constitucion: (s) => {
    const m = s.metadata || {};
    const gazette = m.officialGazette ? `. ${m.officialGazette}` : "";
    const pub = m.publisher ? `. ${m.publisher}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${m.issuingEntity || s.author || "Constitución"}. (${resolveDate(s)}). <i>${s.title}</i>${gazette}${pub}${url}`;
  },
  ley_decreto: (s) => {
    const m = s.metadata || {};
    const num = m.number ? ` ${m.number}` : "";
    const gazette = m.officialGazette ? `. ${m.officialGazette}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${m.issuingEntity || s.author || "Gobierno"}. (${resolveDate(s)}). <i>${s.title}${num}</i>${gazette}${url}`;
  },
  sentencia: (s) => {
    const m = s.metadata || {};
    const court = m.court || s.author || "Corte";
    const num = m.number ? ` ${m.number}` : "";
    const judge = m.judge ? `. M.P. ${m.judge}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${court}. (${resolveDate(s)}). <i>Sentencia${num}</i>${judge}${url}`;
  },
  salvamento_voto: (s) => {
    const m = s.metadata || {};
    const orig = m.originalSentenceRef ? ` a la ${m.originalSentenceRef}` : "";
    const url = m.url || s.url ? `. ${m.url || s.url}` : "";
    return `${formatAuthors(s.author)} (${resolveDate(s)}). <i>Salvamento de voto${orig}</i>. ${s.title}${url}`;
  },
};

export const renderSourceAPA = (source) => {
  if (!source) return "";
  const renderer = TEMPLATES[source.type] || TEMPLATES.libro_1;
  return renderer(source);
};

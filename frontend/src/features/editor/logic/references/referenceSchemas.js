export const REFERENCE_SCHEMAS = {
  libro_1: {
    label: "Libro impreso (1 autor)",
    fields: ["author", "year", "title", "subtitle", "publisher"],
  },
  libro_2_20: {
    label: "Libro (2 a 20 autores)",
    fields: ["author", "year", "title", "publisher"],
  },
  libro_plus_20: {
    label: "Libro (> 20 autores)",
    fields: ["author", "year", "title", "edition", "publisher"],
  },
  libro_sin_autor: {
    label: "Libro sin autor",
    fields: ["title", "year", "publisher"],
  },
  capitulo_libro: {
    label: "Capítulo de libro",
    fields: [
      "author",
      "year",
      "title",
      "subtitle",
      "editor",
      "bookTitle",
      "edition",
      "pages",
      "publisher",
    ],
  },
  articulo: {
    label: "Artículo científico",
    fields: [
      "author",
      "year",
      "title",
      "journal",
      "volume",
      "number",
      "pages",
      "doi",
      "url",
    ],
  },
  video: {
    label: "Video",
    fields: ["author", "fullDate", "title", "platform", "url"],
  },
  web: {
    label: "Página Web",
    fields: ["author", "fullDate", "title", "url"],
  },
  redes_sociales: {
    label: "Redes Sociales",
    fields: ["author", "username", "fullDate", "title", "siteName", "url"],
  },
  tesis: {
    label: "Tesis / Trabajo de grado",
    fields: [
      "author",
      "year",
      "title",
      "thesisType",
      "institution",
      "database",
      "url",
    ],
  },
  ponencia: {
    label: "Ponencia",
    fields: ["author", "fullDate", "title", "conference", "location", "url"],
  },
  constitucion: {
    label: "Constitución",
    fields: [
      "issuingEntity",
      "year",
      "title",
      "officialGazette",
      "url",
      "publisher",
    ],
  },
  ley_decreto: {
    label: "Ley o Decreto",
    fields: [
      "issuingEntity",
      "year",
      "number",
      "title",
      "officialGazette",
      "url",
    ],
  },
  sentencia: {
    label: "Sentencia",
    fields: ["court", "year", "number", "judge", "url"],
  },
  salvamento_voto: {
    label: "Salvamento de voto",
    fields: ["author", "year", "title", "originalSentenceRef", "url"],
  },
};

export const REFERENCE_FIELDS = {
  // --- Identificadores de Responsabilidad ---
  author: {
    label: "Autor(es)",
    placeholder: "Ej: García, G. o Ministerio de Salud",
    type: "text",
  },
  username: {
    label: "Usuario",
    placeholder: "Ej: @alcaldiabogota",
    type: "text",
  },
  judge: {
    label: "Magistrado Ponente",
    placeholder: "Nombre completo",
    type: "text",
  },
  issuingEntity: {
    label: "Entidad que expide",
    placeholder: "Ej: Congreso de la República",
    type: "text",
  },
  court: {
    label: "Tribunal / Sala",
    placeholder: "Ej: Sala de Casación Penal",
    type: "text",
  },

  // --- Información Temporal ---
  year: {
    label: "Año",
    placeholder: "2024",
    type: "number",
  },
  fullDate: {
    label: "Fecha exacta",
    placeholder: "Ej: 15 de marzo",
    type: "text",
  },

  // --- Información de Título ---
  title: {
    label: "Título",
    placeholder: "Título principal de la obra",
    type: "text",
  },
  subtitle: {
    label: "Subtítulo",
    placeholder: "Información complementaria",
    type: "text",
  },

  // --- Datos de Publicación y Fuente ---
  publisher: {
    label: "Publicador / Editorial",
    placeholder: "Ej: Editorial Planeta",
    type: "text",
  },
  journal: {
    label: "Nombre de la revista",
    placeholder: "Ej: Nature Medicine",
    type: "text",
  },
  siteName: {
    label: "Nombre del sitio",
    placeholder: "Ej: El Tiempo o Instagram",
    type: "text",
  },
  platform: {
    label: "Fuente / Plataforma",
    placeholder: "Ej: YouTube",
    type: "text",
  },
  database: {
    label: "Base de datos",
    placeholder: "Ej: ProQuest o Repositorio Institucional",
    type: "text",
  },
  officialGazette: {
    label: "Diario Oficial",
    placeholder: "Número y fecha del diario",
    type: "text",
  },
  conference: {
    label: "Conferencia / Evento",
    placeholder: "Nombre del evento académico",
    type: "text",
  },

  // --- Datos de Localización y Formato ---
  url: {
    label: "URL",
    placeholder: "https://...",
    type: "text",
  },
  doi: {
    label: "DOI",
    placeholder: "10.1000/xyz123",
    type: "text",
  },
  pages: {
    label: "Páginas",
    placeholder: "Ej: 124-145",
    type: "text",
  },
  volume: {
    label: "Volumen",
    placeholder: "Ej: 12",
    type: "text",
  },
  number: {
    label: "Número",
    placeholder: "Ej: 3 (o No. de Ley)",
    type: "text",
  },
  edition: {
    label: "Edición",
    placeholder: "Ej: 2da ed.",
    type: "text",
  },
  location: {
    label: "Ciudad y País",
    placeholder: "Ej: Bogotá, Colombia",
    type: "text",
  },

  // --- Metadatos Específicos ---
  thesisType: {
    label: "Tipo de trabajo de grado",
    placeholder: "Ej: Tesis de maestría",
    type: "text",
  },
  institution: {
    label: "Institución",
    placeholder: "Nombre de la universidad",
    type: "text",
  },
  originalSentenceRef: {
    label: "Referencia original",
    placeholder: "Sentencia vinculada",
    type: "text",
  },
};

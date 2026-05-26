// src/features/editor/components/config/logic/engine/documentLayoutEngine.js

export const calculateDocumentMap = (
  metadata,
  editorPagesCount = 1,
  introductionText = "",
) => {
  const prelim = metadata?.preliminares || {};
  const listaAnexos = prelim.anexos?.items || [];

  // Objeto donde acumularemos en qué número de página inicia cada sección
  const map = {
    portada: 1,
    contraportada: 2,
    aceptacion: 3,
    reglamento: 4,
  };

  // Llevamos un contador dinámico de páginas acumuladas
  let currentPage = 5; // Empezamos en la 5, ya que las 4 primeras son fijas obligatorias

  // 1. Dedicatoria (Opcional - Ocupa 1 página si está activa)
  if (prelim.dedicatoria?.enabled) {
    map.dedicatoria = currentPage;
    currentPage += 1;
  } else {
    map.dedicatoria = null;
  }

  // 2. Agradecimientos (Opcional - Ocupa 1 página si está activa)
  if (prelim.agradecimientos?.enabled) {
    map.agradecimientos = currentPage;
    currentPage += 1;
  } else {
    map.agradecimientos = null;
  }

  // 3. Bloque de Índices (TOC, Tablas, Figuras, Anexos)
  // El índice de contenido general siempre ocupa mínimo 1 página
  map.toc = currentPage;
  let paginasDeIndices = 1;

  // Si hay elementos en el editor, el motor sumará sus respectivas hojas independientes
  // Nota: Estas listas se calculan dinámicamente en base a los bloques existentes
  if (metadata?._internalStatus?.hasTables) paginasDeIndices += 1;
  if (metadata?._internalStatus?.hasFigures) paginasDeIndices += 1;
  if (prelim.anexos?.enabled && listaAnexos.length > 0) paginasDeIndices += 1;

  currentPage += paginasDeIndices;

  // 4. Glosario (Opcional - Flexible)
  if (prelim.glosario?.enabled) {
    map.glosario = currentPage;
    // Estimación: 1 página por cada 8 términos de glosario (mínimo 1)
    const termsCount = prelim.glosario.terms?.length || 0;
    const glosarioPages =
      termsCount > 0 ? Math.max(1, Math.ceil(termsCount / 8)) : 1;
    currentPage += glosarioPages;
  } else {
    map.glosario = null;
  }

  // 5. Resumen (Requerido - Fijo 1 página)
  map.resumen = currentPage;
  currentPage += 1;

  // 6. Abstract (Requerido - Fijo 1 página)
  map.abstract = currentPage;
  currentPage += 1;

  // 7. Introducción (Requerida - Flexible)
  map.introduccionPage = currentPage;

  // Calculamos el tamaño de la introducción basándonos en caracteres
  // Una página normal a doble espacio en APA aloja unos 1200 a 1500 caracteres.
  const caracteresIntro = introductionText?.length || 0;
  const paginasIntroduccion =
    caracteresIntro > 0 ? Math.max(1, Math.ceil(caracteresIntro / 1400)) : 1;

  currentPage += paginasIntroduccion;

  // 8. Editor de Texto Principal (Capítulos h1, h2, h3)
  // Inicia inmediatamente después de que termine la introducción
  map.editorStartPage = currentPage;

  // Sumamos la cantidad de páginas reales que el usuario ha redactado en el canvas
  currentPage += editorPagesCount;

  // 9. Bloque Final de Anexos Físicos
  if (prelim.anexos?.enabled && listaAnexos.length > 0) {
    map.anexosStartPage = currentPage;
    // 1 página de la carátula "Anexos" + 1 página por cada ítem del array
    currentPage += 1 + listaAnexos.length;
  } else {
    map.anexosStartPage = null;
  }

  // Guardamos el total del documento por si se requiere
  map.totalPages = currentPage - 1;

  return map;
};

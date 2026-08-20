// src/features/editor/components/config/logic/engine/documentLayoutEngine.js

export const calculateDocumentMap = (
  metadata,
  editorPagesCount = 1,
  introductionText = "",
  sections = {},
  sources = [],
) => {
  const prelim = metadata?.preliminares || {};
  const listaAnexos = prelim.anexos?.items || [];

  const map = {};
  let currentPage = 1;

  // 1. Portada
  if (sections.titlePage) {
    map.portada = currentPage++;
  }

  // 2. Contraportada
  if (sections.contraportada) {
    map.contraportada = currentPage++;
  }

  // 3. Aceptación
  if (sections.aceptacion && prelim.aceptacion?.enabled) {
    map.aceptacion = currentPage++;
  }

  // 4. Reglamento
  if (sections.reglamento && prelim.reglamento?.enabled) {
    map.reglamento = currentPage++;
  }

  // 5. Dedicatoria
  if (
    sections.dedicatoria &&
    prelim.dedicatoria?.enabled &&
    prelim.dedicatoria?.content?.trim()
  ) {
    map.dedicatoria = currentPage++;
  }

  // 6. Agradecimientos
  if (
    sections.agradecimientos &&
    prelim.agradecimientos?.enabled &&
    prelim.agradecimientos?.content?.trim()
  ) {
    map.agradecimientos = currentPage++;
  }

  // 7. Índices (TOC General, Tablas, Figuras, Anexos)
  if (sections.toc) {
    map.toc = currentPage++;
    // Tablas, Figuras y Anexos consumen hoja si existen datos
    if (metadata?._internalStatus?.hasTables) map.tocTablas = currentPage++;
    if (metadata?._internalStatus?.hasFigures) map.tocFiguras = currentPage++;
    if (sections.annexes && prelim.anexos?.enabled && listaAnexos.length > 0) {
      map.tocAnexos = currentPage++;
    }
  }

  // 8. Glosario
  if (
    sections.glosario &&
    prelim.glosario?.enabled &&
    (prelim.glosario.terms?.length || 0) > 0
  ) {
    map.glosario = currentPage;
    const termsCount = prelim.glosario.terms.length;
    currentPage += Math.max(1, Math.ceil(termsCount / 8));
  }

  // 9. Resumen
  if (
    sections.resumen &&
    prelim.resumen?.enabled &&
    prelim.resumen?.content?.trim()
  ) {
    map.resumen = currentPage++;
  }

  // 10. Abstract
  if (
    sections.abstract &&
    prelim.abstract?.enabled &&
    prelim.abstract?.content?.trim()
  ) {
    map.abstract = currentPage++;
  }

  // 11. Introducción (Solo si está seleccionada y tiene texto)
  const hasIntro = sections.introduccion && introductionText?.trim().length > 0;
  if (hasIntro) {
    map.introduccionPage = currentPage;
    const caracteresIntro = introductionText.trim().length;
    const paginasIntro = Math.max(1, Math.ceil(caracteresIntro / 1400));
    currentPage += paginasIntro;
  } else {
    map.introduccionPage = null;
  }

  // 12. Cuerpo de Redacción (Canvas)
  if (sections.body) {
    map.editorStartPage = currentPage;
    currentPage += Math.max(1, editorPagesCount);
  } else {
    map.editorStartPage = null;
  }

  // 13. Referencias Bibliográficas
  const hasReferences = sections.references && sources && sources.length > 0;
  if (hasReferences) {
    map.referenciasPage = currentPage;
    currentPage += 1; // Mínimo 1 hoja de referencias
  } else {
    map.referenciasPage = null;
  }

  // 14. Anexos
  if (sections.annexes && prelim.anexos?.enabled && listaAnexos.length > 0) {
    map.anexosStartPage = currentPage;
    currentPage += 1 + listaAnexos.length; // 1 carátula divisoria + 1 por anexo
  } else {
    map.anexosStartPage = null;
  }

  map.totalPages = currentPage - 1;
  return map;
};

// src/features/editor/logic/engine/document/buildDocumentPages.js

/**
 * Genera el listado secuencial de hojas físicas del documento.
 * Solo incluye lo que esté habilitado, seleccionado y con contenido real.
 */
export const buildDocumentPages = ({
  projectMetadata = {},
  canvasPages = [],
  blocks = [],
  sources = [],
  activeSections = {},
}) => {
  const prelim = projectMetadata?.preliminares || {};
  const rawList = [];

  // Helper para verificar texto no vacío
  const hasContent = (val) => typeof val === "string" && val.trim().length > 0;

  // 1. Portada
  if (activeSections.titlePage !== false) {
    rawList.push({ type: "portada", data: projectMetadata });
  }

  // 2. Contraportada (Depende únicamente de activeSections, sin exigir .enabled)
  if (activeSections.contraportada !== false) {
    rawList.push({ type: "contraportada", data: projectMetadata });
  }

  // 3. Aceptación
  if (activeSections.aceptacion && prelim.aceptacion?.enabled) {
    rawList.push({ type: "aceptacion", data: projectMetadata });
  }

  // 4. Reglamento
  if (activeSections.reglamento && prelim.reglamento?.enabled) {
    rawList.push({ type: "reglamento", data: projectMetadata });
  }

  // 5. Dedicatoria
  if (
    activeSections.dedicatoria &&
    prelim.dedicatoria?.enabled &&
    hasContent(prelim.dedicatoria?.content)
  ) {
    rawList.push({ type: "dedicatoria", data: prelim.dedicatoria });
  }

  // 6. Agradecimientos
  if (
    activeSections.agradecimientos &&
    prelim.agradecimientos?.enabled &&
    hasContent(prelim.agradecimientos?.content)
  ) {
    rawList.push({ type: "agradecimientos", data: prelim.agradecimientos });
  }

  // 7. Índices / Tablas de Contenido
  if (activeSections.toc !== false) {
    // 7.1 Índice de Contenido General (siempre que la TOC esté activa)
    rawList.push({ type: "toc_contenido" });

    // 7.2 Lista de Tablas (solo si hay tablas reales en los bloques del canvas)
    const hasTables = blocks.some(
      (b) => b.type === "table" || b.type === "tableBlock",
    );
    if (hasTables) {
      rawList.push({ type: "toc_tablas" });
    }

    // 7.3 Lista de Figuras (solo si hay figuras reales)
    const hasFigures = blocks.some(
      (b) => b.type === "figure" || b.type === "figureBlock",
    );
    if (hasFigures) {
      rawList.push({ type: "toc_figuras" });
    }

    // 7.4 Lista de Anexos (solo si hay anexos creados)
    const hasAnnexes =
      prelim.anexos?.enabled && (prelim.anexos?.items?.length || 0) > 0;
    if (hasAnnexes && activeSections.annexes !== false) {
      rawList.push({ type: "toc_anexos" });
    }
  }

  // 8. Glosario
  if (
    activeSections.glosario &&
    prelim.glosario?.enabled &&
    (prelim.glosario?.terms?.length || 0) > 0
  ) {
    rawList.push({ type: "glosario", data: prelim.glosario });
  }

  // 9. Resumen
  if (
    activeSections.resumen &&
    prelim.resumen?.enabled &&
    hasContent(prelim.resumen?.content)
  ) {
    rawList.push({ type: "resumen", data: prelim.resumen });
  }

  // 10. Abstract
  if (
    activeSections.abstract &&
    prelim.abstract?.enabled &&
    hasContent(prelim.abstract?.content)
  ) {
    rawList.push({ type: "abstract", data: prelim.abstract });
  }

  // 11. Introducción
  if (
    activeSections.introduccion !== false &&
    hasContent(prelim.introduccion?.content)
  ) {
    rawList.push({ type: "introduccion", data: prelim.introduccion });
  }

  // 12. Páginas del Canvas (Cuerpo de Redacción)
  if (activeSections.body !== false && Array.isArray(canvasPages)) {
    canvasPages.forEach((page, index) => {
      rawList.push({
        type: "canvas_page",
        pageId: page.id,
        canvasPageIndex: index,
        blockIds: page.blockIds || [],
      });
    });
  }

  // 13. Referencias Bibliográficas
  if (activeSections.references !== false && sources && sources.length > 0) {
    rawList.push({ type: "referencias", data: sources });
  }

  // 14. Anexos Físicos
  if (
    activeSections.annexes !== false &&
    prelim.anexos?.enabled &&
    (prelim.anexos?.items?.length || 0) > 0
  ) {
    // Portada separadora de Anexos
    rawList.push({ type: "anexos_portada" });
    // Hojas de cada anexo individual
    prelim.anexos.items.forEach((item, idx) => {
      rawList.push({
        type: "anexo_item",
        data: item,
        index: idx,
      });
    });
  }

  // Asignamos el número de página secuencial exacto (1, 2, 3...)
  return rawList.map((item, index) => ({
    ...item,
    pageNumber: index + 1,
  }));
};

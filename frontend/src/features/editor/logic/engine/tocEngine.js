// src/features/editor/components/config/logic/engine/tocEngine.js
import { calculateDocumentMap } from "./documentLayoutEngine";

export const generateAllLists = (
  blocks = [],
  pages = [],
  metadata = {},
  sections = {},
  sources = [],
) => {
  const introText = metadata?.preliminares?.introduccion?.content || "";
  const totalPaginasEditor = pages?.length || 1;

  let docMap = {};
  try {
    docMap = calculateDocumentMap(
      metadata,
      totalPaginasEditor,
      introText,
      sections,
      sources,
    );
  } catch (e) {
    console.warn("Error calculando docMap en tocEngine:", e);
  }

  const prelim = metadata?.preliminares || {};

  const lists = {
    contenido: [],
    tablas: [],
    figuras: [],
    anexos: [],
  };

  // ==============================================================
  // 1. INTRODUCCIÓN (Al inicio del índice, solo si está activa)
  // ==============================================================
  if (docMap.introduccionPage) {
    lists.contenido.push({
      text: "Introducción",
      level: "h1",
      page: docMap.introduccionPage,
    });
  }

  // ==============================================================
  // 2. CAPÍTULOS Y TÍTULOS DEL CANVAS (H1, H2, H3, Tablas, Figuras)
  // ==============================================================
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;
  let contadorTablas = 0;
  let contadorFiguras = 0;

  if (
    sections.body &&
    pages &&
    Array.isArray(pages) &&
    docMap.editorStartPage
  ) {
    pages.forEach((page, index) => {
      const realPageNumber = docMap.editorStartPage + index;

      if (page.blockIds && Array.isArray(page.blockIds)) {
        page.blockIds.forEach((blockId) => {
          const block = blocks?.find((b) => b.id === blockId);
          if (!block) return;

          // Jerarquía de Títulos
          if (["h1", "h2", "h3"].includes(block.type)) {
            const rawContent = (block.title || block.content || "").trim();
            if (!rawContent) return;

            let numPrefix = "";
            if (block.type === "h1") {
              h1Count++;
              h2Count = 0;
              h3Count = 0;
              numPrefix = `${h1Count}.`;
            } else if (block.type === "h2") {
              h2Count++;
              h3Count = 0;
              numPrefix = `${h1Count}.${h2Count}.`;
            } else if (block.type === "h3") {
              h3Count++;
              numPrefix = `${h1Count}.${h2Count}.${h3Count}.`;
            }

            lists.contenido.push({
              id: block.id,
              text: `${numPrefix} ${rawContent}`,
              level: block.type,
              page: realPageNumber,
            });
          }

          // Lista de Tablas
          if (block.type === "tableBlock" || block.type === "table") {
            contadorTablas++;
            lists.tablas.push({
              label: `Tabla ${contadorTablas}`,
              title: block.title || "Sin título",
              page: realPageNumber,
            });
          }

          // Lista de Figuras
          if (block.type === "figureBlock" || block.type === "figure") {
            contadorFiguras++;
            lists.figuras.push({
              label: `Figura ${contadorFiguras}`,
              title: block.title || "Sin título",
              page: realPageNumber,
            });
          }
        });
      }
    });
  }

  // ==============================================================
  // 3. REFERENCIAS (Solo si hay fuentes agregadas y activas)
  // ==============================================================
  if (docMap.referenciasPage) {
    lists.contenido.push({
      text: "Referencias",
      level: "h1",
      page: docMap.referenciasPage,
    });
  }

  // ==============================================================
  // 4. ANEXOS (Solo si están habilitados y tienen elementos)
  // ==============================================================
  if (docMap.anexosStartPage && prelim.anexos?.items?.length > 0) {
    const baseAnexosPage = docMap.anexosStartPage;

    lists.contenido.push({
      text: "Anexos",
      level: "h1",
      page: baseAnexosPage,
    });

    prelim.anexos.items.forEach((anexo, idx) => {
      lists.anexos.push({
        label: `Anexo ${anexo.id || String.fromCharCode(65 + idx)}`,
        title: anexo.title || "Sin título",
        page: baseAnexosPage + 1 + idx,
      });
    });
  }

  return { lists, docMap };
};

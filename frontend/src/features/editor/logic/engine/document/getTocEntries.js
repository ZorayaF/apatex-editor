// src/features/editor/logic/engine/document/getTocEntries.js

/**
 * Extrae las entradas de la Tabla de Contenidos a partir del listado plano de páginas reales.
 */
export const getTocEntries = (documentPages = [], blocks = []) => {
  const lists = {
    contenido: [],
    tablas: [],
    figuras: [],
    anexos: [],
  };

  // 1. INTRODUCCIÓN (si existe en las páginas reales)
  const introPage = documentPages.find((p) => p.type === "introduccion");
  if (introPage) {
    lists.contenido.push({
      text: "Introducción",
      level: "h1",
      page: introPage.pageNumber,
    });
  }

  // 2. CAPÍTULOS, TABLAS Y FIGURAS DEL CANVAS
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;
  let tableCount = 0;
  let figureCount = 0;

  const canvasPages = documentPages.filter((p) => p.type === "canvas_page");

  canvasPages.forEach((page) => {
    (page.blockIds || []).forEach((blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      // TÍTULOS (H1, H2, H3)
      if (["h1", "h2", "h3"].includes(block.type)) {
        const rawText = (block.title || block.content || "").trim();
        if (!rawText) return;

        let prefix = "";
        if (block.type === "h1") {
          h1Count++;
          h2Count = 0;
          h3Count = 0;
          prefix = `${h1Count}.`;
        } else if (block.type === "h2") {
          h2Count++;
          h3Count = 0;
          prefix = `${h1Count}.${h2Count}.`;
        } else if (block.type === "h3") {
          h3Count++;
          prefix = `${h1Count}.${h2Count}.${h3Count}.`;
        }

        lists.contenido.push({
          id: block.id,
          text: `${prefix} ${rawText}`,
          level: block.type,
          page: page.pageNumber,
        });
      }

      // TABLAS
      if (block.type === "table" || block.type === "tableBlock") {
        tableCount++;
        lists.tablas.push({
          label: `Tabla ${tableCount}`,
          title: block.title || "Sin título",
          page: page.pageNumber,
        });
      }

      // FIGURAS
      if (block.type === "figure" || block.type === "figureBlock") {
        figureCount++;
        lists.figuras.push({
          label: `Figura ${figureCount}`,
          title: block.title || "Sin título",
          page: page.pageNumber,
        });
      }
    });
  });

  // 3. REFERENCIAS (si existe la página de referencias)
  const refPage = documentPages.find((p) => p.type === "referencias");
  if (refPage) {
    lists.contenido.push({
      text: "Referencias",
      level: "h1",
      page: refPage.pageNumber,
    });
  }

  // 4. ANEXOS (si existe la portada de anexos)
  const annexesCover = documentPages.find((p) => p.type === "anexos_portada");
  if (annexesCover) {
    lists.contenido.push({
      text: "Anexos",
      level: "h1",
      page: annexesCover.pageNumber,
    });

    const annexPages = documentPages.filter((p) => p.type === "anexo_item");
    annexPages.forEach((ap, idx) => {
      lists.anexos.push({
        label: `Anexo ${ap.data?.id || String.fromCharCode(65 + idx)}`,
        title: ap.data?.title || "Sin título",
        page: ap.pageNumber,
      });
    });
  }

  return lists;
};

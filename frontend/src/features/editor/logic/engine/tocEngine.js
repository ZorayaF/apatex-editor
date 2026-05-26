// src/features/editor/components/config/logic/engine/tocEngine.js
import { calculateDocumentMap } from "./documentLayoutEngine";

export const generateAllLists = (blocks, pages, metadata) => {
  let docMap = {
    introduccionPage: 5,
    editorStartPage: 6,
  };
  try {
    const calculated = calculateDocumentMap(metadata);
    if (calculated) docMap = calculated;
  } catch (e) {
    console.warn(
      "No se pudo calcular el mapa dinámico de páginas, usando fallback.",
      e,
    );
  }

  const prelim = metadata?.preliminares || {};

  const lists = {
    contenido: [],
    tablas: [],
    figuras: [],
    anexos: [],
  };

  // 1. CONSTRUCCIÓN ÍNDICE DE CONTENIDO (Secciones preliminares)
  lists.contenido.push({
    text: "Introducción",
    level: "h1",
    page: docMap.introduccionPage || 5,
  });

  // 🔹 CONTADORES PARA LA NUMERACIÓN SIMPLE Y CONSECUTIVA
  let contadorTablas = 0;
  let contadorFiguras = 0;

  // 2. ESCANEO DINÁMICO DE BLOQUES EN LAS PÁGINAS DEL EDITOR
  if (pages && Array.isArray(pages)) {
    pages.forEach((page, index) => {
      const startPage = docMap.editorStartPage || 6;
      const realPageNumber = startPage + index;

      if (page.blockIds && Array.isArray(page.blockIds)) {
        page.blockIds.forEach((blockId) => {
          const block = blocks?.find((b) => b.id === blockId);
          if (!block) return;

          // Capítulos y subtítulos (h1, h2, h3)
          if (["h1", "h2", "h3"].includes(block.type)) {
            lists.contenido.push({
              text: block.content || "Sin título",
              level: block.type,
              page: realPageNumber,
            });
          }

          // ✅ EXTRACCIÓN PREMISA PARA TABLAS
          // Mapeamos el tipo exacto que definas en tu BlockRegistry (asumo 'tableBlock' o 'table')
          if (block.type === "tableBlock" || block.type === "table") {
            contadorTablas++;
            lists.tablas.push({
              label: `Tabla ${contadorTablas}`,
              title: block.title || "Sin título de tabla", // Leemos la prop 'title' directa del bloque
              page: realPageNumber,
            });
          }

          // ✅ EXTRACCIÓN PREMISA PARA FIGURAS
          // Mapeamos el tipo exacto que definas en tu BlockRegistry (asumo 'figureBlock' o 'figure')
          if (block.type === "figureBlock" || block.type === "figure") {
            contadorFiguras++;
            lists.figuras.push({
              label: `Figura ${contadorFiguras}`,
              title: block.title || "Sin título de figura", // Leemos la prop 'title' directa del bloque
              page: realPageNumber,
            });
          }
        });
      }
    });
  }

  // 3. BLOQUE FINAL DE ANEXOS
  if (
    prelim.anexos?.enabled &&
    prelim.anexos?.items &&
    prelim.anexos.items.length > 0
  ) {
    const baseAnexosPage = docMap.anexosStartPage || 20;

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

  return lists;
};

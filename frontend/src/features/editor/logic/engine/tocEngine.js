// src/features/editor/components/config/logic/engine/tocEngine.js
import { calculateDocumentMap } from "./documentLayoutEngine";

export const generateAllLists = (blocks, pages, metadata) => {
  const docMap = calculateDocumentMap(metadata);
  const prelim = metadata?.preliminares || {};

  const lists = {
    contenido: [],
    tablas: [],
    figuras: [],
    anexos: [],
  };

  // ==========================================
  // 1. CONSTRUCCIÓN ÍNDICE DE CONTENIDO
  // ==========================================
  // Secciones preliminares requeridas
  lists.contenido.push({ text: "RESUMEN", level: "h1", page: docMap.resumen });
  lists.contenido.push({
    text: "ABSTRACT",
    level: "h1",
    page: docMap.abstract,
  });

  // Secciones preliminares opcionales (Solo si están activas)
  if (prelim.dedicatoria?.enabled) {
    lists.contenido.push({
      text: "DEDICATORIA",
      level: "h1",
      page: docMap.dedicatoria,
    });
  }
  if (prelim.agradecimientos?.enabled) {
    lists.contenido.push({
      text: "AGRADECIMIENTOS",
      level: "h1",
      page: docMap.agradecimientos,
    });
  }
  if (prelim.glosario?.enabled) {
    lists.contenido.push({
      text: "GLOSARIO",
      level: "h1",
      page: docMap.glosario,
    });
  }

  // Escaneo dinámico en las páginas del editor (H1, H2, H3, Tablas y Figuras)
  pages.forEach((page, index) => {
    const realPageNumber = docMap.editorStartPage + index;

    page.blockIds.forEach((blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      // Títulos del documento
      if (["h1", "h2", "h3"].includes(block.type)) {
        lists.contenido.push({
          text: block.content || "Sin título",
          level: block.type,
          page: realPageNumber,
        });
      }

      // Extracción automática para la Lista de Tablas
      if (block.type === "tableBlock") {
        lists.tablas.push({
          label: `Tabla ${block.number || lists.tablas.length + 1}`,
          title: block.title || "Sin título de tabla",
          page: realPageNumber,
        });
      }

      // Extracción automática para la Lista de Figuras
      if (block.type === "figureBlock") {
        lists.figuras.push({
          label: `Figura ${block.number || lists.figuras.length + 1}`,
          title: block.title || "Sin título de figura",
          page: realPageNumber,
        });
      }
    });
  });

  // Mapeo dinámico del arreglo de anexos si la sección está encendida
  if (prelim.anexos?.enabled && prelim.anexos?.items) {
    // Agregamos la sección general en el índice de contenido
    lists.contenido.push({
      text: "ANEXOS",
      level: "h1",
      page: docMap.anexosStartPage,
    });

    prelim.anexos.items.forEach((anexo) => {
      lists.anexos.push({
        label: `Anexo ${anexo.id}`,
        title: anexo.title || "Sin título",
        page: docMap.anexosStartPage + 1 + prelim.anexos.items.indexOf(anexo),
      });
    });
  }

  return lists;
};

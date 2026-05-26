// src/features/editor/components/config/logic/engine/tocEngine.js
import { calculateDocumentMap } from "./documentLayoutEngine";

export const generateAllLists = (blocks, pages, metadata) => {
  // 1. CAPTURA DE DATOS PARA EL CÁLCULO DINÁMICO DE PÁGINAS
  const introText = metadata?.preliminares?.introduccion?.content || "";
  const totalPaginasEditor = pages?.length || 1;

  // Fallback seguro por si el engine de layout aún no se ha inicializado
  let docMap = {
    resumen: 3,
    abstract: 4,
    introduccionPage: 5,
    editorStartPage: 6,
    anexosStartPage: 10,
  };
  try {
    // Inyectamos la metadata, las páginas del editor y el texto de la intro
    const calculated = calculateDocumentMap(
      metadata,
      totalPaginasEditor,
      introText,
    );
    if (calculated) docMap = calculated;
  } catch (e) {
    console.warn("Error recalculando el mapa dinámico de páginas en TOC:", e);
  }

  const prelim = metadata?.preliminares || {};

  // Objeto estructurado para las 4 listas reglamentarias
  const lists = {
    contenido: [],
    tablas: [],
    figuras: [],
    anexos: [],
  };

  // ==========================================
  // A. CONSTRUCCIÓN DEL ÍNDICE DE CONTENIDO
  // ==========================================

  // 📜 REGLA: Se omiten Resumen, Abstract y opcionales del índice visual.
  // Arranca estrictamente con la Introducción en su página real calculada.
  lists.contenido.push({
    text: "Introducción",
    level: "h1",
    page: docMap.introduccionPage,
  });

  // 🔹 CONTADORES PARA LA JERARQUÍA NUMÉRICA (H1, H2, H3)
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;

  // 🔹 CONTADORES PARA ELEMENTOS VISUALES
  let contadorTablas = 0;
  let contadorFiguras = 0;

  // ==========================================
  // B. ESCANEO DINÁMICO DE BLOQUES EN LAS PÁGINAS
  // ==========================================
  if (pages && Array.isArray(pages)) {
    pages.forEach((page, index) => {
      // Determinamos el número físico de la página sumando el índice actual
      const startPage = docMap.editorStartPage || 6;
      const realPageNumber = startPage + index;

      if (page.blockIds && Array.isArray(page.blockIds)) {
        page.blockIds.forEach((blockId) => {
          const block = blocks?.find((b) => b.id === blockId);
          if (!block) return;

          // 🔤 1. PROCESAMIENTO Y GENERACIÓN DE PREFIJOS PARA TÍTULOS
          if (["h1", "h2", "h3"].includes(block.type)) {
            let numPrefix = "";
            const textoLimpio = block.content || "Sin título";

            if (block.type === "h1") {
              h1Count++;
              h2Count = 0; // Reseteamos subniveles al abrir nuevo capítulo
              h3Count = 0;
              numPrefix = `${h1Count}.`;
            } else if (block.type === "h2") {
              h2Count++;
              h3Count = 0; // Reseteamos tercer nivel
              numPrefix = `${h1Count}.${h2Count}.`;
            } else if (block.type === "h3") {
              h3Count++;
              numPrefix = `${h1Count}.${h2Count}.${h3Count}.`;
            }

            // Unimos el prefijo matemático con el contenido de texto real
            const textoFinal = `${numPrefix} ${textoLimpio}`;

            lists.contenido.push({
              text: textoFinal,
              level: block.type,
              page: realPageNumber,
            });
          }

          // 📊 2. EXTRACCIÓN AUTOMÁTICA PARA LA LISTA DE TABLAS
          if (block.type === "tableBlock" || block.type === "table") {
            contadorTablas++;
            lists.tablas.push({
              label: `Tabla ${contadorTablas}`,
              title: block.title || "Sin título de tabla", // Lectura directa desde la prop raíz del bloque
              page: realPageNumber,
            });
          }

          // 🖼️ 3. EXTRACCIÓN AUTOMÁTICA PARA LA LISTA DE FIGURAS
          if (block.type === "figureBlock" || block.type === "figure") {
            contadorFiguras++;
            lists.figuras.push({
              label: `Figura ${contadorFiguras}`,
              title: block.title || "Sin título de figura", // Lectura directa desde la prop raíz del bloque
              page: realPageNumber,
            });
          }
        });
      }
    });
  }

  // ==========================================
  // C. MAPEO FINAL DEL APARTADO DE ANEXOS
  // ==========================================
  if (
    prelim.anexos?.enabled &&
    prelim.anexos?.items &&
    prelim.anexos.items.length > 0
  ) {
    const baseAnexosPage = docMap.anexosStartPage || 20;

    // Insertamos la sección generalizada en el índice de contenidos
    lists.contenido.push({
      text: "Anexos",
      level: "h1",
      page: baseAnexosPage,
    });

    // Añadimos cada anexo individual a la lista correspondiente utilizando su ID calculado
    prelim.anexos.items.forEach((anexo, idx) => {
      lists.anexos.push({
        label: `Anexo ${anexo.id || String.fromCharCode(65 + idx)}`,
        title: anexo.title || "Sin título",
        // Saltamos 1 página de la carátula divisoria central ("Anexos") + el índice correlativo
        page: baseAnexosPage + 1 + idx,
      });
    });
  }

  return lists;
};

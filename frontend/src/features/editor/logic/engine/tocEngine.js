import { calculateDocumentMap } from "./documentLayoutEngine";

export const generateTOCEntries = (blocks, pages, metadata) => {
  const docMap = calculateDocumentMap(metadata);
  const entries = [];

  // 1. Entradas manuales (Secciones obligatorias antes de los capítulos)
  entries.push({ text: "RESUMEN", level: "h1", page: docMap.resumen });
  entries.push({ text: "ABSTRACT", level: "h1", page: docMap.abstract });

  // 2. Entradas dinámicas (Escaneo de los bloques en las páginas)
  // Mapeamos cada bloque a su número de página real
  pages.forEach((page, index) => {
    const realPageNumber = docMap.editorStartPage + index;

    page.blockIds.forEach((blockId) => {
      const block = blocks.find((b) => b.id === blockId);

      if (block && ["h1", "h2", "h3"].includes(block.type)) {
        entries.push({
          text: block.content || "Sin título",
          level: block.type,
          page: realPageNumber,
        });
      }
    });
  });

  return entries;
};

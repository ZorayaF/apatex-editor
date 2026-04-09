// src/features/editor/logic/engine/paginationEngine.js
import { CONTENT_MAX_HEIGHT } from "@core/utils/measurements";

export const analyzeOverflow = (pageContentElement) => {
  const blocks = pageContentElement.querySelectorAll("[data-block-id]");

  for (const block of blocks) {
    const height = block.offsetHeight;
    const bottom = block.offsetTop + height;

    // ¿El bloque cruza el límite de la página?
    if (bottom > CONTENT_MAX_HEIGHT) {
      return {
        id: block.getAttribute("data-block-id"),
        type: block.getAttribute("data-block-type") || "block",
        // ¿Es el bloque en sí mismo más alto que toda la zona de contenido?
        isImpossiblyLarge: height > CONTENT_MAX_HEIGHT,
      };
    }
  }

  return null;
};

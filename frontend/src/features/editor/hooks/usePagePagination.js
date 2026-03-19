// src/features/editor/hooks/usePagePagination.js
import { useEffect } from "react";
import { useStore } from "@store";
import { getOverflowBlockId } from "../logic/engine/paginationEngine";

export const usePagePagination = (pageContentRef, blockIds, pageNumber) => {
  // 1. Selector selectivo: Solo traemos la acción, no el estado.
  // Esto evita que el hook cause re-renders por sí solo.
  const moveToNextPage = useStore((s) => s.moveToNextPage);

  useEffect(() => {
    // 2. Usamos requestAnimationFrame para esperar a que el
    // navegador termine de pintar el layout antes de medir.
    const handlePagination = () => {
      if (pageContentRef.current) {
        const overflowId = getOverflowBlockId(pageContentRef.current);
        if (overflowId) {
          moveToNextPage(overflowId);
        }
      }
    };

    // 3. Pequeño delay de ejecución para evitar el "scroll fight"
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handlePagination);
    }, 100);

    return () => clearTimeout(timeoutId);

    // Solo se dispara si cambian los IDs de los bloques en ESTA página
    // o si el número de página cambia. Ignora el texto que se escribe dentro.
  }, [blockIds, pageNumber, moveToNextPage, pageContentRef]);
};

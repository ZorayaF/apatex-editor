// src/features/editor/hooks/usePagePagination.js
import { useEffect } from "react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";
import { analyzeOverflow } from "../logic/engine/paginationEngine";

export const usePagePagination = (pageContentRef, blockIds, pageNumber) => {
  const moveToNextPage = useStore((s) => s.moveToNextPage);

  useEffect(() => {
    const handlePagination = () => {
      if (!pageContentRef.current) return;

      const result = analyzeOverflow(pageContentRef.current);

      if (result) {
        if (result.isImpossiblyLarge) {
          // 1. Avisar que el bloque es gigante
          notifications.show({
            id: `overflow-${result.id}`,
            title: "Objeto demasiado grande",
            message: `La ${result.type} excede el tamaño de la página. Por favor, redúcela.`,
            color: "orange",
            autoClose: 5000,
          });

          // 2. ¡SOLUCIÓN AQUÍ!: Empujar al siguiente bloque
          // Buscamos quién es el que está justo después del bloque gigante en esta página
          const currentIndex = blockIds.indexOf(result.id);
          const nextBlockId = blockIds[currentIndex + 1];

          // Si hay alguien después, lo mandamos a la siguiente página
          if (nextBlockId) {
            moveToNextPage(nextBlockId);
          }
        } else {
          // Escenario normal: El bloque sí cabe en una página limpia, así que lo movemos
          moveToNextPage(result.id);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handlePagination);
    }, 100);

    return () => clearTimeout(timeoutId);

    // Es vital que blockIds esté aquí para que el efecto se repita
    // hasta que no quede nadie desbordado
  }, [blockIds, pageNumber, moveToNextPage, pageContentRef]);
};

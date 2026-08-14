// src/features/editor/hooks/usePagePagination.js
import { useEffect } from "react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";
import { analyzeOverflow } from "@logic/engine/paginationEngine";

export const usePagePagination = (pageContentRef, blockIds, pageNumber) => {
  const moveToNextPage = useStore((s) => s.moveToNextPage);

  useEffect(() => {
    const handlePagination = () => {
      if (!pageContentRef.current) return;

      const result = analyzeOverflow(pageContentRef.current);

      if (result) {
        if (result.isImpossiblyLarge) {
          // Advertencia concisa de desborde
          notifications.show({
            id: `overflow-${result.id}`,
            message: `El objeto (${result.type}) supera la altura de la página. Reduce su tamaño.`,
            color: "orange",
            autoClose: 3500,
            withCloseButton: false,
          });

          const currentIndex = blockIds.indexOf(result.id);
          const nextBlockId = blockIds[currentIndex + 1];

          if (nextBlockId) {
            moveToNextPage(nextBlockId);
          }
        } else {
          moveToNextPage(result.id);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handlePagination);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [blockIds, pageNumber, moveToNextPage, pageContentRef]);
};

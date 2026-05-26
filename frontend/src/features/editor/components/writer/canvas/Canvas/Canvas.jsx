import { useMemo } from "react";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow";
import { Text } from "@mantine/core";
import { Page } from "../Page";
import classes from "./Canvas.module.css";

export const Canvas = () => {
  const { pages, blocks, focusedChapterId } = useStore(
    useShallow((s) => ({
      pages: s.pages,
      blocks: s.blocks,
      focusedChapterId: s.focusedChapterId,
    })),
  );

  const focusData = useMemo(() => {
    // 1. ORDEN REAL: Aplanamos los IDs según aparecen en las páginas
    const orderedIds = pages.flatMap((p) => p.blockIds);

    if (!focusedChapterId)
      return { pageIds: pages.map((p) => p.id), allowedIds: null };

    // 2. RANGO DE ENFOQUE
    const startIdx = orderedIds.indexOf(focusedChapterId);
    if (startIdx === -1)
      return { pageIds: pages.map((p) => p.id), allowedIds: null };

    // Buscamos el final (siguiente H1) en el orden físico del documento
    let endIdx = orderedIds.length;
    const blockMap = new Map(blocks.map((b) => [b.id, b]));

    for (let i = startIdx + 1; i < orderedIds.length; i++) {
      if (blockMap.get(orderedIds[i])?.type === "h1") {
        endIdx = i;
        break;
      }
    }

    const allowedSet = new Set(orderedIds.slice(startIdx, endIdx));

    // 3. PÁGINAS VISIBLES: Aquellas que tengan al menos un bloque del rango
    const visiblePageIds = pages
      .filter((p) => p.blockIds.some((id) => allowedSet.has(id)))
      .map((p) => p.id);

    return { pageIds: visiblePageIds, allowedIds: allowedSet };
  }, [pages, blocks, focusedChapterId]);

  return (
    <div className={classes.canvasViewport}>
      {focusData.pageIds.map((id) => {
        const originalIndex = pages.findIndex((p) => p.id === id);
        return (
          <Page
            key={id}
            pageId={id}
            pageNumber={originalIndex + 1}
            allowedBlockIds={focusData.allowedIds} // <--- PROP CRÍTICA MANTENIDA
          />
        );
      })}

      {focusedChapterId && (
        <Text size="xs" c="dimmed" mt="xl" className={classes.focusIndicator}>
          Modo Enfoque: Mostrando únicamente el contenido del capítulo
          seleccionado.
        </Text>
      )}
    </div>
  );
};

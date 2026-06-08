import { useMemo } from "react";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow";
import { Text } from "@mantine/core";
import { Page } from "../Page";
import { calculateDocumentMap } from "@logic/engine/documentLayoutEngine"; // NUEVO: Importamos el motor aquí
import classes from "./Canvas.module.css";

export const Canvas = () => {
  // 1. Añadimos projectMetadata al shallow para evitar re-renders innecesarios
  const { pages, blocks, focusedChapterId, projectMetadata } = useStore(
    useShallow((s) => ({
      pages: s.pages,
      blocks: s.blocks,
      focusedChapterId: s.focusedChapterId,
      projectMetadata: s.projectMetadata,
    })),
  );

  // 2. CALCULAMOS ESTO UNA SOLA VEZ PARA TODO EL DOCUMENTO (Elimina el lag)
  const docMap = useMemo(
    () => calculateDocumentMap(projectMetadata),
    [projectMetadata],
  );

  // 3. UNIFICAMOS EL LÍMITE DEL TÍTULO AQUÍ
  const runningTitle =
    projectMetadata?.tituloAbreviado ||
    projectMetadata?.tituloProyecto?.substring(0, 50).toUpperCase() ||
    "TÍTULO DEL PROYECTO";

  const focusData = useMemo(() => {
    // ... (Tu lógica de orderedIds y allowedSet se mantiene exactamente igual) ...
    const orderedIds = pages.flatMap((p) => p.blockIds);

    if (!focusedChapterId)
      return { pageIds: pages.map((p) => p.id), allowedIds: null };

    const startIdx = orderedIds.indexOf(focusedChapterId);
    if (startIdx === -1)
      return { pageIds: pages.map((p) => p.id), allowedIds: null };

    let endIdx = orderedIds.length;
    const blockMap = new Map(blocks.map((b) => [b.id, b]));

    for (let i = startIdx + 1; i < orderedIds.length; i++) {
      if (blockMap.get(orderedIds[i])?.type === "h1") {
        endIdx = i;
        break;
      }
    }

    const allowedSet = new Set(orderedIds.slice(startIdx, endIdx));

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
            allowedBlockIds={focusData.allowedIds}
            // 4. PASAMOS LOS DATOS YA CALCULADOS COMO PROPS LIGERAS
            editorStartPage={docMap.editorStartPage}
            runningTitle={runningTitle}
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

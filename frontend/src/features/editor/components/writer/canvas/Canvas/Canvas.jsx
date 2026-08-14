// src/features/editor/components/writer/canvas/Canvas/Canvas.jsx
import React, { useMemo } from "react";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow";
import { Text, Box } from "@mantine/core";
import { Page } from "../Page";
import { calculateDocumentMap } from "@logic/engine/documentLayoutEngine";
import classes from "./Canvas.module.css";

export const Canvas = () => {
  const { pages, blocks, focusedChapterId, projectMetadata, zoom } = useStore(
    useShallow((s) => ({
      pages: s.pages,
      blocks: s.blocks,
      focusedChapterId: s.focusedChapterId,
      projectMetadata: s.projectMetadata,
      zoom: s.zoom || 1.0,
    })),
  );

  const docMap = useMemo(
    () => calculateDocumentMap(projectMetadata),
    [projectMetadata],
  );

  const runningTitle =
    projectMetadata?.tituloAbreviado ||
    projectMetadata?.tituloProyecto?.substring(0, 50).toUpperCase() ||
    "TÍTULO DEL PROYECTO";

  // Lógica de Modo Enfoque (Oculta los demás capítulos)
  const focusData = useMemo(() => {
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
    <div
      className={classes.canvasViewport}
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        transition: "transform 0.12s ease-out",
      }}
    >
      {focusData.pageIds.map((id) => {
        const originalIndex = pages.findIndex((p) => p.id === id);
        return (
          <Page
            key={id}
            pageId={id}
            pageNumber={originalIndex + 1}
            allowedBlockIds={focusData.allowedIds}
            editorStartPage={docMap.editorStartPage}
            runningTitle={runningTitle}
          />
        );
      })}

      {focusedChapterId && (
        <Text size="xs" c="dimmed" mt="xl" className={classes.focusIndicator}>
          Modo Enfoque activo: Viendo únicamente el capítulo seleccionado.
        </Text>
      )}
    </div>
  );
};

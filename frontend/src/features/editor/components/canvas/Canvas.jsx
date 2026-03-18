// src/features/editor/components/canvas/Canvas.jsx
import React, { useMemo } from "react";
import { Box } from "@mantine/core";
import { useStore } from "@store";
import { Page } from "./Page";
import { BlockWrapper } from "../blocks/core/BlockWrapper";
import { BlockFactory } from "../blocks/core/BlockFactory";
import { calculateBlockLabels } from "@editor/logic/engine/numberingEngine";

export const Canvas = () => {
  const { pages, blocks } = useStore();

  // Generamos el mapa de números (ej: { "id-123": "1.1 " })
  const labels = useMemo(
    () => calculateBlockLabels(pages, blocks),
    [pages, blocks],
  );

  return (
    <Box
      className="canvas-viewport"
      style={{
        backgroundColor: "#f1f3f5",
        height: "calc(100vh - 60px)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      {pages.map((page, index) => (
        <Page key={page.id} pageNumber={index + 1}>
          {page.blockIds.map((blockId) => {
            const blockData = blocks.find((b) => b.id === blockId);
            if (!blockData) return null;

            return (
              <BlockWrapper
                key={blockId}
                blockId={blockId}
                type={blockData.type}
              >
                {/* Pasamos la etiqueta calculada (si existe)
                 */}
                <BlockFactory block={blockData} label={labels[blockId]} />
              </BlockWrapper>
            );
          })}
        </Page>
      ))}
    </Box>
  );
};

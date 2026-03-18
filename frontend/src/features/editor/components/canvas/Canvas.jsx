// src/features/editor/components/canvas/Canvas.jsx
import React, { useMemo } from "react";
import { Box } from "@mantine/core";
import { useStore } from "@store";
import { Page } from "./Page";
import { BlockWrapper } from "../blocks/core/BlockWrapper";
import { BlockFactory } from "../blocks/core/BlockFactory";
import { calculateBlockLabels } from "@editor/logic/engine/numberingEngine";

export const Canvas = () => {
  // 1. Selectores específicos para evitar re-renders innecesarios
  const pages = useStore((s) => s.pages);
  const blocks = useStore((s) => s.blocks);

  // 2. Indexamos los bloques por ID para búsqueda O(1)
  const blocksMap = useMemo(() => {
    return blocks.reduce((acc, block) => {
      acc[block.id] = block;
      return acc;
    }, {});
  }, [blocks]);

  // 3. Mapa de números
  const labels = useMemo(
    () => calculateBlockLabels(pages, blocks),
    [pages, blocks],
  );

  return (
    <Box className="canvas-viewport" style={viewportStyle}>
      {pages.map((page, index) => (
        <Page key={page.id} pageNumber={index + 1}>
          {page.blockIds.map((blockId) => {
            const blockData = blocksMap[blockId]; // Búsqueda instantánea
            if (!blockData) return null;

            return (
              <BlockWrapper
                key={blockId}
                blockId={blockId}
                type={blockData.type}
              >
                <BlockFactory block={blockData} label={labels[blockId]} />
              </BlockWrapper>
            );
          })}
        </Page>
      ))}
    </Box>
  );
};

// --- ESTILOS EXTRAÍDOS ---
const viewportStyle = {
  backgroundColor: "#f1f3f5",
  height: "calc(100vh - 60px)",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px 0",
};

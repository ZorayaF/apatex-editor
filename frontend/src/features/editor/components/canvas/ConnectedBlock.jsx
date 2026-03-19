// src/features/editor/components/canvas/ConnectedBlock.jsx
import React, { useMemo } from "react";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow";
import { BlockWrapper } from "../blocks/core/BlockWrapper";
import { BlockFactory } from "../blocks/core/BlockFactory";
import { calculateBlockLabels } from "@editor/logic/engine/numberingEngine";

export const ConnectedBlock = React.memo(({ blockId }) => {
  // Selector atómico para los datos del bloque
  const blockData = useStore((s) => s.blocks.find((b) => b.id === blockId));

  // Pedimos las páginas y bloques de forma estable
  const { pages, blocks } = useStore(
    useShallow((s) => ({
      pages: s.pages,
      blocks: s.blocks,
    })),
  );

  const label = useMemo(() => {
    if (!blockData?.type.startsWith("h")) return null;
    const allLabels = calculateBlockLabels(pages, blocks);
    return allLabels[blockId];
  }, [pages, blocks, blockId, blockData?.type]);

  if (!blockData) return null;

  return (
    <BlockWrapper blockId={blockId} type={blockData.type}>
      <BlockFactory block={blockData} label={label} />
    </BlockWrapper>
  );
});

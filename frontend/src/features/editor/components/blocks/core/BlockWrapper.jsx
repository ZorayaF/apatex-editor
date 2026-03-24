// src/features/editor/components/blocks/core/BlockWrapper.jsx
import React from "react";
import { Box } from "@mantine/core";
import { useStore } from "@store";

export const BlockWrapper = ({ children, blockId }) => {
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const isSelected = selectedBlockId === blockId;

  return (
    <Box
      data-block-id={blockId}
      // Aplicamos la clase base y la clase de selección condicional
      className={`editor-block-wrapper ${isSelected ? "is-selected" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        paddingLeft: "15px",
        marginBottom: "4px",
      }}
    >
      {children}
    </Box>
  );
};

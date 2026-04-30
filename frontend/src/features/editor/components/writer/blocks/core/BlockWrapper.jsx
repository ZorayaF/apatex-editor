// src/features/editor/components/blocks/core/BlockWrapper.jsx
import React from "react";
import { Box } from "@mantine/core";
import { useStore } from "@store";

// Añadimos 'type' a las props
export const BlockWrapper = ({ children, blockId, type }) => {
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const isSelected = selectedBlockId === blockId;

  return (
    <Box
      data-block-id={blockId}
      data-block-type={type} // <--- ¡Nueva línea crítica para el motor!
      className={`editor-block-wrapper ${isSelected ? "is-selected" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        paddingLeft: "15px",
        marginBottom: "4px",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </Box>
  );
};

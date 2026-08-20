// src/features/editor/components/blocks/core/BlockWrapper.jsx
import React from "react";
import { Box } from "@mantine/core";
import { useStore } from "@store";

export const BlockWrapper = ({ children, blockId, type }) => {
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const isSelected = selectedBlockId === blockId;
  const isRunIn = type === "h4" || type === "h5";

  return (
    <Box
      data-block-id={blockId}
      data-block-type={type}
      className={`editor-block-wrapper ${isSelected ? "is-selected" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        marginBottom: "4px",
        borderRadius: "4px",
        transition: "background-color 0.15s ease",
        backgroundColor: isSelected ? "rgba(0, 0, 0, 0.015)" : "transparent",
      }}
    >
      {/* Estilos CSS aislados aplicados solo en el editor interactivo */}
      {isRunIn && (
        <style>{`
          .editor-block-wrapper[data-block-id="${blockId}"] [data-role="title"],
          .editor-block-wrapper[data-block-id="${blockId}"] [data-role="content"] {
            border-radius: 3px;
            padding: 1px 3px;
            transition: background-color 0.15s ease, outline 0.15s ease;
          }
          
          /* Estado en reposo: indicador tenue casi invisible */
          .editor-block-wrapper[data-block-id="${blockId}"] [data-role="title"] {
            outline: 1px dashed rgba(0, 0, 0, 0.15);
          }

          /* Estado enfocado: highlight muy sutil */
          .editor-block-wrapper[data-block-id="${blockId}"] [data-role="title"]:focus,
          .editor-block-wrapper[data-block-id="${blockId}"] [data-role="content"]:focus {
            background-color: rgba(34, 139, 230, 0.06);
            outline: 1px solid rgba(34, 139, 230, 0.35);
          }
        `}</style>
      )}

      {children}
    </Box>
  );
};

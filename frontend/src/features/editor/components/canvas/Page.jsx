// src/features/editor/components/canvas/Page.jsx
import React, { useRef, memo } from "react";
import { Paper, Box } from "@mantine/core";
import { useStore } from "@store";
import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  cmToPx,
  APA_CONFIG,
} from "@core/utils/measurements";
import { usePagePagination } from "@editor/hooks/usePagePagination";
import { ConnectedBlock } from "./ConnectedBlock";

export const Page = memo(({ pageId, pageNumber }) => {
  const pageContentRef = useRef(null);
  const { margins } = APA_CONFIG;

  // Obtenemos solo los blockIds de ESTA página
  const blockIds = useStore(
    (s) => s.pages.find((p) => p.id === pageId)?.blockIds || [],
  );
  const isActive = useStore((s) => s.activePageIndex === pageNumber - 1);
  const { setActivePage, setSelectedBlockId } = useStore();

  // La paginación ahora solo observa la lista de IDs de esta página
  usePagePagination(pageContentRef, blockIds, pageNumber);

  const handlePageClick = (e) => {
    if (e.target === e.currentTarget) {
      setActivePage(pageNumber - 1);
      setSelectedBlockId(null);
    }
  };

  return (
    <Paper
      radius={0}
      onClick={handlePageClick}
      style={getPageStyle(margins, isActive)}
    >
      <Box
        ref={pageContentRef}
        style={{ height: "100%", position: "relative" }}
      >
        <div style={{ pointerEvents: "auto" }}>
          {blockIds.map((id) => (
            <ConnectedBlock key={id} blockId={id} />
          ))}
        </div>
      </Box>

      {/* Footer simplificado */}
      <Box style={pageNumberStyle(isActive)}>{pageNumber}</Box>
    </Paper>
  );
});

// Estilos extraídos para evitar recrearlos en cada render
const getPageStyle = (margins, isActive) => ({
  width: `${PAGE_WIDTH_PX}px`,
  height: `${PAGE_HEIGHT_PX}px`,
  minHeight: `${PAGE_HEIGHT_PX}px`,
  maxHeight: `${PAGE_HEIGHT_PX}px`,
  padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
  backgroundColor: "white",
  margin: "0",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
  outline: isActive ? "2px solid #228be6" : "1px solid #e0e0e0",
});

const pageNumberStyle = (isActive) => ({
  position: "absolute",
  bottom: 20,
  right: 40,
  fontSize: "10pt",
  color: isActive ? "#228be6" : "#ccc",
  fontWeight: isActive ? "bold" : "normal",
});

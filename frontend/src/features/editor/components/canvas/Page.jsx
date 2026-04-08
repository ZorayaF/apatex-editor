// src/features/editor/components/canvas/Page.jsx
import React, { useRef, memo, useMemo } from "react";
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

export const Page = memo(({ pageId, pageNumber, allowedBlockIds }) => {
  const pageContentRef = useRef(null);
  const { margins } = APA_CONFIG;

  const page = useStore((s) => s.pages.find((p) => p.id === pageId));
  const rawBlockIds = page?.blockIds || [];

  // FILTRADO INTERNO: Si hay enfoque, solo mostramos los bloques permitidos
  const visibleBlockIds = useMemo(() => {
    if (!allowedBlockIds) return rawBlockIds;
    return rawBlockIds.filter((id) => allowedBlockIds.has(id));
  }, [rawBlockIds, allowedBlockIds]);

  const isActive = useStore((s) => s.activePageIndex === pageNumber - 1);
  const { setActivePage, setSelectedBlockId } = useStore();

  // La paginación sigue usando rawBlockIds para mantener el flujo del documento intacto
  usePagePagination(pageContentRef, rawBlockIds, pageNumber);

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
          {visibleBlockIds.map((id) => (
            <ConnectedBlock key={id} blockId={id} />
          ))}
        </div>
      </Box>

      <Box style={pageNumberStyle(isActive)}>{pageNumber}</Box>
    </Paper>
  );
});

// ... (tus funciones de estilo se mantienen iguales abajo)
const getPageStyle = (margins, isActive) => ({
  width: `${PAGE_WIDTH_PX}px`,
  height: `${PAGE_HEIGHT_PX}px`,
  minHeight: `${PAGE_HEIGHT_PX}px`,
  maxHeight: `${PAGE_HEIGHT_PX}px`,
  padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
  backgroundColor: "white",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
  outline: isActive ? "2px solid #228be6" : "1px solid #e0e0e0",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // Un toque de sombra para que se vea mejor en gris
});

const pageNumberStyle = (isActive) => ({
  position: "absolute",
  bottom: 20,
  right: 40,
  fontSize: "10pt",
  color: isActive ? "#228be6" : "#ccc",
  fontWeight: isActive ? "bold" : "normal",
});

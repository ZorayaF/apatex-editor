import React, { useRef, memo, useMemo } from "react";
import { Paper, Box } from "@mantine/core";
import { useStore } from "@store";
import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  cmToPx,
  APA_CONFIG,
} from "@core/utils/measurements";
import { usePagePagination } from "@hooks/usePagePagination";
import { ConnectedBlock } from "./ConnectedBlock";
import { calculateDocumentMap } from "@logic/engine/documentLayoutEngine";

export const Page = memo(({ pageId, pageNumber, allowedBlockIds }) => {
  const pageContentRef = useRef(null);
  const { margins } = APA_CONFIG;

  // 1. OBTENEMOS METADATOS Y CALCULAMOS EL OFFSET GLOBAL
  const projectMetadata = useStore((s) => s.projectMetadata);

  const docMap = useMemo(
    () => calculateDocumentMap(projectMetadata),
    [projectMetadata],
  );

  // 2. CÁLCULO DEL NÚMERO REAL
  // Si pageNumber es 1 (primera hoja del editor) y editorStartPage es 11,
  // la hoja mostrará "11".
  const realPageNumber = pageNumber + (docMap.editorStartPage - 1);

  const page = useStore((s) => s.pages.find((p) => p.id === pageId));
  const rawBlockIds = page?.blockIds || [];

  const visibleBlockIds = useMemo(() => {
    if (!allowedBlockIds) return rawBlockIds;
    return rawBlockIds.filter((id) => allowedBlockIds.has(id));
  }, [rawBlockIds, allowedBlockIds]);

  const isActive = useStore((s) => s.activePageIndex === pageNumber - 1);
  const { setActivePage, setSelectedBlockId } = useStore();

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

      {/* 3. MOSTRAMOS EL NÚMERO REAL CALCULADO */}
      <Box style={pageNumberStyle(isActive)}>{realPageNumber}</Box>
    </Paper>
  );
});

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
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
});

const pageNumberStyle = (isActive) => ({
  position: "absolute",
  bottom: 20,
  right: 40,
  fontSize: "10pt",
  color: isActive ? "#228be6" : "#ccc",
  fontWeight: isActive ? "bold" : "normal",
});

import React, { useRef } from "react";
import { Paper, Box } from "@mantine/core";
import { useStore } from "@store";
import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  cmToPx,
  APA_CONFIG,
} from "@core/utils/measurements";
import { usePagePagination } from "@editor/hooks/usePagePagination";

export const Page = ({ children, pageNumber }) => {
  const pageContentRef = useRef(null);
  const { margins } = APA_CONFIG;

  // Selectores limpios
  const activePageIndex = useStore((s) => s.activePageIndex);
  const setActivePage = useStore((s) => s.setActivePage);
  const setSelectedBlockId = useStore((s) => s.setSelectedBlockId);

  const isActive = activePageIndex === pageNumber - 1;

  // Delegamos la paginación al hook
  usePagePagination(pageContentRef, children, pageNumber);

  const handlePageClick = (e) => {
    if (e.target === e.currentTarget) {
      setActivePage(pageNumber - 1);
      setSelectedBlockId(null);
    }
  };

  // --- CONFIGURACIÓN DE ESTILOS (Fuera del return para legibilidad) ---
  const pageStyle = {
    // Dimensiones Estrictas
    width: `${PAGE_WIDTH_PX}px`,
    height: `${PAGE_HEIGHT_PX}px`,
    minHeight: `${PAGE_HEIGHT_PX}px`, // Esto evita que se reduzca
    maxHeight: `${PAGE_HEIGHT_PX}px`, // Esto evita que crezca de más

    // Márgenes internos (Padding)
    paddingTop: `${cmToPx(margins.top)}px`,
    paddingBottom: `${cmToPx(margins.bottom)}px`,
    paddingLeft: `${cmToPx(margins.left)}px`,
    paddingRight: `${cmToPx(margins.right)}px`,

    // Visual y Posicionamiento
    backgroundColor: "white",
    margin: "20px auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box", // Crucial para que el padding no sume al tamaño
    transition: "all 0.2s ease",
    outline: isActive ? "2px solid #228be6" : "1px solid #e0e0e0",
    boxShadow: isActive
      ? "0 10px 30px rgba(0,0,0,0.1)"
      : "0 2px 10px rgba(0,0,0,0.05)",
  };

  return (
    <Paper radius={0} onClick={handlePageClick} style={pageStyle}>
      {/* Área de contenido: Aquí es donde vive el BlockFactory */}
      <Box
        ref={pageContentRef}
        style={{ height: "100%", position: "relative", pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto" }}>{children}</div>
      </Box>

      {/* Footer de página */}
      <PageNumber indicator={pageNumber} active={isActive} />
    </Paper>
  );
};

// Sub-componente pequeño para no ensuciar el principal
const PageNumber = ({ indicator, active }) => (
  <Box
    style={{
      position: "absolute",
      bottom: 20,
      right: 40,
      fontSize: "10pt",
      color: active ? "#228be6" : "#ccc",
      fontWeight: active ? "bold" : "normal",
      userSelect: "none",
    }}
  >
    {indicator}
  </Box>
);

// src/features/editor/views/WritingView.jsx
import React from "react";
import { Box, ScrollArea } from "@mantine/core";
import { useStore } from "@store";
import { useEditor } from "../hooks/useEditor"; // <-- Importamos el hook de atajos
import { Canvas } from "@writer/canvas/Canvas";
import { WriterToolbar } from "@writer/header/WriterToolbar";
import { DocumentMap } from "@writer/navbar/DocumentMap";
import { Inspector } from "@writer/inspector/index.jsx";

export const WritingView = () => {
  // Inicializa los atajos de teclado globales (Ctrl+Z / Ctrl+Y)
  useEditor();

  const {
    isNavbarOpen,
    isInspectorOpen,
    navbarWidth = 260,
    setNavbarWidth,
    inspectorWidth = 320,
    setInspectorWidth,
  } = useStore();

  // --- HANDLERS DE REDIMENSIÓN CON EL CURSOR ---
  const handleNavbarResizeStart = (e) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent) => {
      if (typeof setNavbarWidth === "function") {
        setNavbarWidth(moveEvent.clientX);
      }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleInspectorResizeStart = (e) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent) => {
      if (typeof setInspectorWidth === "function") {
        const newWidth = window.innerWidth - moveEvent.clientX;
        setInspectorWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* 1. BARRA DE HERRAMIENTAS (100% Ancho fijo, justo bajo el header de la app) */}
      <Box
        bg="white"
        style={{
          height: 48,
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e9ecef",
          zIndex: 20,
          flexShrink: 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <WriterToolbar />
      </Box>

      {/* 2. ÁREA DE TRABAJO (PANEL IZQ + LIENZO + PANEL DER) */}
      <Box
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          height: "calc(100% - 48px)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* PANEL IZQUIERDO: Índice / Estructura */}
        {isNavbarOpen && (
          <Box
            bg="white"
            style={{
              width: navbarWidth,
              minWidth: 200,
              maxWidth: 450,
              height: "100%",
              borderRight: "1px solid #e9ecef",
              position: "relative",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              zIndex: 10,
            }}
          >
            <DocumentMap />
            {/* Tirador para redimensionar */}
            <Box
              onMouseDown={handleNavbarResizeStart}
              style={{
                position: "absolute",
                top: 0,
                right: -3,
                width: 6,
                height: "100%",
                cursor: "col-resize",
                zIndex: 30,
                userSelect: "none",
              }}
            />
          </Box>
        )}

        {/* LIENZO CENTRAL: Hojas con scroll independiente */}
        <Box
          style={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--mantine-color-gray-1)",
          }}
        >
          <ScrollArea
            style={{ flex: 1, width: "100%", height: "100%" }}
            type="auto"
            offsetScrollbars
          >
            <Box
              py={32}
              px={20}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <Canvas />
            </Box>
          </ScrollArea>
        </Box>

        {/* PANEL DERECHO: Herramientas / Inspector */}
        {isInspectorOpen && (
          <Box
            bg="white"
            style={{
              width: inspectorWidth,
              minWidth: 260,
              maxWidth: 550,
              height: "100%",
              borderLeft: "1px solid #e9ecef",
              position: "relative",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              zIndex: 10,
            }}
          >
            {/* Tirador para redimensionar */}
            <Box
              onMouseDown={handleInspectorResizeStart}
              style={{
                position: "absolute",
                top: 0,
                left: -3,
                width: 6,
                height: "100%",
                cursor: "col-resize",
                zIndex: 30,
                userSelect: "none",
              }}
            />
            <Inspector />
          </Box>
        )}
      </Box>
    </Box>
  );
};

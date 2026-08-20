// src/features/editor/views/ExportView.jsx
import React, { useState, useRef, useMemo } from "react";
import { Box } from "@mantine/core";
import {
  ExportHeader,
  ExportSidebar,
  ExportViewer,
  ExportModal,
} from "../components/export";
import classes from "./ExportView.module.css";

const ALL_SECTIONS = {
  titlePage: true,
  contraportada: true,
  aceptacion: true,
  reglamento: true,
  dedicatoria: true,
  agradecimientos: true,
  toc: true,
  glosario: true,
  resumen: true,
  abstract: true,
  introduccion: true,
  body: true,
  references: true,
  annexes: true,
};

export const ExportView = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [targetPageInput, setTargetPageInput] = useState(1);
  const [exportScope, setExportScope] = useState("all"); // 'all' | 'current' | 'page_range'
  const [pageRange, setPageRange] = useState("");

  // Secciones que el usuario filtra en pantalla mediante el panel lateral
  const [screenSections, setScreenSections] = useState({ ...ALL_SECTIONS });

  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToPage = (pageNum) => {
    const pageElement = document.getElementById(`doc-page-${pageNum}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSetPreset = (preset) => {
    if (preset === "all") {
      setScreenSections({ ...ALL_SECTIONS });
    } else if (preset === "body_only") {
      setScreenSections({
        titlePage: false,
        contraportada: false,
        aceptacion: false,
        reglamento: false,
        dedicatoria: false,
        agradecimientos: false,
        toc: false,
        glosario: false,
        resumen: false,
        abstract: false,
        introduccion: false,
        body: true,
        references: true,
        annexes: true,
      });
    } else if (preset === "prelims_only") {
      setScreenSections({
        titlePage: true,
        contraportada: true,
        aceptacion: true,
        reglamento: true,
        dedicatoria: true,
        agradecimientos: true,
        toc: true,
        glosario: true,
        resumen: true,
        abstract: true,
        introduccion: true,
        body: false,
        references: false,
        annexes: false,
      });
    }
  };

  const handleToggleSection = (key) => {
    setScreenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Determinar qué secciones se incluirán en el lienzo de impresión
  const printSections = useMemo(() => {
    if (exportScope === "all" || exportScope === "page_range") {
      return ALL_SECTIONS;
    }
    return screenSections;
  }, [exportScope, screenSections]);

  const printRange = useMemo(() => {
    if (exportScope === "page_range") {
      return pageRange;
    }
    return "";
  }, [exportScope, pageRange]);

  // Ejecución directa de la exportación
  const handleExecuteExport = () => {
    setIsExportModalOpen(false);
    setIsExporting(true);

    if (
      document.activeElement &&
      typeof document.activeElement.blur === "function"
    ) {
      document.activeElement.blur();
    }

    let targetFileName = "Documento_Completo_APA7";
    if (exportScope === "current") {
      targetFileName = "Documento_Personalizado_APA7";
    } else if (exportScope === "page_range") {
      targetFileName = `Documento_Paginas_${pageRange.replace(/[\s,]+/g, "_")}`;
    }

    // Pequeño retardo para asegurar que el modal se cierre antes de capturar
    setTimeout(() => {
      if (window.electronAPI?.exportToPDF) {
        window.electronAPI.exportToPDF(targetFileName);
      } else {
        window.print();
      }
      setIsExporting(false);
    }, 200);
  };

  return (
    <Box className={classes.root}>
      {/* 1. Header */}
      <ExportHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isExporting={isExporting}
      />

      {/* 2. Cuerpo: Sidebar + Viewer */}
      <Box className={classes.bodyWrapper}>
        {isSidebarOpen && (
          <ExportSidebar
            targetPage={targetPageInput}
            onChangeTargetPage={setTargetPageInput}
            onScrollToPage={scrollToPage}
            sections={screenSections}
            onToggleSection={handleToggleSection}
            onSetPreset={handleSetPreset}
          />
        )}

        <ExportViewer
          screenSections={screenSections}
          printSections={printSections}
          printRange={printRange}
          scrollContainerRef={scrollContainerRef}
          onScroll={handleScroll}
          showScrollTop={showScrollTop}
          onScrollToTop={scrollToTop}
        />
      </Box>

      {/* 3. Modal de Configuración */}
      <ExportModal
        opened={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportScope={exportScope}
        onChangeExportScope={setExportScope}
        pageRange={pageRange}
        onChangePageRange={setPageRange}
        onConfirmExport={handleExecuteExport}
      />
    </Box>
  );
};

// src/features/editor/views/ExportView.jsx
import React, { useState, useRef } from "react";
import { Box } from "@mantine/core";
import {
  ExportHeader,
  ExportSidebar,
  ExportViewer,
  ExportModal,
} from "../components/export";
import classes from "./ExportView.module.css";

export const ExportView = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [targetPageInput, setTargetPageInput] = useState(1);
  const [exportScope, setExportScope] = useState("current");
  const [pageRange, setPageRange] = useState("");

  const [sections, setSections] = useState({
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
  });

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
      setSections({
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
      });
    } else if (preset === "body_only") {
      setSections({
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
      setSections({
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
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExecuteExport = () => {
    setIsExportModalOpen(false);
    setIsExporting(true);

    if (
      document.activeElement &&
      typeof document.activeElement.blur === "function"
    ) {
      document.activeElement.blur();
    }

    const targetFileName =
      exportScope === "all"
        ? "Documento_Completo_APA7"
        : exportScope === "page_range"
          ? `Documento_Paginas_${pageRange.replace(/[\s,]+/g, "_")}`
          : "Documento_Compilado_APA7";

    setTimeout(() => {
      if (window.electronAPI?.exportToPDF) {
        window.electronAPI.exportToPDF(targetFileName);
      } else {
        window.print();
      }
      setIsExporting(false);
    }, 400);
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
            sections={sections}
            onToggleSection={handleToggleSection}
            onSetPreset={handleSetPreset}
          />
        )}

        <ExportViewer
          sections={sections}
          scrollContainerRef={scrollContainerRef}
          onScroll={handleScroll}
          showScrollTop={showScrollTop}
          onScrollToTop={scrollToTop}
        />
      </Box>

      {/* 3. Modal */}
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

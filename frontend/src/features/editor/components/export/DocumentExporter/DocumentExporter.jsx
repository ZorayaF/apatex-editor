// src/features/editor/components/export/DocumentExporter/DocumentExporter.jsx
import React from "react";
import { useStore } from "@store";
import { buildDocumentPages } from "@logic/engine/document/buildDocumentPages";

// Vistas previas
import { TitlePagePreview } from "@config/preview/TitlePagePreview";
import { AceptacionPagePreview } from "@config/preview/AceptacionPagePreview";
import { SimplePagePreview } from "@config/preview/SimplePagePreview";
import { PrelimPagePreview } from "@config/preview/PrelimPagePreview";
import { GlossaryPagePreview } from "@config/preview/GlossaryPagePreview";
import { TableOfContents } from "@config/preview/TableOfContents";
import { AnnexPagePreview } from "@config/preview/AnnexPagePreview";
import { PageLayout } from "@config/preview/PageLayout/PageLayout";
import { BibliographyPreview } from "@config/preview/BibliographyPreview";
import { ConnectedBlock } from "@writer/canvas/ConnectedBlock";
import classes from "./DocumentExporter.module.css";

const parsePageRange = (rangeStr) => {
  if (!rangeStr || !rangeStr.trim()) return null;
  const pagesSet = new Set();
  const parts = rangeStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed
        .split("-")
        .map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          pagesSet.add(i);
        }
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        pagesSet.add(num);
      }
    }
  }
  return pagesSet.size > 0 ? pagesSet : null;
};

export const DocumentExporter = ({ sections = {}, pageRange = "" }) => {
  const {
    pages = [],
    blocks = [],
    sources = [],
    projectMetadata = {},
    preliminares: storePreliminares,
  } = useStore();

  const preliminares = storePreliminares || projectMetadata?.preliminares || {};
  const metadataWithPrelim = { ...projectMetadata, preliminares };

  // 1. Construcción del mapa secuencial de páginas reales
  const documentPages = buildDocumentPages({
    projectMetadata: metadataWithPrelim,
    canvasPages: pages,
    blocks,
    sources,
    activeSections: sections,
  });

  const allowedPagesSet = parsePageRange(pageRange);

  // 2. Renderizador modular por tipo de página
  const renderPageContent = (page) => {
    switch (page.type) {
      case "portada":
        return (
          <TitlePagePreview
            isContraportada={false}
            data={projectMetadata}
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "contraportada":
        return (
          <TitlePagePreview
            isContraportada={true}
            data={projectMetadata}
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "aceptacion":
        return (
          <AceptacionPagePreview
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "reglamento":
        return (
          <SimplePagePreview
            type="reglamento"
            data={{
              content:
                "“Únicamente el graduando es responsable de las ideas expuestas en el presente trabajo”. (Lineamientos constitucionales, legales e institucionales que rigen la propiedad intelectual).",
            }}
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "dedicatoria":
      case "agradecimientos":
      case "introduccion":
        return (
          <SimplePagePreview
            type={page.type}
            data={page.data}
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "toc_contenido":
        return <TableOfContents sections={sections} />;
      case "toc_tablas":
      case "toc_figuras":
      case "toc_anexos":
        // TableOfContents gestiona las hojas secundarias de índices dentro de su bloque
        return null;
      case "glosario":
        return (
          <GlossaryPagePreview
            terms={page.data?.terms || []}
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "resumen":
      case "abstract":
        return (
          <PrelimPagePreview
            type={page.type}
            data={page.data}
            projectTitle={projectMetadata?.tituloProyecto}
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "canvas_page":
        return (
          <PageLayout pageNumber={page.pageNumber} metadata={projectMetadata}>
            <div style={{ pointerEvents: "none", height: "100%" }}>
              {(page.blockIds || []).map((id) => (
                <ConnectedBlock key={id} blockId={id} />
              ))}
            </div>
          </PageLayout>
        );
      case "referencias":
        return (
          <BibliographyPreview
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      case "anexos_portada":
        return (
          <PageLayout pageNumber={page.pageNumber} metadata={projectMetadata}>
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "12pt", fontWeight: "bold" }}>Anexos</div>
            </div>
          </PageLayout>
        );
      case "anexo_item":
        return (
          <AnnexPagePreview
            item={page.data}
            metadata={projectMetadata}
            pageNumber={page.pageNumber}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`print-only-container ${classes.exportCanvas}`}>
      {documentPages.map((page) => {
        // Omite hojas de índices suplementarias porque TableOfContents las genera
        if (["toc_tablas", "toc_figuras", "toc_anexos"].includes(page.type)) {
          return null;
        }

        // Filtro por rango de página
        if (allowedPagesSet && !allowedPagesSet.has(page.pageNumber)) {
          return null;
        }

        const content = renderPageContent(page);
        if (!content) return null;

        return (
          <div
            key={`doc-page-${page.pageNumber}`}
            id={`doc-page-${page.pageNumber}`}
            data-page={page.pageNumber}
            className={classes.pageItemWrapper}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

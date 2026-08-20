// src/features/editor/components/export/DocumentExporter/DocumentExporter.jsx
import React from "react";
import { useStore } from "@store";

// Importaciones de Vistas Previas
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
    projectMetadata = {},
    preliminares: storePreliminares,
  } = useStore();

  const preliminares = storePreliminares || projectMetadata?.preliminares || {};
  const allowedPagesSet = parsePageRange(pageRange);

  let globalPageCounter = 1;

  const wrapPage = (pageNum, element) => {
    // Si hay un rango definido y esta página no está incluida, no la renderizamos
    if (allowedPagesSet && !allowedPagesSet.has(pageNum)) {
      return null;
    }

    return (
      <div
        key={`page-wrapper-${pageNum}`}
        id={`doc-page-${pageNum}`}
        data-page={pageNum}
        className={classes.pageItemWrapper}
      >
        {element}
      </div>
    );
  };

  return (
    <div className={`print-only-container ${classes.exportCanvas}`}>
      {/* 1. SECCIONES PRELIMINARES */}
      {sections.titlePage &&
        wrapPage(
          globalPageCounter,
          <TitlePagePreview
            isContraportada={false}
            data={projectMetadata}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.contraportada &&
        wrapPage(
          globalPageCounter,
          <TitlePagePreview
            isContraportada={true}
            data={projectMetadata}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.aceptacion &&
        preliminares.aceptacion?.enabled &&
        wrapPage(
          globalPageCounter,
          <AceptacionPagePreview
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.reglamento &&
        preliminares.reglamento?.enabled &&
        wrapPage(
          globalPageCounter,
          <SimplePagePreview
            type="reglamento"
            data={{
              content:
                "“Únicamente el graduando es responsable de las ideas expuestas en el presente trabajo”. (Lineamientos constitucionales, legales e institucionales que rigen la propiedad intelectual).",
            }}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.dedicatoria &&
        preliminares.dedicatoria?.enabled &&
        wrapPage(
          globalPageCounter,
          <SimplePagePreview
            type="dedicatoria"
            data={preliminares.dedicatoria}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.agradecimientos &&
        preliminares.agradecimientos?.enabled &&
        wrapPage(
          globalPageCounter,
          <SimplePagePreview
            type="agradecimientos"
            data={preliminares.agradecimientos}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.toc &&
        wrapPage(
          globalPageCounter,
          <>
            <TableOfContents startPage={globalPageCounter} />
            <div style={{ display: "none" }}>{globalPageCounter++}</div>
          </>,
        )}

      {sections.glosario &&
        preliminares.glosario?.enabled &&
        wrapPage(
          globalPageCounter,
          <GlossaryPagePreview
            terms={preliminares.glosario.terms}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.resumen &&
        preliminares.resumen?.enabled &&
        wrapPage(
          globalPageCounter,
          <PrelimPagePreview
            type="resumen"
            data={preliminares.resumen}
            projectTitle={projectMetadata?.tituloProyecto}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.abstract &&
        preliminares.abstract?.enabled &&
        wrapPage(
          globalPageCounter,
          <PrelimPagePreview
            type="abstract"
            data={preliminares.abstract}
            projectTitle={projectMetadata?.tituloProyecto}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {sections.introduccion &&
        preliminares.introduccion?.content?.trim().length > 0 &&
        wrapPage(
          globalPageCounter,
          <SimplePagePreview
            type="introduccion"
            data={preliminares.introduccion}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {/* 2. CUERPO DE REDACCIÓN */}
      {sections.body &&
        pages.map((page) => {
          const currentPageNum = globalPageCounter++;
          return wrapPage(
            currentPageNum,
            <PageLayout
              key={page.id}
              pageNumber={currentPageNum}
              metadata={projectMetadata}
            >
              <div style={{ pointerEvents: "none", height: "100%" }}>
                {page.blockIds.map((id) => (
                  <ConnectedBlock key={id} blockId={id} />
                ))}
              </div>
            </PageLayout>,
          );
        })}

      {/* 3. REFERENCIAS BIBLIOGRÁFICAS */}
      {sections.references &&
        wrapPage(
          globalPageCounter,
          <BibliographyPreview
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {/* 4. ANEXOS */}
      {sections.annexes &&
        preliminares?.anexos?.enabled &&
        preliminares?.anexos?.items?.length > 0 && (
          <>
            {wrapPage(
              globalPageCounter,
              <PageLayout
                pageNumber={globalPageCounter++}
                metadata={projectMetadata}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: "12pt", fontWeight: "bold" }}>
                    Anexos
                  </div>
                </div>
              </PageLayout>,
            )}

            {preliminares.anexos.items.map((anexo, index) => {
              const currentAnnexPage = globalPageCounter++;
              return wrapPage(
                currentAnnexPage,
                <AnnexPagePreview
                  key={anexo.id || index}
                  item={anexo}
                  metadata={projectMetadata}
                  pageNumber={currentAnnexPage}
                />,
              );
            })}
          </>
        )}
    </div>
  );
};

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

export const DocumentExporter = ({
  sections = {
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
  },
}) => {
  const {
    pages = [],
    projectMetadata = {},
    preliminares: storePreliminares,
  } = useStore();

  const preliminares = storePreliminares || projectMetadata?.preliminares || {};

  let globalPageCounter = 1;

  // Envoltorio con ID para que el scroll a página funcione con precisión
  const wrapPage = (pageNum, element) => (
    <div
      key={`page-wrapper-${pageNum}`}
      id={`doc-page-${pageNum}`}
      data-page={pageNum}
    >
      {element}
    </div>
  );

  return (
    <div className={`print-only-container ${classes.exportCanvas}`}>
      {/* ============================================================ */}
      {/* 1. SECCIONES PRELIMINARES                                    */}
      {/* ============================================================ */}

      {/* 1.1 Portada */}
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

      {/* 1.2 Contraportada */}
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

      {/* 1.3 Aceptación */}
      {sections.aceptacion &&
        preliminares.aceptacion?.enabled &&
        wrapPage(
          globalPageCounter,
          <AceptacionPagePreview
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {/* 1.4 Nota de Reglamento */}
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

      {/* 1.5 Dedicatoria */}
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

      {/* 1.6 Agradecimientos */}
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

      {/* 1.7 Tabla de Contenido */}
      {sections.toc &&
        wrapPage(
          globalPageCounter,
          <>
            <TableOfContents startPage={globalPageCounter} />
            <div style={{ display: "none" }}>{globalPageCounter++}</div>
          </>,
        )}

      {/* 1.8 Glosario */}
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

      {/* 1.9 Resumen */}
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

      {/* 1.10 Abstract */}
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

      {/* 1.11 Introducción */}
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

      {/* ============================================================ */}
      {/* 2. CUERPO DE REDACCIÓN (Canvas)                              */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* 3. REFERENCIAS BIBLIOGRÁFICAS                                */}
      {/* ============================================================ */}
      {sections.references &&
        wrapPage(
          globalPageCounter,
          <BibliographyPreview
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />,
        )}

      {/* ============================================================ */}
      {/* 4. SECCIÓN DE ANEXOS                                         */}
      {/* ============================================================ */}
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

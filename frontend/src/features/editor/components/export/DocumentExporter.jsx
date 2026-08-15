// src/features/editor/components/export/DocumentExporter.jsx
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

export const DocumentExporter = ({ exportMode = "all" }) => {
  // Extraemos los estados globales de la raíz del Store
  const {
    pages = [],
    projectMetadata = {},
    preliminares: storePreliminares,
  } = useStore();

  // Buscamos los preliminares estructurados
  const preliminares = storePreliminares || projectMetadata?.preliminares || {};

  // Banderas de visibilidad según el modo seleccionado
  const showPrelims = exportMode === "all" || exportMode === "prelims";
  const showBody = exportMode === "all" || exportMode === "body";

  // CONTADOR DE PÁGINAS (Inicia en 1 para el segmento activo)
  let globalPageCounter = 1;

  return (
    <div className={`print-only-container ${classes.exportCanvas}`}>
      {/* ============================================================ */}
      {/* 1. SECCIÓN PRELIMINAR (Portada, Aprobación, TOC, Glosario...) */}
      {/* ============================================================ */}
      {showPrelims && (
        <>
          {/* 1. PORTADA */}
          <TitlePagePreview
            isContraportada={false}
            data={projectMetadata}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />

          {/* 1b. CONTRAPORTADA */}
          <TitlePagePreview
            isContraportada={true}
            data={projectMetadata}
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />

          {/* 2. ACEPTACIÓN */}
          {preliminares.aceptacion?.enabled && (
            <AceptacionPagePreview
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}

          {/* 2b. NOTA DE REGLAMENTO */}
          {preliminares.reglamento?.enabled && (
            <SimplePagePreview
              type="reglamento"
              data={{
                content:
                  "“Únicamente el graduando es responsable de las ideas expuestas en el presente trabajo”. (Lineamientos constitucionales, legales e institucionales que rigen la propiedad intelectual).",
              }}
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}

          {/* 3. DEDICATORIA */}
          {preliminares.dedicatoria?.enabled && (
            <SimplePagePreview
              type="dedicatoria"
              data={preliminares.dedicatoria}
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}

          {/* 4. AGRADECIMIENTOS */}
          {preliminares.agradecimientos?.enabled && (
            <SimplePagePreview
              type="agradecimientos"
              data={preliminares.agradecimientos}
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}

          {/* 7. TABLA DE CONTENIDO */}
          <TableOfContents startPage={globalPageCounter} />
          <div style={{ display: "none" }}>{globalPageCounter++}</div>

          {/* 8. GLOSARIO */}
          {preliminares.glosario?.enabled && (
            <GlossaryPagePreview
              terms={preliminares.glosario.terms}
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}

          {/* 5. RESUMEN */}
          {preliminares.resumen?.enabled && (
            <PrelimPagePreview
              type="resumen"
              data={preliminares.resumen}
              projectTitle={projectMetadata?.tituloProyecto}
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}

          {/* 6. ABSTRACT */}
          {preliminares.abstract?.enabled && (
            <PrelimPagePreview
              type="abstract"
              data={preliminares.abstract}
              projectTitle={projectMetadata?.tituloProyecto}
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}

          {/* 8b. INTRODUCCIÓN */}
          {preliminares.introduccion?.content?.trim().length > 0 && (
            <SimplePagePreview
              type="introduccion"
              data={preliminares.introduccion}
              metadata={projectMetadata}
              pageNumber={globalPageCounter++}
            />
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 2. CUERPO DEL DOCUMENTO, BIBLIOGRAFÍA Y ANEXOS              */}
      {/* ============================================================ */}
      {showBody && (
        <>
          {/* 9. PÁGINAS DEL LIENZO (Canvas) */}
          {pages.map((page) => {
            const currentArabicPage = globalPageCounter++;
            return (
              <PageLayout
                key={page.id}
                pageNumber={currentArabicPage}
                metadata={projectMetadata}
              >
                <div style={{ pointerEvents: "none", height: "100%" }}>
                  {page.blockIds.map((id) => (
                    <ConnectedBlock key={id} blockId={id} />
                  ))}
                </div>
              </PageLayout>
            );
          })}

          {/* 10. REFERENCIAS BIBLIOGRÁFICAS */}
          <BibliographyPreview
            metadata={projectMetadata}
            pageNumber={globalPageCounter++}
          />

          {/* 11. SECCIÓN DE ANEXOS */}
          {preliminares?.anexos?.enabled &&
            preliminares?.anexos?.items?.length > 0 && (
              <>
                {/* 11.1 PÁGINA SEPARADORA DE ANEXOS */}
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
                </PageLayout>

                {/* 11.2 PÁGINAS INDIVIDUALES DE ANEXOS */}
                {preliminares.anexos.items.map((anexo, index) => (
                  <AnnexPagePreview
                    key={anexo.id || index}
                    item={anexo}
                    metadata={projectMetadata}
                    pageNumber={globalPageCounter++}
                  />
                ))}
              </>
            )}
        </>
      )}
    </div>
  );
};

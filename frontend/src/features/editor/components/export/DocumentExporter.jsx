import React from "react";
import { useStore } from "@store";

// Importaciones
import { TitlePagePreview } from "@config/preview/TitlePagePreview";
import { AceptacionPagePreview } from "@config/preview/AceptacionPagePreview";
import { SimplePagePreview } from "@config/preview/SimplePagePreview";
import { PrelimPagePreview } from "@config/preview/PrelimPagePreview";
import { GlossaryPagePreview } from "@config/preview/GlossaryPagePreview";
import { TableOfContents } from "@config/preview/TableOfContents";
import { PageLayout } from "@config/preview/PageLayout/PageLayout";
import { BibliographyPreview } from "@config/preview/BibliographyPreview";
import { ConnectedBlock } from "@writer/canvas/ConnectedBlock";
import classes from "./DocumentExporter.module.css";

export const DocumentExporter = () => {
  // 1. EXTRAEMOS DE LA RAÍZ (Corrección del error de estado)
  const {
    pages,
    projectMetadata,
    preliminares: storePreliminares,
  } = useStore();

  // 2. BUSCAMOS LOS PRELIMINARES (Por si están en la raíz o dentro del metadata)
  const preliminares = storePreliminares || projectMetadata?.preliminares || {};

  // INICIAMOS EL CONTADOR UNIVERSAL ÁRABE
  let globalPageCounter = 1;

  return (
    <div className={`print-only-container ${classes.exportCanvas}`}>
      {/* 1. PORTADA */}
      <TitlePagePreview
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

      {/* 3. DEDICATORIA (Corrección de props: type y data) */}
      {preliminares.dedicatoria?.enabled && (
        <SimplePagePreview
          type="dedicatoria"
          data={preliminares.dedicatoria}
          metadata={projectMetadata}
          pageNumber={globalPageCounter++}
        />
      )}

      {/* 4. AGRADECIMIENTOS (Corrección de props: type y data) */}
      {preliminares.agradecimientos?.enabled && (
        <SimplePagePreview
          type="agradecimientos"
          data={preliminares.agradecimientos}
          metadata={projectMetadata}
          pageNumber={globalPageCounter++}
        />
      )}

      {/* 5. RESUMEN (Corrección de props: type, data y projectTitle) */}
      {preliminares.resumen?.enabled && (
        <PrelimPagePreview
          type="resumen"
          data={preliminares.resumen}
          projectTitle={projectMetadata?.tituloProyecto}
          metadata={projectMetadata}
          pageNumber={globalPageCounter++}
        />
      )}

      {/* 6. ABSTRACT (Corrección de props: type, data y projectTitle) */}
      {preliminares.abstract?.enabled && (
        <PrelimPagePreview
          type="abstract"
          data={preliminares.abstract}
          projectTitle={projectMetadata?.tituloProyecto}
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

      {/* 9. CUERPO DEL DOCUMENTO */}
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

      {/* 10. REFERENCIAS */}
      <BibliographyPreview
        metadata={projectMetadata}
        pageNumber={globalPageCounter++}
      />
    </div>
  );
};

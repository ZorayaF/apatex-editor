import { useStore } from "@store";

// Importaciones
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

export const DocumentExporter = () => {
  // Extraemos los estados globales de la raíz del Store
  const {
    pages,
    projectMetadata,
    preliminares: storePreliminares,
  } = useStore();

  // Buscamos los preliminares estructurados
  const preliminares = storePreliminares || projectMetadata?.preliminares || {};

  // INICIAMOS EL CONTADOR UNIVERSAL ÁRABE (Inicia en 1)
  let globalPageCounter = 1;

  return (
    <div className={`print-only-container ${classes.exportCanvas}`}>
      {/* 1. PORTADA (Página 1) */}
      <TitlePagePreview
        isContraportada={false}
        data={projectMetadata}
        metadata={projectMetadata}
        pageNumber={globalPageCounter++}
      />

      {/* 1b. CONTRAPORTADA (Página 2 - Incluye Grado Objetivo y Director) */}
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
      {/* 2b. NOTA DE REGLAMENTO  */}
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
      {/* 7. TABLA DE CONTENIDO (Pasa el valor actual del contador como inicio) */}
      <TableOfContents startPage={globalPageCounter} />
      {/* Sincronizamos el contador global simulando el avance por el layout interno del TOC */}
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
      {/* 8b. INTRODUCCIÓN (TU NUEVA PÁGINA) */}
      {preliminares.introduccion?.content?.trim().length > 0 && (
        <SimplePagePreview
          type="introduccion"
          data={preliminares.introduccion}
          metadata={projectMetadata}
          pageNumber={globalPageCounter++}
        />
      )}

      {/* 9. CUERPO DEL DOCUMENTO (Páginas del Editor Canvas) */}
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
      {/* --- 9. SECCIÓN DE ANEXOS (Renderizado Dinámico) --- */}
      {preliminares?.anexos?.enabled &&
        preliminares?.anexos?.items?.length > 0 && (
          <>
            {/* 9.1 PÁGINA SEPARADORA DE ANEXOS (Con layout real para el PDF) */}
            <PageLayout metadata={projectMetadata}>
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

            {/* 9.2 MAPEO DE TODAS LAS PÁGINAS DE ANEXOS CREADAS */}
            {preliminares.anexos.items.map((anexo, index) => (
              <AnnexPagePreview
                key={anexo.id || index}
                item={anexo}
                metadata={projectMetadata}
                // Si tienes un docMap configurado, se pasará automáticamente aquí
              />
            ))}
          </>
        )}
    </div>
  );
};

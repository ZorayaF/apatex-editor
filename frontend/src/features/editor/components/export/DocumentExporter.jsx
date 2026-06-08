import { useStore } from "@store";
import { TitlePagePreview } from "@config/preview/TitlePagePreview";
import { AceptacionPagePreview } from "@config/preview/AceptacionPagePreview";
import { TableOfContents } from "@config/preview/TableOfContents";
import { PageLayout } from "@config/preview/PageLayout/PageLayout";
import { BibliographyPreview } from "@config/preview/BibliographyPreview";

// 1. Importamos ConnectedBlock en lugar de CanvasPageContent
import { ConnectedBlock } from "@writer/canvas/ConnectedBlock";

export const DocumentExporter = () => {
  // 2. Ya no necesitamos 'blocks' aquí, ConnectedBlock se encarga de eso
  const { pages, projectMetadata, preliminares } = useStore();

  return (
    <div className="print-only-container">
      {/* --- SECCIÓN 1: PRELIMINARES --- */}
      <TitlePagePreview metadata={projectMetadata} />

      {preliminares?.aceptacion?.enabled && (
        <AceptacionPagePreview metadata={projectMetadata} />
      )}

      {/* Aquí puedes añadir Dedicatoria, Agradecimientos, Resumen, etc. */}

      <TableOfContents />

      {/* --- SECCIÓN 2: CUERPO DEL DOCUMENTO (Redacción Real) --- */}
      {pages.map((page) => (
        <PageLayout
          key={page.id}
          pageNumber={page.pageNumber}
          metadata={projectMetadata}
        >
          {/* Iteramos directamente sobre los IDs renderizando ConnectedBlocks */}
          <div style={{ pointerEvents: "none" }}>
            {" "}
            {/* pointerEvents none evita que se pueda editar en el PDF */}
            {page.blockIds.map((id) => (
              <ConnectedBlock key={id} blockId={id} />
            ))}
          </div>
        </PageLayout>
      ))}

      {/* --- SECCIÓN 3: REFERENCIAS --- */}
      <BibliographyPreview />
    </div>
  );
};

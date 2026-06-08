import { useStore } from "@store";
import { TitlePagePreview } from "@config/preview/TitlePagePreview";
import { AceptacionPagePreview } from "@config/preview/AceptacionPagePreview";
import { TableOfContents } from "@config/preview/TableOfContents";
import { PageLayout } from "@config/preview/PageLayout/PageLayout";
import { BibliographyPreview } from "@config/preview/BibliographyPreview";
// Import your block renderer here (whatever component maps a block array to UI)
import { Canvas } from "@writer/canvas/Canvas";

export const DocumentExporter = () => {
  const { pages, projectMetadata, preliminares } = useStore();

  return (
    <div className="print-only-container">
      {/* 1. PORTADA */}
      <TitlePagePreview metadata={projectMetadata} />

      {/* 2. PRELIMINARES (Condicionales) */}
      {preliminares?.aceptacion?.enabled && (
        <AceptacionPagePreview metadata={projectMetadata} />
      )}
      {/* Añade dedicatoria, agradecimientos, etc. aquí de la misma forma */}

      {/* 3. ÍNDICES */}
      <TableOfContents />

      {/* 4. CUERPO PRINCIPAL DEL DOCUMENTO (Usando tu estado global ya paginado) */}
      {pages.map((page) => (
        <PageLayout
          key={page.id}
          pageNumber={page.pageNumber}
          metadata={projectMetadata}
        >
          {/* Este componente renderiza los bloques de texto, tablas, figuras de esa página específica */}
          <Canvas blocks={page.blocks} />
        </PageLayout>
      ))}

      {/* 5. REFERENCIAS */}
      <BibliographyPreview />
    </div>
  );
};

import { useStore } from "@store";
import { renderSourceAPA } from "@logic/engine/bibliographyRenderer";
import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./BibliographyPreview.module.css";

// 1. Añadimos pageNumber a los props recibidos
export const BibliographyPreview = ({ metadata, pageNumber }) => {
  const { blocks, sources } = useStore();

  // Lógica algorítmica de escaneo de referencias citadas (Inalterada y robusta)
  const usedIds = Array.from(
    new Set(
      blocks.flatMap((b) => {
        const matches = b.content?.matchAll(/\(\(ref:([\w-]+)/g);
        return matches ? Array.from(matches, (m) => m[1]) : [];
      }),
    ),
  );

  const usedSources = sources
    .filter((s) => usedIds.includes(s.id))
    .sort((a, b) => (a.author || "").localeCompare(b.author || ""));

  // 2. LÓGICA INTELIGENTE: Usamos el prop de exportación, o el fallback del docMap/"R"
  const finalPageNumber = pageNumber || metadata?._docMap?.referencias || "R";

  return (
    // 3. Pasamos el finalPageNumber al PageLayout
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* TÍTULO EN NEGRITA Y CENTRADO */}
      <h1 className={classes.bibliographyTitle}>Referencias</h1>

      {/* FLUJO DE REFERENCIAS BIBLIOGRÁFICAS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {usedSources.length === 0 ? (
          <p className={classes.emptyNotice}>
            Las referencias aparecerán aquí automáticamente cuando insertes
            citas en el texto del editor.
          </p>
        ) : (
          usedSources.map((source) => (
            <div
              key={source.id}
              className={classes.referenceItem}
              dangerouslySetInnerHTML={{ __html: renderSourceAPA(source) }}
            />
          ))
        )}
      </div>
    </PageLayout>
  );
};

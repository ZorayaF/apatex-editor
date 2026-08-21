// src/features/editor/components/config/preview/BibliographyPreview/BibliographyPreview.jsx
import React from "react";
import { PageLayout } from "../PageLayout/PageLayout";
import { useStore } from "@store";
import { renderSourceAPA } from "@logic/engine/bibliographyRenderer";
import classes from "../PrelimPagePreview/PrelimPagePreview.module.css";

export const BibliographyPreview = ({ metadata, pageNumber }) => {
  const { sources } = useStore();

  // Orden alfabético estricto APA
  const sortedSources = [...(sources || [])].sort((a, b) => {
    const authorA = (a.author || a.title || "Anónimo").toLowerCase();
    const authorB = (b.author || b.title || "Anónimo").toLowerCase();
    return authorA.localeCompare(authorB);
  });

  const finalPageNumber = pageNumber || metadata?._docMap?.referencias || "10";

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* TÍTULO CENTRADO Y EN NEGRITA */}
      <h1
        style={{
          fontFamily: "var(--apa-font, 'Times New Roman', serif)",
          fontSize: "12pt",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 0,
          marginBottom: "1.5em", // Espacio simple antes de iniciar las referencias
          lineHeight: 1.5,
        }}
      >
        Referencias
      </h1>

      {/* RENDERIZADO DE LA LISTA */}
      {sortedSources.length === 0 ? (
        <p
          className={classes.bodyText}
          style={{ textAlign: "center", color: "gray" }}
        >
          [No has agregado fuentes bibliográficas al proyecto]
        </p>
      ) : (
        /* CONTENEDOR SIN GAPS (Espaciado cero entre referencias) */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0, // <--- ELIMINADO EL 1.5rem
          }}
        >
          {sortedSources.map((source) => (
            <p
              key={source.id}
              id={`ref-${source.id}`}
              style={{
                fontFamily: "var(--apa-font, 'Times New Roman', serif)",
                fontSize: "12pt",
                lineHeight: 1.5, // <--- INTERLINEADO EXACTO 1.5
                textAlign: "left",
                paddingLeft: "1.27cm", // <--- SANGRÍA FRANCESA
                textIndent: "-1.27cm",
                marginTop: 0, // <--- CERO MÁRGENES EXTRA
                marginBottom: 0,
                color: "inherit",
              }}
              dangerouslySetInnerHTML={{ __html: renderSourceAPA(source) }}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

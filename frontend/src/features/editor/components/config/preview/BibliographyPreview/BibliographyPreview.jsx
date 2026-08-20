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
      <div
        className={classes.bodyText}
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "2rem",
        }}
      >
        Referencias
      </div>

      {sortedSources.length === 0 ? (
        <p
          className={classes.bodyText}
          style={{ textAlign: "center", color: "gray" }}
        >
          [No has agregado fuentes bibliográficas al proyecto]
        </p>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {sortedSources.map((source) => (
            <p
              key={source.id}
              id={`ref-${source.id}`}
              className={classes.bodyText}
              style={{
                paddingLeft: "1.27cm",
                textIndent: "-1.27cm",
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: renderSourceAPA(source) }}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

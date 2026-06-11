import React from "react";
import { PageLayout } from "../PageLayout/PageLayout";
import { useStore } from "@store";
// Importa tus clases CSS si las tienes, o usa estilos en línea
import classes from "../PrelimPagePreview/PrelimPagePreview.module.css";

export const BibliographyPreview = ({ metadata, pageNumber }) => {
  // 1. EXTRAEMOS LAS FUENTES REALES DEL STORE
  const { sources } = useStore();

  // 2. ORDENAMOS ALFABÉTICAMENTE POR AUTOR (Norma APA estricta)
  const sortedSources = [...(sources || [])].sort((a, b) => {
    const authorA = (a.author || "Anónimo").toLowerCase();
    const authorB = (b.author || "Anónimo").toLowerCase();
    return authorA.localeCompare(authorB);
  });

  const finalPageNumber = pageNumber || metadata?._docMap?.referencias || "10";

  // 3. GENERADOR DE FORMATO APA BÁSICO
  const renderAPAReference = (source) => {
    const author = source.author || "Anónimo";
    const year = source.year || "s.f.";
    const title = source.title || "Sin título";
    const publisher = source.metadata?.publisher
      ? `${source.metadata.publisher}. `
      : "";
    const url = source.metadata?.url ? `${source.metadata.url}` : "";

    return (
      <>
        {author} ({year}). <i>{title}</i>. {publisher}
        {url}
      </>
    );
  };

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* TÍTULO CENTRADO Y EN NEGRITA */}
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

      {/* RENDERIZADO DE LA LISTA */}
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
              className={classes.bodyText}
              style={{
                paddingLeft: "1.27cm",
                textIndent: "-1.27cm", // SANGRÍA FRANCESA (Hanging Indent)
                margin: 0,
              }}
            >
              {renderAPAReference(source)}
            </p>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

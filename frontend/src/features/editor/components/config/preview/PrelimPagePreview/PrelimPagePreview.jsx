import React from "react";
import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./PrelimPagePreview.module.css";

export const PrelimPagePreview = ({
  type = "resumen",
  data,
  projectTitle,
  metadata,
  pageNumber,
}) => {
  const isSpanish = type === "resumen";

  // 1. TÍTULO DE LA SECCIÓN
  const sectionTitle = isSpanish ? "Resumen" : "Abstract";

  // 2. PREFIJO DEL TÍTULO DEL PROYECTO
  const titlePrefix = isSpanish ? "Título: " : "Title: ";

  // 3. TÍTULO DEL PROYECTO
  const displayProjectTitle = isSpanish
    ? projectTitle
    : data?.title || "ENGLISH TITLE REQUIRED";

  // 4. LÓGICA DE PAGINACIÓN
  const finalPageNumber =
    pageNumber || metadata?._docMap?.preliminares?.[type] || "iii";

  // 5. TRATAMIENTO DEL TEXTO
  const rawContent = data?.content || `[Contenido del ${type}]`;
  const paragraphs = rawContent.split("\n").filter((p) => p.trim() !== "");

  // 6. TRATAMIENTO DE PALABRAS CLAVE
  const keywordsString = isSpanish ? data?.palabrasClave : data?.keywords;

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* 1. NOMBRE DE LA SECCIÓN (Resumen / Abstract) */}
      <h1 className={classes.sectionHeader}>{sectionTitle}</h1>

      {/* 2. TÍTULO DEL PROYECTO CON PREFIJO (Título: / Title:) */}
      {displayProjectTitle && (
        <h2 className={classes.projectTitle}>
          <span>{titlePrefix}</span>
          <span>{displayProjectTitle}</span>
        </h2>
      )}

      {/* 3. CONTENIDO DEL PÁRRAFO PRELIMINAR */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {paragraphs.map((text, index) => (
          <p
            key={index}
            className={classes.bodyText}
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            {text}
          </p>
        ))}
      </div>

      {/* 4. PALABRAS CLAVE / KEYWORDS (Justificado + Sangría 1.27cm) */}
      {keywordsString && keywordsString.trim().length > 0 && (
        <p className={classes.keywordsBox}>
          <span className={classes.keywordsLabel}>
            {isSpanish ? "Palabras clave: " : "Keywords: "}
          </span>
          <span>{keywordsString}</span>
        </p>
      )}
    </PageLayout>
  );
};

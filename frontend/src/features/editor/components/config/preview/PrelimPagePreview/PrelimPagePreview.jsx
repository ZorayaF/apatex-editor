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

  // 1. TÍTULO DE LA SECCIÓN MANUAL (Sin funciones automáticas)
  const sectionTitle = isSpanish ? "Resumen" : "Abstract";

  // 2. LÓGICA DE SELECCIÓN DE TÍTULO DEL PROYECTO
  const displayProjectTitle = isSpanish
    ? projectTitle
    : data?.title || "ENGLISH TITLE REQUIRED";

  // 3. LÓGICA DE PAGINACIÓN
  const finalPageNumber =
    pageNumber || metadata?._docMap?.preliminares?.[type] || "iii";

  // 4. TRATAMIENTO DEL TEXTO
  const rawContent = data?.content || `[Contenido del ${type}]`;
  const paragraphs = rawContent.split("\n").filter((p) => p.trim() !== "");

  // 5. TRATAMIENTO DE PALABRAS CLAVE
  const keywordsString = isSpanish ? data?.palabrasClave : data?.keywords;

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* 1. NOMBRE DE LA SECCIÓN */}
      <h1 className={classes.sectionHeader}>{sectionTitle}</h1>

      {/* 2. TÍTULO DEL PROYECTO */}
      <h2 className={classes.projectTitle}>{displayProjectTitle}</h2>

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

      {/* 4. PALABRAS CLAVE / KEYWORDS */}
      {keywordsString && keywordsString.trim().length > 0 && (
        <div className={classes.keywordsBox} style={{ marginTop: "1rem" }}>
          <span className={classes.keywordsLabel}>
            {isSpanish ? "Palabras clave: " : "Keywords: "}
          </span>
          <span>{keywordsString}</span>
        </div>
      )}
    </PageLayout>
  );
};

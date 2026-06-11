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

  // LÓGICA DE SELECCIÓN DE TÍTULO
  const displayProjectTitle = isSpanish
    ? projectTitle
    : data?.title || "ENGLISH TITLE REQUIRED";

  // LÓGICA INTELIGENTE DE PAGINACIÓN
  const finalPageNumber =
    pageNumber || metadata?._docMap?.preliminares?.[type] || "iii";

  // TRATAMIENTO DEL TEXTO: Separamos los saltos de línea físicos en párrafos HTML
  const rawContent = data?.content || `[Contenido del ${type}]`;
  const paragraphs = rawContent.split("\n").filter((p) => p.trim() !== "");

  // TRATAMIENTO DE PALABRAS CLAVE: Extraemos el string según el idioma
  const keywordsString = isSpanish ? data?.palabrasClave : data?.keywords;

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* 1. NOMBRE DE LA SECCIÓN (Resumen / Abstract) */}
      <h1 className={classes.sectionHeader}>{type}</h1>

      {/* 2. TÍTULO DEL PROYECTO (En el idioma correspondiente) */}
      <h2 className={classes.projectTitle}>{displayProjectTitle}</h2>

      {/* 3. CONTENIDO DEL PÁRRAFO PRELIMINAR (Iterado para respetar saltos de línea) */}
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

      {/* 4. PALABRAS CLAVE / KEYWORDS (Renderizado condicional con sangría e itálica nativa) */}
      {keywordsString && keywordsString.trim().length > 0 && (
        <div
          className={classes.keywordsBox}
          style={{ marginTop: "1rem" }} // Sangría estricta APA
        >
          <span className={classes.keywordsLabel}>
            {isSpanish ? "Palabras clave: " : "Keywords: "}
          </span>
          <span>{keywordsString}</span>
        </div>
      )}
    </PageLayout>
  );
};

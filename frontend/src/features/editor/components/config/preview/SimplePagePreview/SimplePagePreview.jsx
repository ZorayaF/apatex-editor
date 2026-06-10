import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./SimplePagePreview.module.css";

export const SimplePagePreview = ({ type, data, metadata, pageNumber }) => {
  // Normalizamos el tipo eliminando tildes y pasándolo a minúsculas automáticamente
  const normalizedType = type
    ? type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";

  const sectionsWithoutTitle = ["dedicatoria", "reglamento"];
  const shouldHideTitle = sectionsWithoutTitle.includes(normalizedType);

  // Verificamos si esta sección exige sangría APA
  const sectionsWithIndent = ["introduccion", "reglamento"];
  const needsIndent = sectionsWithIndent.includes(normalizedType);

  const finalPageNumber =
    pageNumber ||
    metadata?._docMap?.preliminares?.[type] ||
    metadata?._docMap?.preliminares?.[normalizedType] ||
    "v";

  const displayTitle = type ? type.charAt(0).toUpperCase() + type.slice(1) : "";
  const rawContent = data?.content || `[Contenido de la sección ${type}]`;

  // Separamos el texto crudo en párrafos reales
  const paragraphs = rawContent.split("\n").filter((p) => p.trim() !== "");

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {!shouldHideTitle && (
        <h1 className={classes.sectionTitle}>{displayTitle}</h1>
      )}

      <div className={classes.textContainer}>
        {paragraphs.map((text, index) => (
          <p
            key={index}
            className={classes.bodyText}
            /* LA CURA DEFINITIVA: Forzamos la medida física directamente en el HTML */
            style={{
              textIndent: needsIndent ? "1.27cm" : "0",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </PageLayout>
  );
};

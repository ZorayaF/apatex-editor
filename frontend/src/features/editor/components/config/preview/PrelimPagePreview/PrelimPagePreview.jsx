import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./PrelimPagePreview.module.css";

export const PrelimPagePreview = ({
  type = "resumen",
  data,
  projectTitle,
  metadata,
  pageNumber, // 1. RECIBIMOS EL PROP
}) => {
  const isSpanish = type === "resumen";

  // LÓGICA DE SELECCIÓN DE TÍTULO (Mantenida y blindada con encadenamiento opcional)
  const displayProjectTitle = isSpanish
    ? projectTitle
    : data?.title || "ENGLISH TITLE REQUIRED";

  // 2. LÓGICA INTELIGENTE: Usamos el prop de exportación, o el fallback del docMap/"iii"
  const finalPageNumber =
    pageNumber || metadata?._docMap?.preliminares?.[type] || "iii";

  return (
    // 3. PASAMOS EL NÚMERO FINAL AL PAGELAYOUT
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* 1. NOMBRE DE LA SECCIÓN (Resumen / Abstract) */}
      <h1 className={classes.sectionHeader}>{type}</h1>

      {/* 2. TÍTULO DEL PROYECTO (En el idioma correspondiente) */}
      <h2 className={classes.projectTitle}>{displayProjectTitle}</h2>

      {/* 3. CONTENIDO DEL PÁRRAFO PRELIMINAR */}
      <p className={classes.bodyText}>
        {data?.content || `[Contenido del ${type}]`}
      </p>

      {/* 4. PALABRAS CLAVE / KEYWORDS */}
      <div className={classes.keywordsBox}>
        <span className={classes.keywordsLabel}>
          {isSpanish ? "Palabras clave: " : "Keywords: "}
        </span>
        <span>
          {isSpanish ? data?.palabrasClave || "" : data?.keywords || ""}
        </span>
      </div>
    </PageLayout>
  );
};

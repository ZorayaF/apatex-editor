import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./PrelimPagePreview.module.css";

export const PrelimPagePreview = ({
  type = "resumen",
  data,
  projectTitle,
  metadata,
}) => {
  const isSpanish = type === "resumen";

  // LÓGICA DE SELECCIÓN DE TÍTULO (Mantenida y blindada con encadenamiento opcional)
  const displayProjectTitle = isSpanish
    ? projectTitle
    : data?.title || "ENGLISH TITLE REQUIRED";

  // Capturamos el número dinámico de página del docMap según la sección (ej: iii, iv)
  const pageNumber = metadata?._docMap?.preliminares?.[type] || "iii";

  return (
    <PageLayout metadata={metadata} pageNumber={pageNumber}>
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

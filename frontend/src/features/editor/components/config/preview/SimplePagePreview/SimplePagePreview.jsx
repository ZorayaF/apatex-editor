import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./SimplePagePreview.module.css";

// 1. Añadimos pageNumber a los props recibidos
export const SimplePagePreview = ({ type, data, metadata, pageNumber }) => {
  const sectionsWithoutTitle = ["dedicatoria", "reglamento"];
  const shouldHideTitle = sectionsWithoutTitle.includes(type);

  // REGLA APA: Sangría de primera línea para la introducción
  const isIntroduccion = type === "introduccion";

  // 2. LÓGICA INTELIGENTE: Si recibe un pageNumber (del Exportador), lo usa.
  // Si no, usa el docMap o el fallback "v" (para la vista de Configuración).
  const finalPageNumber =
    pageNumber || metadata?._docMap?.preliminares?.[type] || "v";

  // Construimos la clase del párrafo inyectando la sangría normal solo si es introducción
  const bodyClassName = `${classes.bodyText} ${isIntroduccion ? classes.hasIndent : ""}`;

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* 1. NOMBRE DE LA SECCIÓN (Oculto dinámicamente si es dedicatoria o reglamento) */}
      {!shouldHideTitle && <h1 className={classes.sectionTitle}>{type}</h1>}

      {/* 2. CUERPO DE TEXTO CON SANGRÍA DINÁMICA POR SOFTWARE */}
      {/* Arreglado: Eliminado 'classes.' para usar la constante calculada */}
      <p className={bodyClassName}>
        {data?.content || `[Contenido de la sección ${type}]`}
      </p>
    </PageLayout>
  );
};

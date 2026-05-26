import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./SimplePagePreview.module.css";

export const SimplePagePreview = ({ type, data, metadata }) => {
  const sectionsWithoutTitle = ["dedicatoria", "reglamento"];
  const shouldHideTitle = sectionsWithoutTitle.includes(type);

  // REGLA APA: Sangría de primera línea para la introducción (Mantenemos tu lógica reactiva)
  const isIntroduccion = type === "introduccion";

  // Capturamos la numeración dinámica desde el mapa del documento según el tipo de hoja preliminar
  const pageNumber = metadata?._docMap?.preliminares?.[type] || "v";

  // Construimos la clase del párrafo inyectando la sangría normal solo si es introducción
  const bodyClassName = `${classes.bodyText} ${isIntroduccion ? classes.hasIndent : ""}`;

  return (
    <PageLayout metadata={metadata} pageNumber={pageNumber}>
      {/* 1. NOMBRE DE LA SECCIÓN (Oculto dinámicamente si es dedicatoria o reglamento) */}
      {!shouldHideTitle && <h1 className={classes.sectionTitle}>{type}</h1>}

      {/* 2. CUERPO DE TEXTO CON SANGRÍA DINÁMICA POR SOFTWARE */}
      <p className={classes.bodyClassName}>
        {data?.content || `[Contenido de la sección ${type}]`}
      </p>
    </PageLayout>
  );
};

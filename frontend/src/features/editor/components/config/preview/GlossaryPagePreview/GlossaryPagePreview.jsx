import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./GlossaryPagePreview.module.css";

export const GlossaryPagePreview = ({ terms = [], metadata }) => {
  // Capturamos el número dinámico de página asignado al glosario en el docMap o dejamos un fallback romano
  const pageNumber = metadata?._docMap?.glosario || "G";

  return (
    <PageLayout metadata={metadata} pageNumber={pageNumber}>
      {/* TÍTULO EN NEGRITA Y CENTRADO */}
      <h1 className={classes.glossaryTitle}>Glosario</h1>

      {/* FLUJO EN CASCADA DE TÉRMINOS DEFINIDOS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {terms.length === 0 ? (
          <p className={classes.emptyNotice}>
            No hay términos definidos en el glosario.
          </p>
        ) : (
          terms.map((item, index) => (
            <div key={index} className={classes.termDefinitionBlock}>
              {/* Término: Mayúscula inicial, Negrita y Cursiva por CSS */}
              <span className={classes.termLabel}>{item?.term}:</span>
              {/* Definición */}
              <span> {item?.definition}</span>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
};

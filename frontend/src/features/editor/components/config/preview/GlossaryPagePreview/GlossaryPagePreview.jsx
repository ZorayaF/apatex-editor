import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./GlossaryPagePreview.module.css";

// 1. Recibimos pageNumber en los props
export const GlossaryPagePreview = ({ terms = [], metadata, pageNumber }) => {
  // 2. Lógica Inteligente: prop > docMap > fallback "G"
  const finalPageNumber = pageNumber || metadata?._docMap?.glosario || "G";

  return (
    // 3. Pasamos finalPageNumber
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
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

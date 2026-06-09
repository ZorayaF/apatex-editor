import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./AceptacionPagePreview.module.css";

// 1. Añadimos pageNumber a los props
export const AceptacionPagePreview = ({ metadata, pageNumber }) => {
  const { aceptacion } = metadata?.preliminares || {};
  const docMap = metadata?._docMap || { aceptacion: "ii" };

  // 2. Usamos pageNumber si existe, si no caemos en el docMap
  const finalPageNumber = pageNumber || docMap.aceptacion;

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* TÍTULO DE LA PÁGINA */}
      <p className={classes.titleText}>Nota de aceptación:</p>

      {/* BLOQUE DE FIRMAS AUTOMATIZADO POR CLASES */}
      <div className={classes.signatureStack}>
        <div className={classes.signatureLine}>
          <p className={classes.signatureLabel}>
            Firma del Presidente del Jurado
          </p>
        </div>

        <div className={classes.signatureLine}>
          <p className={classes.signatureLabel}>Firma del Jurado</p>
        </div>

        <div className={classes.signatureLine}>
          <p className={classes.signatureLabel}>Firma del Jurado</p>
        </div>
      </div>

      {/* PIE DE PÁGINA: CIUDAD Y FECHA */}
      <div className={classes.footerBox}>
        <p style={{ margin: 0, fontSize: "12pt" }}>
          {aceptacion?.ciudad || "Ciudad"},{" "}
          {aceptacion?.fecha || "día de mes de año"}
        </p>
      </div>
    </PageLayout>
  );
};

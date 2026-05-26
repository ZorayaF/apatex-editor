import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./AceptacionPagePreview.module.css";

export const AceptacionPagePreview = ({ metadata }) => {
  const { aceptacion } = metadata?.preliminares || {};
  const docMap = metadata?._docMap || { aceptacion: "ii" }; // Suponiendo fallback dinámico o inyectado

  return (
    <PageLayout metadata={metadata} pageNumber={docMap.aceptacion}>
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

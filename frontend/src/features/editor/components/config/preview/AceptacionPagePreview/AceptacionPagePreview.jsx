import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./AceptacionPagePreview.module.css";

export const AceptacionPagePreview = ({ metadata, pageNumber }) => {
  const docMap = metadata?._docMap || { aceptacion: "ii" };
  const finalPageNumber = pageNumber || docMap.aceptacion;

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      <div className={classes.pageContainer}>
        {/* TODO ESTE BLOQUE ESTÁ FORZADO A LA MITAD DERECHA */}
        <div className={classes.rightHalf}>
          <p className={classes.titleText}>Nota de aceptación:</p>

          <div className={classes.gradeLines}>
            <div className={classes.blankLine} />
            <div className={classes.blankLine} />
            <div className={classes.blankLine} />
            <div className={classes.blankLine} />
            <div className={classes.blankLine} />
            <div className={classes.blankLine} />
          </div>

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
        </div>

        {/* PIE DE PÁGINA: Posicionamiento absoluto, no importa qué pase arriba, esto se va al fondo */}
        <div className={classes.footerBox}>
          <p style={{ margin: 0, fontSize: "12pt" }}>
            Ciudad, dia de mes de año
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

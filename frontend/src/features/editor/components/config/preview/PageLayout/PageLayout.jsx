import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  cmToPx,
  APA_CONFIG,
} from "@core/utils/measurements";
import classes from "./PageLayout.module.css";

export const PageLayout = ({
  metadata,
  pageNumber,
  hideHeader = false,
  children,
}) => {
  const { margins, typography } = APA_CONFIG;

  // --- LA CORRECCIÓN CRÍTICA ---
  // Igualamos la lógica con el Canvas: Leemos directo de la raíz.
  // Ya no cortamos con "...", dejamos que el CSS Flexbox se encargue de eso si es muy ancho.
  const shortTitle =
    metadata?.tituloAbreviado ||
    metadata?.tituloProyecto?.substring(0, 50).toUpperCase() ||
    "TÍTULO DEL PROYECTO";

  // Inyectamos las variables CSS de forma limpia en el contenedor raíz
  const pageVariables = {
    "--page-width": `${PAGE_WIDTH_PX}px`,
    "--page-height": `${PAGE_HEIGHT_PX}px`,
    "--margin-top": `${cmToPx(margins.top)}px`,
    "--margin-bottom": `${cmToPx(margins.bottom)}px`,
    "--margin-left": `${cmToPx(margins.left)}px`,
    "--margin-right": `${cmToPx(margins.right)}px`,
    fontFamily: typography.family,
  };

  return (
    <div className={classes.pageSheet} style={pageVariables}>
      {/* ENCABEZADO DE PÁGINA (Calculado milimétricamente en el eje absoluto superior) */}
      {!hideHeader && (
        <div
          className={classes.pageHeader}
          style={{ top: `${cmToPx(margins.top / 2)}px` }} // Exactamente en la mitad del margen superior (1.27 cm)
        >
          <span className={classes.runningHead}>{shortTitle}</span>
          <span className={classes.pageNumber}>{pageNumber}</span>
        </div>
      )}

      {/* ÁREA DE CONTENIDO ESPECÍFICO */}
      <div className={classes.pageContent}>{children}</div>
    </div>
  );
};

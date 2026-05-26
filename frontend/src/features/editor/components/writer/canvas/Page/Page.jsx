import { useRef, memo, useMemo } from "react";
import { Box } from "@mantine/core";
import { useStore } from "@store";
import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  cmToPx,
  APA_CONFIG,
} from "@core/utils/measurements";
import { usePagePagination } from "@hooks/usePagePagination";
import { ConnectedBlock } from "../ConnectedBlock";
import { calculateDocumentMap } from "@logic/engine/documentLayoutEngine";
import classes from "./Page.module.css";

export const Page = memo(({ pageId, pageNumber, allowedBlockIds }) => {
  const pageContentRef = useRef(null);
  const { margins, typography } = APA_CONFIG;

  // 1. OBTENEMOS METADATOS Y CALCULAMOS EL OFFSET GLOBAL
  const projectMetadata = useStore((s) => s.projectMetadata);

  const docMap = useMemo(
    () => calculateDocumentMap(projectMetadata),
    [projectMetadata],
  );

  // 2. CÁLCULO DEL NÚMERO REAL
  const realPageNumber = pageNumber + (docMap.editorStartPage - 1);

  // Extracción del título abreviado desde la metadata
  const runningTitle =
    projectMetadata?.portada?.tituloAbreviado || "TÍTULO DEL TRABAJO";

  const page = useStore((s) => s.pages.find((p) => p.id === pageId));
  const rawBlockIds = page?.blockIds || [];

  const visibleBlockIds = useMemo(() => {
    if (!allowedBlockIds) return rawBlockIds;
    return rawBlockIds.filter((id) => allowedBlockIds.has(id));
  }, [rawBlockIds, allowedBlockIds]);

  const isActive = useStore((s) => s.activePageIndex === pageNumber - 1);
  const { setActivePage, setSelectedBlockId } = useStore();

  usePagePagination(pageContentRef, rawBlockIds, pageNumber);

  const handlePageClick = (e) => {
    if (e.target === e.currentTarget) {
      setActivePage(pageNumber - 1);
      setSelectedBlockId(null);
    }
  };

  // Mapeo unificado de constantes métricas a propiedades custom de CSS
  const pageVariables = {
    "--page-width": `${PAGE_WIDTH_PX}px`,
    "--page-height": `${PAGE_HEIGHT_PX}px`,
    "--margin-top": `${cmToPx(margins.top)}px`,
    "--margin-bottom": `${cmToPx(margins.bottom)}px`,
    "--margin-left": `${cmToPx(margins.left)}px`,
    "--margin-right": `${cmToPx(margins.right)}px`,
    "--font-family": typography.family,
    "--font-size": `${typography.size}pt`,
  };

  return (
    <div
      className={`${classes.pageSheet} ${isActive ? classes.isActive : ""}`}
      onClick={handlePageClick}
      style={pageVariables}
    >
      {/*  NUEVO ENCABEZADO REGLAMENTARIO INTEGRADO UP */}
      <div
        className={classes.pageHeader}
        style={{
          // Ubicado exactamente en la mitad del margen superior (1.27 cm de la cima)
          top: `${cmToPx(margins.top / 2)}px`,
          paddingLeft: "var(--margin-left)",
          paddingRight: "var(--margin-right)",
        }}
      >
        <span className={classes.runningHead}>{runningTitle}</span>
        <span
          className={`${classes.pageNumber} ${
            isActive ? classes.isActiveNumber : ""
          }`}
        >
          {realPageNumber}
        </span>
      </div>

      {/* CUERPO DE CONTENIDO PRINCIPAL */}
      <Box
        ref={pageContentRef}
        style={{ height: "100%", position: "relative" }}
      >
        <div style={{ pointerEvents: "auto" }}>
          {visibleBlockIds.map((id) => (
            <ConnectedBlock key={id} blockId={id} />
          ))}
        </div>
      </Box>
    </div>
  );
});

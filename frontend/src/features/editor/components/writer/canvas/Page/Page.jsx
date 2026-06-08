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
import classes from "./Page.module.css";

// 1. RECIBIMOS EL TÍTULO Y EL OFFSET DE PÁGINA COMO PROPS
export const Page = memo(
  ({ pageId, pageNumber, allowedBlockIds, editorStartPage, runningTitle }) => {
    const pageContentRef = useRef(null);
    const { margins, typography } = APA_CONFIG;

    // 2. YA NO CALCULAMOS EL MAPA DEL DOCUMENTO AQUÍ. Solo sumamos el prop.
    const realPageNumber = pageNumber + (editorStartPage - 1);

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
        <div
          className={classes.pageHeader}
          style={{
            top: `${cmToPx(margins.top / 2)}px`,
            paddingLeft: "var(--margin-left)",
            paddingRight: "var(--margin-right)",
          }}
        >
          {/* 3. RENDERIZAMOS EL PROP DIRECTAMENTE */}
          <span className={classes.runningHead}>{runningTitle}</span>
          <span
            className={`${classes.pageNumber} ${
              isActive ? classes.isActiveNumber : ""
            }`}
          >
            {realPageNumber}
          </span>
        </div>

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
  },
);

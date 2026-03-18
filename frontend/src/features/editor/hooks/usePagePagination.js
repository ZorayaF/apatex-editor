import { useEffect } from "react";
import { useStore } from "@store";
import { getOverflowBlockId } from "../logic/engine/paginationEngine";

export const usePagePagination = (pageContentRef, children, pageNumber) => {
  const { blocks, moveToNextPage } = useStore();

  useEffect(() => {
    if (pageContentRef.current) {
      const overflowId = getOverflowBlockId(pageContentRef.current);
      if (overflowId) {
        moveToNextPage(overflowId);
      }
    }
  }, [children, blocks, moveToNextPage, pageContentRef]);
};

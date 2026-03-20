import React from "react";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow";
import { Page } from "./Page";

export const Canvas = () => {
  const pageIds = useStore(useShallow((s) => s.pages.map((p) => p.id)));

  // El Canvas ya no tiene scroll ni altura fija,
  // deja que el Shell controle el "mundo exterior".
  return (
    <>
      {pageIds.map((id, index) => (
        <Page key={id} pageId={id} pageNumber={index + 1} />
      ))}
    </>
  );
};

import React from "react";
import { useStore } from "@store";
import classes from "./CitationInline.module.css";

export const CitationInline = ({ data, sourceId, onClick }) => {
  const { setSelectedSourceId, setActiveTab, setInspectorOpen } = useStore();
  const label = data?.label || "(Autor, Año)";

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
      return;
    }

    if (sourceId || data?.sourceId || data?.id) {
      const targetId = sourceId || data?.sourceId || data?.id;
      setSelectedSourceId(targetId);
      setActiveTab("library");
      setInspectorOpen(true);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={classes.citationBadge}
      role="button"
      tabIndex={0}
    >
      {label}
    </span>
  );
};

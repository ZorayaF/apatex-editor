import React from "react";
import { Badge } from "@mantine/core";

export const CitationInline = ({ data, onClick }) => {
  const label = data?.label || "(Autor, Año)";

  return (
    <Badge
      onClick={onClick}
      variant="light"
      color="blue"
      radius="sm"
      style={{
        cursor: "pointer",
        textTransform: "none",
        fontSize: "inherit",
        fontWeight: "normal",
        padding: "0 4px",
        display: "inline-block",
        verticalAlign: "baseline",
      }}
    >
      {label}
    </Badge>
  );
};

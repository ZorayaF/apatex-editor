// src/features/editor/components/canvas/Canvas.jsx
import React from "react";
import { Box } from "@mantine/core";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow"; // <--- IMPORTANTE
import { Page } from "./Page";

export const Canvas = () => {
  // Con useShallow, Zustand solo avisará si los IDs cambian,
  // no cada vez que se cree el array.
  const pageIds = useStore(useShallow((s) => s.pages.map((p) => p.id)));

  return (
    <Box className="canvas-viewport" style={viewportStyle}>
      {pageIds.map((id, index) => (
        <Page key={id} pageId={id} pageNumber={index + 1} />
      ))}
    </Box>
  );
};

const viewportStyle = {
  backgroundColor: "#f1f3f5",
  height: "calc(100vh - 60px)",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px 0",
};

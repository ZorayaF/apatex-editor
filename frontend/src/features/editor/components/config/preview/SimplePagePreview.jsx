// src/features/editor/components/config/preview/SimplePagePreview.jsx
import React from "react";
import { Box, Text } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const SimplePagePreview = ({ type, data }) => {
  const { paper, margins, typography } = APA_CONFIG;

  // Definimos qué secciones NO deben mostrar el título superior
  const sectionsWithoutTitle = ["dedicatoria", "reglamento"];
  const shouldHideTitle = sectionsWithoutTitle.includes(type);

  const pageStyle = {
    width: `${cmToPx(paper.width)}px`,
    height: `${cmToPx(paper.height)}px`,
    backgroundColor: "white",
    padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
    boxSizing: "border-box",
    fontFamily: typography.family,
    fontSize: `${typography.size}pt`,
    lineHeight: 2,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  return (
    <Box style={pageStyle}>
      {/* 
          TÍTULO: Solo se muestra si la sección no está 
          en nuestra "lista negra" (Agradecimientos sí lo muestra).
      */}
      {!shouldHideTitle && (
        <Text
          ta="center"
          fw="bold"
          mb="xl"
          style={{ textTransform: "capitalize" }}
        >
          {type}
        </Text>
      )}

      {/* Contenido Normal */}
      <Text style={{ textAlign: "justify", whiteSpace: "pre-wrap" }}>
        {data?.content || `[Contenido de la sección ${type}]`}
      </Text>
    </Box>
  );
};

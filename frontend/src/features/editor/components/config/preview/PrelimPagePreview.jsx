// src/features/editor/components/config/preview/PrelimPagePreview.jsx
import React from "react";
import { Box, Text } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const PrelimPagePreview = ({ type = "resumen", data, projectTitle }) => {
  const { paper, margins, typography } = APA_CONFIG;

  const isSpanish = type === "resumen";

  // LÓGICA DE SELECCIÓN DE TÍTULO:
  // Si es resumen, usa el título de la portada.
  // Si es abstract, usa el título en inglés que guardamos en data.title.
  const displayProjectTitle = isSpanish
    ? projectTitle
    : data?.title || "ENGLISH TITLE REQUIRED";

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
      {/* 1. NOMBRE DE LA SECCIÓN: Resumen / Abstract */}
      <Text
        ta="center"
        fw="bold"
        mb="xl"
        style={{ textTransform: "capitalize" }}
      >
        {type}
      </Text>

      {/* 2. TÍTULO DEL PROYECTO (En el idioma correspondiente) */}
      <Text fw="bold" mb="md" ta="left">
        {displayProjectTitle}
      </Text>

      {/* 3. CONTENIDO DEL PÁRRAFO */}
      <Text style={{ textAlign: "justify", whiteSpace: "pre-wrap" }}>
        {data?.content || `[Contenido del ${type}]`}
      </Text>

      {/* 4. PALABRAS CLAVE */}
      <Box mt="xl">
        <Text span fs="italic" fw="bold">
          {isSpanish ? "Palabras clave: " : "Keywords: "}
        </Text>
        <Text span>
          {isSpanish ? data?.palabrasClave || "" : data?.keywords || ""}
        </Text>
      </Box>
    </Box>
  );
};

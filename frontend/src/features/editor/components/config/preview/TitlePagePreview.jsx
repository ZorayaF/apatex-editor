// src/features/editor/components/config/preview/TitlePagePreview.jsx
import React from "react";
import { Box, Text, Stack } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const TitlePagePreview = ({ isContraportada, data }) => {
  const { paper, margins, typography } = APA_CONFIG;

  const pageStyle = {
    width: `${cmToPx(paper.width)}px`,
    height: `${cmToPx(paper.height)}px`,
    backgroundColor: "white",
    padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
    boxSizing: "border-box",
    fontFamily: typography.family,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    lineHeight: 1.5,
    // ✅ APLICAMOS NEGRITA A TODA LA HOJA
    fontWeight: "bold",
    fontSize: `${typography.size}pt`,
  };

  return (
    <Box style={pageStyle}>
      {/* 1. TÍTULO DEL PROYECTO */}
      <Text style={{ fontWeight: "inherit", fontSize: "inherit" }}>
        {data?.titulo || "Título del proyecto"}
      </Text>

      {/* 2. BLOQUE CENTRAL: Autores y objetivo */}
      <Stack gap="xl">
        <Text style={{ fontWeight: "inherit", fontSize: "inherit" }}>
          {data?.autor || "Nombre del autor"}
        </Text>

        {isContraportada && (
          <Box mt="xl">
            <Text style={{ fontWeight: "inherit" }}>
              Trabajo de grado para optar al título de
            </Text>
            <Text style={{ fontWeight: "inherit" }}>
              {data?.programa || "Programa académico"}
            </Text>

            <Box mt="lg">
              <Text style={{ fontWeight: "inherit" }}>Director:</Text>
              <Text style={{ fontWeight: "inherit" }}>
                {data?.director || "Nombre del director"}
              </Text>
            </Box>
          </Box>
        )}
      </Stack>

      {/* 3. BLOQUE INFERIOR: Institución, Facultad y Fecha */}
      <Stack gap={4}>
        <Text style={{ fontWeight: "inherit" }}>
          {data?.institucion || "Universidad de Boyacá"}
        </Text>
        <Text style={{ fontWeight: "inherit" }}>
          {data?.facultad || "Facultad de Ciencias e Ingeniería"}
        </Text>
        <Text style={{ fontWeight: "inherit" }}>
          {data?.programa || "Programa de Ingeniería de Sistemas"}
        </Text>
        <Text style={{ fontWeight: "inherit" }}>
          {data?.ciudad || "Tunja"}, {data?.año || "2026"}
        </Text>
      </Stack>
    </Box>
  );
};

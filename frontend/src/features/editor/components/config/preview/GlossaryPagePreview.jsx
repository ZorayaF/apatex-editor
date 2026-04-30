// src/features/editor/components/config/preview/GlossaryPagePreview.jsx
import React from "react";
import { Box, Text, Stack } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const GlossaryPagePreview = ({ terms = [] }) => {
  const { paper, margins, typography } = APA_CONFIG;

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
      <Text ta="center" fw="bold" mb="xl">
        Glosario
      </Text>

      <Stack gap="md">
        {" "}
        {/* Gap="md" crea la interlínea entre términos */}
        {terms.length === 0 ? (
          <Text c="dimmed" ta="center" fs="italic">
            No hay términos definidos.
          </Text>
        ) : (
          terms.map((item, index) => (
            <div
              key={index}
              style={{
                textAlign: "justify",
                // REGLA: Primera línea con sangría, las demás contra el margen
                textIndent: "1.27cm",
                margin: 0,
              }}
            >
              {/* Término: Mayúscula inicial, Negrita, Cursiva */}
              <span style={{ fontWeight: "bold", fontStyle: "italic" }}>
                {item.term}:
              </span>
              {/* Definición: Espacio y comienza en minúscula */}
              <span> {item.definition}</span>
            </div>
          ))
        )}
      </Stack>
    </Box>
  );
};

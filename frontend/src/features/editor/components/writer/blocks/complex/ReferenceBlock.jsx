import React from "react";
import { Box, Text } from "@mantine/core";

export const ReferenceBlock = ({ blockId, data, isActive, onClick }) => {
  // Simulación de datos para que veas el efecto visual ahora mismo
  const previewText =
    data?.formattedText ||
    "García Márquez, G. (1967). Cien años de soledad. Editorial Sudamericana.";

  return (
    <Box
      onClick={onClick}
      className="reference-apa-block"
      py="xs"
      style={{
        // --- MAGIA DE LA SANGRÍA FRANCESA ---
        paddingLeft: "1.27cm", // Espacio total a la izquierda
        textIndent: "-1.27cm", // "Empuja" la primera línea hacia atrás
        // ------------------------------------
        lineHeight: 2, // Doble espacio obligatorio APA
        textAlign: "justify",
        cursor: "pointer",
        backgroundColor: isActive
          ? "var(--mantine-color-blue-0)"
          : "transparent",
        borderRadius: "4px",
        transition: "background-color 0.2s ease",
      }}
    >
      <Text size="md" style={{ fontFamily: "Times New Roman, serif" }}>
        {previewText}
      </Text>
    </Box>
  );
};

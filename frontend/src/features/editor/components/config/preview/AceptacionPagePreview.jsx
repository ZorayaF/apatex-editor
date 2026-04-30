import React from "react";
import { Box, Text, Stack, Divider, Group } from "@mantine/core";
import {
  APA_CONFIG,
  cmToPx,
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
} from "@core/utils/measurements";
import { calculateDocumentMap } from "@logic/engine/documentLayoutEngine";

export const AceptacionPagePreview = ({ metadata }) => {
  const { margins, typography } = APA_CONFIG;
  const { aceptacion } = metadata.preliminares;
  const docMap = calculateDocumentMap(metadata);

  // El encabezado abreviado no debe exceder 50 caracteres
  const shortTitle =
    metadata.tituloProyecto.length > 50
      ? metadata.tituloProyecto.substring(0, 47) + "..."
      : metadata.tituloProyecto;

  const lineStyle = {
    borderTop: "1px solid black",
    width: "300px",
    marginTop: "60px",
    textAlign: "center",
  };

  return (
    <Box
      style={{
        width: `${PAGE_WIDTH_PX}px`,
        height: `${PAGE_HEIGHT_PX}px`,
        backgroundColor: "white",
        padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
        fontFamily: typography.family,
        fontSize: "12pt",
        position: "relative",
        boxSizing: "border-box",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* ENCABEZADO Y PAGINACIÓN */}
      <Group justify="space-between" align="flex-start" mb="xl">
        <Text
          size="10pt"
          style={{ textTransform: "uppercase", maxWidth: "80%" }}
        >
          {shortTitle}
        </Text>
        <Text size="12pt">{docMap.aceptacion}</Text>
      </Group>

      {/* TÍTULO DE LA PÁGINA */}
      <Text ta="right" fw="bold" mt={40} mb={100}>
        Nota de aceptación:
      </Text>

      {/* BLOQUE DE FIRMAS */}
      <Stack align="flex-end" gap={0} mt={50}>
        <Box style={lineStyle}>
          <Text size="10pt" mt={5}>
            Firma del Presidente del Jurado
          </Text>
        </Box>

        <Box style={lineStyle}>
          <Text size="10pt" mt={5}>
            Firma del Jurado
          </Text>
        </Box>

        <Box style={lineStyle}>
          <Text size="10pt" mt={5}>
            Firma del Jurado
          </Text>
        </Box>
      </Stack>

      {/* PIE DE PÁGINA: CIUDAD Y FECHA */}
      <Box
        style={{ position: "absolute", bottom: `${cmToPx(margins.bottom)}px` }}
      >
        <Text>
          {aceptacion.ciudad}, {aceptacion.fecha || "día de mes de año"}
        </Text>
      </Box>
    </Box>
  );
};

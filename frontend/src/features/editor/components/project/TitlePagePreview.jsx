import React from "react";
import { Box, Text, Stack } from "@mantine/core";
import { useStore } from "../../store";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const TitlePagePreview = ({ isContraportada = false }) => {
  const { projectMetadata } = useStore();
  const { margins, paper, typography } = APA_CONFIG;

  // Estilo de la "Hoja de Papel"
  const pageStyle = {
    width: `${cmToPx(paper.width)}px`,
    height: `${cmToPx(paper.height)}px`,
    backgroundColor: "white",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    paddingTop: `${cmToPx(margins.top)}px`,
    paddingBottom: `${cmToPx(margins.bottom)}px`,
    paddingLeft: `${cmToPx(margins.left)}px`,
    paddingRight: `${cmToPx(margins.right)}px`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Distribuye Bloque Superior e Inferior
    alignItems: "center",
    textAlign: "center",
    fontFamily: typography.family,
    fontSize: `${typography.size}pt`,
    lineHeight: 1.2,
    position: "relative",
    boxSizing: "border-box",
    textTransform: "uppercase", // La mayoría de la portada va en mayúsculas
  };

  return (
    <Box style={pageStyle}>
      {/* --- BLOQUE SUPERIOR: TÍTULO --- */}
      <Box style={{ width: "100%", fontWeight: "bold" }}>
        <Text style={{ fontSize: "12pt" }}>
          {projectMetadata.tituloProyecto || "TÍTULO DEL PROYECTO"}
        </Text>
      </Box>

      {/* --- BLOQUE MEDIO: AUTORES (CENTRO GEOMÉTRICO) --- */}
      <Box
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: "100%",
          paddingLeft: `${cmToPx(margins.left)}px`,
          paddingRight: `${cmToPx(margins.right)}px`,
          left: 0,
          boxSizing: "border-box",
        }}
      >
        <Stack gap="xs">
          {projectMetadata.autores.map((autor, i) => (
            <Text key={i} fw="bold">
              {autor}
            </Text>
          ))}

          {/* Si es Contraportada, añadimos los datos adicionales en el bloque medio */}
          {isContraportada && (
            <Stack gap="xl" mt={40} style={{ textTransform: "none" }}>
              <Box>
                <Text size="sm">Trabajo de grado para optar al título de:</Text>
                <Text fw="bold">{projectMetadata.gradoObjetivo}</Text>
              </Box>

              <Box>
                <Text size="sm">Director:</Text>
                <Text fw="bold">
                  {projectMetadata.director.titulo}{" "}
                  {projectMetadata.director.nombre}
                </Text>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* --- BLOQUE INFERIOR: INSTITUCIONAL --- */}
      <Box style={{ fontWeight: "bold" }}>
        <Text>{projectMetadata.institucion}</Text>
        <Text>{projectMetadata.facultad}</Text>
        <Text>{projectMetadata.programa}</Text>
        <Text>
          {projectMetadata.ubicacion}, {projectMetadata.anio}
        </Text>
      </Box>
    </Box>
  );
};

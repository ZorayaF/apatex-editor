// src/features/editor/components/config/preview/TitlePagePreview.jsx
import { Box, Text, Stack } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const TitlePagePreview = ({ isContraportada, data }) => {
  const { paper, margins, typography } = APA_CONFIG;

  // Extraemos las propiedades mapeando la raíz de projectMetadata y el subobjeto de portada
  const titulo = data?.portada?.titulo || "Título del proyecto";
  const institucion = data?.institucion || "Universidad de Boyacá";
  const facultad = data?.facultad || "Facultad de Ciencias e Ingeniería";
  const programa = data?.programa || "Programa académico";
  const ubicacion = data?.ubicacion || "Tunja";
  const anio = data?.anio || "2026";

  // Formateo de Directores (Nombre + Grado Académico)
  const directorNombre = data?.director?.nombre;
  const directorGrado = data?.director?.titulo;
  const directorCompleto = directorNombre
    ? `${directorGrado ? directorGrado + ". " : ""}${directorNombre}`
    : "Nombre del director";

  // Formateo de Autores (Ya que viajan como array en el TagsInput)
  const listaAutores =
    Array.isArray(data?.autores) && data.autores.length > 0
      ? data.autores.join("\n")
      : "Nombre del autor";

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
    lineHeight: 1.8,
    fontWeight: "bold", // Toda la hoja en negrita estricta
    fontSize: `${typography.size}pt`,
  };

  return (
    <Box style={pageStyle}>
      {/* 1. TÍTULO DEL PROYECTO */}
      <Text
        style={{
          fontWeight: "inherit",
          fontSize: "inherit",
          whiteSpace: "pre-wrap",
        }}
      >
        {titulo}
      </Text>

      {/* 2. BLOQUE CENTRAL: Autores y objetivo institucional */}
      <Stack gap="xl">
        {/* Renderiza los autores respetando los saltos de línea si son varios */}
        <Text
          style={{
            fontWeight: "inherit",
            fontSize: "inherit",
            whiteSpace: "pre-wrap",
          }}
        >
          {listaAutores}
        </Text>

        {isContraportada && (
          <Box mt="xl">
            <Text style={{ fontWeight: "inherit" }}>
              Trabajo de grado para optar al título de
            </Text>
            <Text style={{ fontWeight: "inherit" }}>
              {data?.gradoObjetivo ||
                "Título al que opta (Ej: Ingeniero de Sistemas)"}
            </Text>

            <Box mt="xl">
              <Text style={{ fontWeight: "inherit" }}>Director:</Text>
              <Text style={{ fontWeight: "inherit" }}>{directorCompleto}</Text>
            </Box>
          </Box>
        )}
      </Stack>

      {/* 3. BLOQUE INFERIOR: Institución, Facultad, Programa, Ubicación y Año */}
      <Stack gap={2}>
        <Text style={{ fontWeight: "inherit" }}>{institucion}</Text>
        <Text style={{ fontWeight: "inherit" }}>{facultad}</Text>
        <Text style={{ fontWeight: "inherit" }}>{programa}</Text>
        <Text style={{ fontWeight: "inherit" }}>{ubicacion}</Text>
        <Text style={{ fontWeight: "inherit" }}>{anio}</Text>
      </Stack>
    </Box>
  );
};

import React from "react";
import {
  Stack,
  Textarea,
  TextInput,
  Fieldset,
  Text,
  Paper,
  Divider,
} from "@mantine/core";
import { useStore } from "@store";

export const AcademicForm = ({ section = "resumen" }) => {
  const { projectMetadata, setProjectMetadata } = useStore();

  const data = projectMetadata.preliminares[section];
  const isSpanish = section === "resumen";

  // Título original de la portada (solo para referencia o uso en español)
  const tituloOriginal = projectMetadata.portada?.titulo;

  return (
    <Stack gap="xl">
      {/* 1. SECCIÓN DE TÍTULO */}
      {isSpanish ? (
        // En ESPAÑOL: Solo mostramos el título vinculado
        <Paper withBorder p="md" bg="blue.0" style={{ borderStyle: "dashed" }}>
          <Text size="xs" fw={700} c="blue.9" mb={5}>
            TÍTULO VINCULADO DESDE PORTADA:
          </Text>
          <Text fw={600} size="sm" italic={!tituloOriginal}>
            {tituloOriginal || "⚠️ Define el título en la sección de Portada"}
          </Text>
        </Paper>
      ) : (
        // En INGLÉS: Input manual para la traducción
        <TextInput
          label="Project Title in English"
          description="Traducción técnica del título para el Abstract"
          placeholder="Enter English title..."
          fw={700}
          value={data?.title || ""}
          onChange={(e) =>
            setProjectMetadata(`preliminares.${section}.title`, e.target.value)
          }
        />
      )}

      <Divider />

      {/* 2. CUERPO DEL RESUMEN / ABSTRACT */}
      <Fieldset
        legend={
          <Text fw={700} size="lg" style={{ textTransform: "capitalize" }}>
            {section}
          </Text>
        }
        variant="unstyled"
      >
        <Stack gap="md">
          <Textarea
            label={isSpanish ? "Contenido del Resumen" : "Abstract Content"}
            description={
              isSpanish
                ? "Extensión recomendada: 150 - 250 palabras."
                : "Technical translation of the summary."
            }
            placeholder={isSpanish ? "Escribe aquí..." : "Write here..."}
            minRows={10}
            autosize
            value={data?.content || ""}
            onChange={(e) =>
              setProjectMetadata(
                `preliminares.${section}.content`,
                e.target.value,
              )
            }
          />

          <TextInput
            label={isSpanish ? "Palabras Clave" : "Keywords"}
            placeholder={isSpanish ? "IA, Educación..." : "AI, Education..."}
            value={isSpanish ? data?.palabrasClave || "" : data?.keywords || ""}
            onChange={(e) =>
              setProjectMetadata(
                `preliminares.${section}.${isSpanish ? "palabrasClave" : "keywords"}`,
                e.target.value,
              )
            }
          />
        </Stack>
      </Fieldset>
    </Stack>
  );
};

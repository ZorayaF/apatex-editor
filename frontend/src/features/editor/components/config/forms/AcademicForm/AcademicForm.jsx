// src/features/editor/components/config/forms/AcademicForm/AcademicForm.jsx
import {
  Stack,
  Textarea,
  TextInput,
  Fieldset,
  Text,
  Divider,
} from "@mantine/core";
import { useStore } from "@store";
import classes from "./AcademicForm.module.css";

export const AcademicForm = ({ section = "resumen" }) => {
  const { projectMetadata, setProjectMetadata } = useStore();

  const data = projectMetadata?.preliminares?.[section];
  const isSpanish = section === "resumen";

  // Título original de la portada (solo para referencia o uso en español)
  const tituloOriginal = projectMetadata?.portada?.titulo;

  return (
    <Stack gap="xl">
      {/* 1. SECCIÓN DE TÍTULO O ALERTA */}
      {isSpanish ? (
        // En ESPAÑOL: Solo mostramos el título vinculado de forma nativa por CSS
        <div className={classes.linkedTitlePaper}>
          <p className={classes.alertLabel}>TÍTULO VINCULADO DESDE PORTADA:</p>
          <Text
            fw={600}
            size="sm"
            italic={!tituloOriginal}
            className={classes.alertText}
          >
            {tituloOriginal || "⚠️ Define el título en la sección de Portada"}
          </Text>
        </div>
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
      <Fieldset variant="unstyled">
        <Stack gap="md">
          <Textarea
            label={isSpanish ? "Contenido del Resumen" : "Abstract Content"}
            description={
              isSpanish
                ? "Extensión recomendada: 150 - 250 palabras."
                : "Traducción técnica del resumen"
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

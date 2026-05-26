// src/features/editor/components/config/forms/IntroductionForm.jsx
import { Stack, Textarea, Fieldset, Text, Paper } from "@mantine/core";
import { useStore } from "@store";

export const IntroductionForm = () => {
  const { projectMetadata, setProjectMetadata } = useStore();

  // Apuntamos a la ruta de la introducción en el store
  const data = projectMetadata.preliminares?.introduccion;

  return (
    <Stack gap="xl">
      {/* Caja de sugerencia técnica o UX rápida */}
      <Paper withBorder p="md" bg="blue.0" style={{ borderStyle: "dashed" }}>
        <Text size="xs" fw={700} c="blue.9" mb={5}>
          DIRECTRIZ INSTITUCIONAL:
        </Text>
        <Text size="xs" c="blue.9" style={{ lineHeight: 1.4 }}>
          La introducción debe presentar de manera clara el tema, los objetivos
          y la estructura del trabajo. El sistema aplicará la sangría
          reglamentaria de 1.27 cm automáticamente en la primera línea de cada
          párrafo.
        </Text>
      </Paper>

      <Fieldset
        legend={
          <Text fw={700} size="lg">
            Introducción
          </Text>
        }
        variant="unstyled"
      >
        <Textarea
          label="Redacción de la Introducción"
          placeholder="Comienza a redactar la introducción de tu proyecto de grado..."
          minRows={18} // Un poco más alta ya que suele ser extensa
          autosize
          value={data?.content || ""}
          onChange={(e) =>
            setProjectMetadata(
              "preliminares.introduccion.content",
              e.target.value,
            )
          }
        />
      </Fieldset>
    </Stack>
  );
};

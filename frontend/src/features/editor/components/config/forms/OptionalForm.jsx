// src/features/editor/components/config/forms/OptionalForm.jsx
import React from "react";
import { Stack, Textarea, Fieldset, Text, Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useStore } from "@store";

export const OptionalForm = ({ type = "dedicatoria" }) => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const data = projectMetadata.preliminares[type];

  return (
    <Stack gap="xl">
      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        Esta sección es opcional. Si no deseas incluirla, simplemente déjala
        vacía.
      </Alert>

      <Fieldset
        legend={
          <Text fw={700} size="lg" style={{ textTransform: "capitalize" }}>
            {type}
          </Text>
        }
        variant="unstyled"
      >
        <Textarea
          label={`Contenido de la ${type}`}
          placeholder={`Escribe aquí tu ${type}...`}
          minRows={15}
          autosize
          value={data?.content || ""}
          onChange={(e) =>
            setProjectMetadata(`preliminares.${type}.content`, e.target.value)
          }
        />
      </Fieldset>
    </Stack>
  );
};

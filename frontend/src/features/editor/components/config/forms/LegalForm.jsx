import React from "react";
import { Stack, Text, Alert, Box, Paper } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export const LegalForm = () => {
  return (
    <Stack gap="lg">
      <Alert
        variant="light"
        color="blue"
        title="Nota Importante"
        icon={<IconInfoCircle />}
      >
        Esta sección es obligatoria según el reglamento de la institución y se
        incluirá automáticamente.
      </Alert>

      <Paper withBorder p="md" bg="gray.0">
        <Text size="xs" fw={700} c="dimmed" mb="xs">
          TEXTO DE LA NOTA:
        </Text>
        <Text size="sm" italic style={{ lineHeight: 1.6 }}>
          “Únicamente el graduando es responsable de las ideas expuestas en el
          presente trabajo”. (Lineamientos constitucionales, legales e
          institucionales que rigen la propiedad intelectual).
        </Text>
      </Paper>

      <Text size="sm" c="dimmed">
        * No se requieren campos adicionales para esta sección.
      </Text>
    </Stack>
  );
};

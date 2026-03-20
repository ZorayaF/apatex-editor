import React from "react";
// AÑADIMOS 'Box' AQUÍ ABAJO:
import {
  ScrollArea,
  Title,
  Text,
  TextInput,
  NumberInput,
  Textarea,
  Stack,
  Box,
} from "@mantine/core";
import { InspectorSection } from "./InspectorSection";
import { InspectorField } from "./InspectorField";

export const Inspector = () => {
  return (
    <ScrollArea h="100%" p="md">
      <Title order={4} mb="lg">
        Propiedades
      </Title>

      {/* Sección para Tablas */}
      <InspectorSection title="Configuración de Tabla">
        <InspectorField
          label="Título de la Tabla"
          description="Aparecerá en la parte superior"
        >
          <TextInput placeholder="Ej: Crecimiento Poblacional" />
        </InspectorField>

        <Stack
          gap="xs"
          style={{ display: "flex", flexDirection: "row", gap: "10px" }}
        >
          <InspectorField label="Filas">
            <NumberInput min={1} defaultValue={3} />
          </InspectorField>
          <InspectorField label="Columnas">
            <NumberInput min={1} defaultValue={2} />
          </InspectorField>
        </Stack>
      </InspectorSection>

      {/* Sección para Figuras */}
      <InspectorSection title="Detalles de Figura">
        <InspectorField
          label="Nota de la Figura"
          description="Explicación breve al pie"
        >
          <Textarea
            placeholder="Ej: Datos tomados de la encuesta 2023..."
            autosize
            minRows={2}
          />
        </InspectorField>
      </InspectorSection>

      {/* ESTADO VACÍO (Ahora sí con Box definido) */}
      <Box mt={100} ta="center" style={{ opacity: 0.5 }}>
        <Text size="sm" c="dimmed">
          Selecciona un bloque complejo para editar sus propiedades avanzadas.
        </Text>
      </Box>
    </ScrollArea>
  );
};

// src/features/editor/components/header/index.jsx
import React from "react";
import { Paper, Group, Divider, Box } from "@mantine/core";
import { FormattingGroup } from "./FormattingGroup";
import { ObjectGroup } from "./ObjectGroup";
import { AcademicGroup } from "./AcademicGroup"; // <-- El nuevo integrante

export const Header = () => {
  return (
    <Paper
      h={52}
      px="md"
      pos="sticky"
      top={0}
      shadow="none"
      radius={0}
      withBorder // Una línea sutil para separar el header del papel
      style={{ borderBottom: "1px solid #e9ecef", zIndex: 100 }}
    >
      <Group h="100%" align="center" gap="lg">
        {/* Grupo A: Escritura y Estilos de Párrafo */}
        <Box>
          <FormattingGroup />
        </Box>

        <Divider orientation="vertical" h={24} my="auto" color="gray.3" />

        {/* Grupo B: Inserción de Objetos (Tablas e Imágenes) */}
        <Box>
          <ObjectGroup />
        </Box>

        <Divider orientation="vertical" h={24} my="auto" color="gray.3" />

        {/* Grupo C: Herramientas Bibliográficas APA */}
        <Box>
          <AcademicGroup />
        </Box>
      </Group>
    </Paper>
  );
};

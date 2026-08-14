// src/features/editor/components/writer/inspector/index.jsx
import React from "react";
import { Box, Title, Text, Stack, Center } from "@mantine/core";
import { useStore } from "@store";
import { IconLayout2 } from "@tabler/icons-react";

import { ReferenceForm } from "./forms/reference/ReferenceForm";
import { TableForm } from "./forms/table/TableForm";
import { FigureForm } from "./forms/figure/FigureForm";
import { SourceLibrary } from "./SourceLibrary";

export const Inspector = () => {
  const {
    activeTab,
    selectedBlockId,
    selectedSourceId,
    blocks = [],
  } = useStore();

  const activeBlock = blocks.find((b) => b.id === selectedBlockId);

  // 1. Título dinámico
  const getHeaderTitle = () => {
    if (selectedSourceId) return "Editar Referencia";
    if (activeTab === "library") return "Biblioteca de Fuentes";
    if (activeBlock?.type === "table") return "Propiedades de Tabla";
    if (activeBlock?.type === "figure") return "Propiedades de Figura";
    return "Inspector";
  };

  // 2. Renderizado reactivo inmediato
  const renderContent = () => {
    // Si se hizo clic en una cita o se seleccionó una fuente
    if (selectedSourceId) {
      return <ReferenceForm />;
    }

    // Si se abrió la biblioteca de citas
    if (activeTab === "library") {
      return <SourceLibrary />;
    }

    // Si hay una tabla seleccionada
    if (activeBlock?.type === "table") {
      return <TableForm blockData={activeBlock} />;
    }

    // Si hay una figura seleccionada
    if (activeBlock?.type === "figure") {
      return <FigureForm blockData={activeBlock} />;
    }

    // Estado neutro cuando nada está activo
    return <CleanEmptyState />;
  };

  return (
    <Box
      h="100%"
      w="100%"
      p="xs"
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Title order={5} mb="xs" c="gray.8" px={4} style={{ flexShrink: 0 }}>
        {getHeaderTitle()}
      </Title>

      <Box
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

const CleanEmptyState = () => (
  <Center h="100%" px="md">
    <Stack
      align="center"
      gap="xs"
      c="dimmed"
      style={{ maxWidth: 240, textAlign: "center" }}
    >
      <IconLayout2 size={36} stroke={1.2} style={{ opacity: 0.35 }} />
      <Text size="sm" fw={600} c="gray.7">
        Sin elemento seleccionado
      </Text>
      <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>
        Selecciona una tabla, figura o cita en tu texto para editarla, o añade
        una desde la barra superior.
      </Text>
    </Stack>
  </Center>
);

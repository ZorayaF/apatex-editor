import React from "react";
import { ScrollArea, Title, Text, Box, Center, Stack } from "@mantine/core";
import { useStore } from "@store";
import { IconClick, IconBooks } from "@tabler/icons-react";

import { ReferenceForm } from "./forms/reference/ReferenceForm";
// import { TableForm } from "./forms/table/TableForm";
// import { FigureForm } from "./forms/figure/FigureForm";

export const Inspector = () => {
  // 1. Extraemos los dos tipos de selección posibles
  const { selectedBlockId, selectedSourceId, blocks, sources } = useStore();

  // 2. Buscamos la información activa según lo que esté seleccionado
  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const activeSource = sources?.find((s) => s.id === selectedSourceId);

  // 3. Función para decidir qué formulario mostrar
  const renderActiveForm = () => {
    // PRIORIDAD 1: Estamos creando o editando una fuente desde el Header
    if (selectedSourceId) {
      return <ReferenceForm sourceData={activeSource} />;
    }

    // PRIORIDAD 2: Estamos editando un bloque en el documento
    if (activeBlock) {
      switch (activeBlock.type) {
        case "table":
          return (
            <Box p="md">
              <Text>Formulario de Tabla (Próximamente)</Text>
            </Box>
          );
        case "figure":
          return (
            <Box p="md">
              <Text>Formulario de Figura (Próximamente)</Text>
            </Box>
          );
        default:
          return <DefaultState type={activeBlock.type} />;
      }
    }

    // POR DEFECTO: Nada seleccionado
    return <EmptyState />;
  };

  // Dinamismo para el título según el contexto
  const getTitle = () => {
    if (selectedSourceId) return "Gestor de Referencia";
    if (selectedBlockId) return "Propiedades del Bloque";
    return "Inspector";
  };

  return (
    <ScrollArea h="100%" p="md" scrollbarSize={8}>
      <Title order={4} mb="lg" c="gray.7">
        {getTitle()}
      </Title>

      {renderActiveForm()}
    </ScrollArea>
  );
};

// --- COMPONENTES AUXILIARES ACTUALIZADOS ---

const EmptyState = () => (
  <Center h={300}>
    <Stack align="center" gap="xs" style={{ opacity: 0.4 }}>
      <IconClick size={48} stroke={1.5} />
      <Text size="sm" ta="center" px="xl">
        Selecciona un bloque o añade una nueva referencia para ver opciones.
      </Text>
    </Stack>
  </Center>
);

const DefaultState = ({ type }) => (
  <Box p="md" ta="center" style={{ opacity: 0.6 }}>
    <Text size="sm">
      El bloque de tipo <b>{type}</b> no requiere configuración adicional.
    </Text>
  </Box>
);

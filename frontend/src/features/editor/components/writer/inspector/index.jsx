import React from "react";
import {
  ScrollArea,
  Title,
  Text,
  Box,
  Stack,
  Tabs,
  Center,
} from "@mantine/core";
import { useStore } from "@store";
import { IconSettings, IconBooks, IconLayout2 } from "@tabler/icons-react";

import { ReferenceForm } from "./forms/reference/ReferenceForm";
import { TableForm } from "./forms/table/TableForm";
import { FigureForm } from "./forms/figure/FigureForm";
import { SourceLibrary } from "./SourceLibrary";

export const Inspector = () => {
  const { activeTab, setActiveTab, selectedBlockId, selectedSourceId, blocks } =
    useStore();

  const activeBlock = blocks.find((b) => b.id === selectedBlockId);

  // Pestaña Diseño: Sólo se activa con un bloque específico
  const renderPropertiesTab = () => {
    if (activeBlock?.type === "table") {
      return <TableForm blockData={activeBlock} />;
    }

    if (activeBlock?.type === "figure") {
      return <FigureForm blockData={activeBlock} />;
    }

    return <EmptySelectionState />;
  };

  // Pestaña Fuentes: Lista o Formulario de Referencia
  const renderLibraryTab = () => {
    if (selectedSourceId) return <ReferenceForm />;
    return <SourceLibrary />;
  };

  return (
    <Box h="100%" style={{ display: "flex", flexDirection: "column" }}>
      <Tabs
        variant="pills"
        value={activeTab}
        onChange={setActiveTab}
        p="md"
        styles={{
          root: { display: "flex", flexDirection: "column", height: "100%" },
          panel: {
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Title order={4} mb="lg" c="gray.7" px="xs">
          {activeTab === "properties" ? "Propiedades" : "Gestor Bibliográfico"}
        </Title>

        <Tabs.List grow mb="md">
          <Tabs.Tab value="properties" leftSection={<IconSettings size={16} />}>
            Diseño
          </Tabs.Tab>
          <Tabs.Tab value="library" leftSection={<IconBooks size={16} />}>
            Fuentes
          </Tabs.Tab>
        </Tabs.List>

        {/* Paneles ocupando el 100% de la altura disponible */}
        <Tabs.Panel value="properties" style={{ height: "100%" }}>
          {renderPropertiesTab()}
        </Tabs.Panel>
        <Tabs.Panel value="library" style={{ height: "100%" }}>
          {renderLibraryTab()}
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

// Estado cuando no hay ninguna Tabla ni Figura seleccionada
const EmptySelectionState = () => {
  return (
    <Center h={300} px="md">
      <Stack align="center" gap="sm" c="dimmed">
        <IconLayout2 size={36} stroke={1.5} style={{ opacity: 0.4 }} />
        <Text size="sm" fw={600} ta="center">
          Ningún elemento seleccionado
        </Text>
        <Text size="xs" ta="center" c="dimmed">
          Haz clic sobre una tabla o figura en el documento para ajustar sus
          propiedades de formato APA.
        </Text>
      </Stack>
    </Center>
  );
};

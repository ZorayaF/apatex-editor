import React from "react";
import {
  ScrollArea,
  Title,
  Text,
  Box,
  Stack,
  Tabs,
  Button,
} from "@mantine/core";
import { useStore } from "@store";
import {
  IconClick,
  IconSettings,
  IconBooks,
  IconTable,
  IconPhoto,
  IconFilePlus,
} from "@tabler/icons-react";

// --- IMPORTACIÓN DE FORMULARIOS ---
import { ReferenceForm } from "./forms/reference/ReferenceForm";
import { TableForm } from "./forms/table/TableForm";
import { FigureForm } from "./forms/figure/FigureForm"; // <--- Nueva importación
import { SourceLibrary } from "./SourceLibrary";

export const Inspector = () => {
  const { activeTab, setActiveTab, selectedBlockId, selectedSourceId, blocks } =
    useStore();

  const activeBlock = blocks.find((b) => b.id === selectedBlockId);

  // --- RENDERIZADO DE PESTAÑA: PROPIEDADES ---
  const renderPropertiesTab = () => {
    // 1. Caso Tabla
    if (activeBlock?.type === "table") {
      return <TableForm blockData={activeBlock} />;
    }

    // 2. Caso Figura (Ya no es próximamente)
    if (activeBlock?.type === "figure") {
      return <FigureForm blockData={activeBlock} />;
    }

    // 3. Caso por defecto (Toolbox)
    return <Toolbox />;
  };

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
          root: { display: "flex", flexDirection: "column", flex: 1 },
          panel: { flex: 1, overflow: "hidden" },
        }}
      >
        <Title order={4} mb="lg" c="gray.7" px="xs">
          {activeTab === "properties"
            ? "Diseño y Herramientas"
            : "Gestor Bibliográfico"}
        </Title>

        <Tabs.List grow mb="md">
          <Tabs.Tab value="properties" leftSection={<IconSettings size={16} />}>
            Diseño
          </Tabs.Tab>
          <Tabs.Tab value="library" leftSection={<IconBooks size={16} />}>
            Fuentes
          </Tabs.Tab>
        </Tabs.List>

        <ScrollArea h="calc(100vh - 200px)" scrollbarSize={6} offsetScrollbars>
          <Tabs.Panel value="properties">{renderPropertiesTab()}</Tabs.Panel>
          <Tabs.Panel value="library">{renderLibraryTab()}</Tabs.Panel>
        </ScrollArea>
      </Tabs>
    </Box>
  );
};

// --- LA CAJA DE HERRAMIENTAS (Toolbox) ---

const Toolbox = () => {
  const { setActiveTab, addAndEditSource, addBlock } = useStore();

  return (
    <Stack gap="xl" px="md" mt="xl">
      <Stack align="center" gap="xs" style={{ opacity: 0.4 }}>
        <IconClick size={40} stroke={1.5} />
        <Text size="xs" fw={700} tt="uppercase" lts={1}>
          Insertar Elementos
        </Text>
      </Stack>

      <Stack gap="sm" w="100%">
        <Button
          variant="light"
          color="gray"
          leftSection={<IconTable size={18} />}
          fullWidth
          justify="flex-start"
          onClick={() => addBlock("table")}
        >
          Insertar Tabla APA
        </Button>
        <Button
          variant="light"
          color="gray"
          leftSection={<IconPhoto size={18} />}
          fullWidth
          justify="flex-start"
          onClick={() => addBlock("figure")}
        >
          Insertar Figura o Imagen
        </Button>
        <Button
          variant="filled"
          color="blue"
          leftSection={<IconFilePlus size={18} />}
          fullWidth
          justify="flex-start"
          onClick={() => {
            addAndEditSource("articulo");
            setActiveTab("library");
          }}
        >
          Nueva Referencia
        </Button>
      </Stack>

      <Text size="xs" c="dimmed" ta="center" mt="md" px="xs">
        Selecciona un elemento en el lienzo para ajustar sus propiedades
        específicas.
      </Text>
    </Stack>
  );
};

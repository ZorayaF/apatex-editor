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

// 1. Importamos el nuevo formulario
import { ReferenceForm } from "./forms/reference/ReferenceForm";
import { TableForm } from "./forms/table/TableForm"; // Asegúrate de que la ruta sea correcta
import { SourceLibrary } from "./SourceLibrary";

export const Inspector = () => {
  const { activeTab, setActiveTab, selectedBlockId, selectedSourceId, blocks } =
    useStore();

  const activeBlock = blocks.find((b) => b.id === selectedBlockId);

  // --- RENDERIZADO DE PESTAÑA: PROPIEDADES ---
  const renderPropertiesTab = () => {
    // Si el bloque es una tabla, cargamos su formulario real
    if (activeBlock?.type === "table") {
      return <TableForm blockData={activeBlock} />;
    }

    if (activeBlock?.type === "figure") {
      return (
        <Box p="md">
          <Text fw={600} size="sm" mb="xs">
            Configuración de Figura
          </Text>
          <Text size="xs" c="dimmed">
            Formulario de Figura (Próximamente)
          </Text>
        </Box>
      );
    }

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
          onClick={() => addBlock("table")} // 2. ¡Ya funciona!
        >
          Insertar Tabla APA
        </Button>
        <Button
          variant="light"
          color="gray"
          leftSection={<IconPhoto size={18} />}
          fullWidth
          justify="flex-start"
          onClick={() => addBlock("figure")} // 3. ¡Ya funciona!
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

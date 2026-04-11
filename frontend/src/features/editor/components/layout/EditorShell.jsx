import React, { useState } from "react";
import {
  AppShell,
  ActionIcon,
  Tooltip,
  Group,
  ScrollArea,
  Box,
  Tabs,
  Text,
  Stack,
} from "@mantine/core";
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconEdit,
  IconLayoutBoard,
  IconBooks,
} from "@tabler/icons-react";

// Componentes
import { Header } from "../header";
import { Canvas } from "../canvas/Canvas";
import { Inspector } from "@inspector";
import { DocumentMap } from "../navbar/DocumentMap";
import { BibliographyView } from "../views/BibliographyView"; // Asegúrate de crear esta ruta

// Store y Estilos
import { useStore } from "@store";
import "../../styles/editor.css";

export const EditorShell = () => {
  const [activeTab, setActiveTab] = useState("redaccion");

  const { isNavbarOpen, setNavbarOpen, isInspectorOpen, setInspectorOpen } =
    useStore();

  // Determinamos si los paneles deben estar ocultos por la pestaña activa
  const showPanels = activeTab === "redaccion";

  return (
    <AppShell
      header={{ height: 70 }} // Aumentamos un poco para acomodar las pestañas
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: {
          desktop: !isNavbarOpen || !showPanels,
          mobile: !isNavbarOpen || !showPanels,
        },
      }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: {
          desktop: !isInspectorOpen || !showPanels,
          mobile: !isInspectorOpen || !showPanels,
        },
      }}
      padding="0" // Manejamos el padding interno nosotros
    >
      <AppShell.Header style={{ zIndex: 102 }}>
        <Stack gap={0} h="100%">
          <Group
            h="100%"
            px="md"
            justify="space-between"
            align="center"
            wrap="nowrap"
          >
            {/* LADO IZQUIERDO: Toggle + Marca */}
            <Group gap="xs">
              {showPanels && (
                <Tooltip label={isNavbarOpen ? "Ocultar mapa" : "Mostrar mapa"}>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    onClick={() => setNavbarOpen(!isNavbarOpen)}
                  >
                    {isNavbarOpen ? (
                      <IconLayoutSidebarLeftCollapse size={22} />
                    ) : (
                      <IconLayoutSidebarLeftExpand size={22} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
              <Text fw={900} size="xl" c="blue">
                VARPA
              </Text>
            </Group>

            {/* CENTRO: Navegación por Pestañas */}
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              variant="pills"
              radius="xl"
              size="sm"
            >
              <Tabs.List>
                <Tabs.Tab
                  value="redaccion"
                  leftSection={<IconEdit size={16} />}
                >
                  Redacción
                </Tabs.Tab>
                <Tabs.Tab
                  value="estructura"
                  leftSection={<IconLayoutBoard size={16} />}
                  disabled
                >
                  Estructura
                </Tabs.Tab>
                <Tabs.Tab
                  value="referencias"
                  leftSection={<IconBooks size={16} />}
                >
                  Referencias
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            {/* LADO DERECHO: Toggle Inspector */}
            <Group gap="xs">
              {showPanels && (
                <Tooltip
                  label={
                    isInspectorOpen
                      ? "Ocultar propiedades"
                      : "Mostrar propiedades"
                  }
                >
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    onClick={() => setInspectorOpen(!isInspectorOpen)}
                  >
                    {isInspectorOpen ? (
                      <IconLayoutSidebarRightCollapse size={22} />
                    ) : (
                      <IconLayoutSidebarRightExpand size={22} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Group>

          {/* BARRA DE HERRAMIENTAS: Solo visible en Redacción */}
          {showPanels && (
            <Box
              px="md"
              pb="xs"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Header />
            </Box>
          )}
        </Stack>
      </AppShell.Header>

      <AppShell.Navbar>
        <DocumentMap />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.2">
        <ScrollArea
          h={showPanels ? "calc(100vh - 100px)" : "calc(100vh - 70px)"}
          scrollbarSize={12}
          offsetScrollbars
        >
          {activeTab === "redaccion" ? (
            <Box
              py={60}
              px={40}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "40px",
              }}
            >
              <Canvas />
            </Box>
          ) : activeTab === "referencias" ? (
            <BibliographyView />
          ) : (
            <Box p="xl">
              <Text>Estructura del Proyecto (Próximamente)</Text>
            </Box>
          )}
        </ScrollArea>
      </AppShell.Main>

      <AppShell.Aside style={{ zIndex: 101 }}>
        <Inspector />
      </AppShell.Aside>
    </AppShell>
  );
};

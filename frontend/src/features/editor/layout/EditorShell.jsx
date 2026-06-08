import React, { useState } from "react";
import {
  AppShell,
  ActionIcon,
  Group,
  Box,
  Tabs,
  Text,
  Button,
} from "@mantine/core";
import { notifications } from "@mantine/notifications"; // Importante para los avisos
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconEdit,
  IconLayoutBoard,
  IconDownload,
  IconDeviceFloppy, // Ícono de guardado
} from "@tabler/icons-react";

import { useStore } from "@store";
import { Inspector } from "@writer/inspector";
import { DocumentMap } from "@writer/navbar/DocumentMap";
import "@editor/styles/editor.css";

// VISTAS PRINCIPALES
import { ConfigurationView } from "@editor/views/ConfigurationView";
import { WritingView } from "@editor/views/WritingView";
import { ExportView } from "@editor/views/ExportView";

export const EditorShell = () => {
  const [activeTab, setActiveTab] = useState("configurar");
  const [isSaving, setIsSaving] = useState(false); // Estado de carga del guardado

  const { isNavbarOpen, setNavbarOpen, isInspectorOpen, setInspectorOpen } =
    useStore();

  const isWritingMode = activeTab === "redaccion";

  // --- LÓGICA DE GUARDADO GLOBAL ---
  const handleSaveProject = async () => {
    setIsSaving(true);

    const currentState = useStore.getState();
    const payload = {
      blocks: currentState.blocks,
      pages: currentState.pages,
      projectMetadata: currentState.projectMetadata,
      sources: currentState.sources,
    };

    if (window.electronAPI) {
      const response = await window.electronAPI.saveProject(payload);

      if (response.success) {
        notifications.show({
          title: "Proyecto Guardado",
          message: "Tu documento se guardó correctamente.",
          color: "green",
        });
      } else if (response.error) {
        notifications.show({
          title: "Error al guardar",
          message: response.error,
          color: "red",
        });
      }
    } else {
      notifications.show({
        title: "Modo Web",
        message: "El guardado en disco solo funciona en la app de escritorio.",
        color: "orange",
      });
    }

    setIsSaving(false);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { desktop: !isNavbarOpen || !isWritingMode },
      }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: !isInspectorOpen || !isWritingMode },
      }}
    >
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between">
          {/* LADO IZQUIERDO: Logo y Toggle del Navbar */}
          <Group gap="xs">
            {isWritingMode && (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setNavbarOpen(!isNavbarOpen)}
              >
                {isNavbarOpen ? (
                  <IconLayoutSidebarLeftCollapse size={20} />
                ) : (
                  <IconLayoutSidebarLeftExpand size={20} />
                )}
              </ActionIcon>
            )}
            <Text fw={900} size="xl" c="blue" style={{ letterSpacing: "-1px" }}>
              APATEX
            </Text>
          </Group>

          {/* CENTRO: Navegación de Pestañas */}
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            radius="xl"
            size="sm"
          >
            <Tabs.List>
              <Tabs.Tab
                value="configurar"
                leftSection={<IconLayoutBoard size={16} />}
              >
                Configurar
              </Tabs.Tab>
              <Tabs.Tab value="redaccion" leftSection={<IconEdit size={16} />}>
                Redactar
              </Tabs.Tab>
              <Tabs.Tab
                value="exportar"
                leftSection={<IconDownload size={16} />}
              >
                Exportar
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          {/* LADO DERECHO: Botón Guardar y Toggle del Inspector */}
          <Group gap="xs">
            {/* NUEVO: Botón de Guardado Global */}
            <Button
              size="xs"
              variant="light"
              leftSection={<IconDeviceFloppy size={16} />}
              loading={isSaving}
              onClick={handleSaveProject}
            >
              Guardar
            </Button>

            {isWritingMode && (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setInspectorOpen(!isInspectorOpen)}
              >
                {isInspectorOpen ? (
                  <IconLayoutSidebarRightCollapse size={20} />
                ) : (
                  <IconLayoutSidebarRightExpand size={20} />
                )}
              </ActionIcon>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="0">
        <DocumentMap />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.1">
        <Box
          style={{
            height: "calc(100vh - 60px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {activeTab === "configurar" && <ConfigurationView />}
          {activeTab === "redaccion" && <WritingView />}
          {activeTab === "exportar" && <ExportView />}
        </Box>
      </AppShell.Main>

      <AppShell.Aside>
        <Inspector />
      </AppShell.Aside>
    </AppShell>
  );
};

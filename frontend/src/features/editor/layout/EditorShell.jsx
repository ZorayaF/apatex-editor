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
  IconFolderOpen,
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

  const [loadKey, setLoadKey] = useState(0);
  const {
    isNavbarOpen,
    setNavbarOpen,
    isInspectorOpen,
    setInspectorOpen,
    currentFilePath,
    setCurrentFilePath,
  } = useStore();

  const isWritingMode = activeTab === "redaccion";

  // --- LÓGICA DE GUARDADO GLOBAL ---
  const handleSaveProject = async (isSaveAs = false) => {
    setIsSaving(true);
    const currentState = useStore.getState();

    // Empaquetamos los datos Y las instrucciones de guardado
    const payload = {
      projectData: {
        blocks: currentState.blocks,
        pages: currentState.pages,
        projectMetadata: currentState.projectMetadata,
        sources: currentState.sources,
      },
      filePath: currentState.currentFilePath, // Si es null, Electron pedirá la ruta
      isSaveAs: isSaveAs, // Si es true, Electron forzará la ventana de diálogo
    };

    if (window.electronAPI) {
      const response = await window.electronAPI.saveProject(payload);

      if (response.success) {
        // Actualizamos el store con la ruta (por si era un archivo nuevo)
        useStore.setState({ currentFilePath: response.filePath });
        notifications.show({
          title: "Guardado",
          message: "Progreso asegurado.",
          color: "green",
        });
      } else if (response.error) {
        notifications.show({
          title: "Error",
          message: response.error,
          color: "red",
        });
      }
    }
    setIsSaving(false);
  };
  // --- LÓGICA DE APERTURA GLOBAL ---
  const handleOpenProject = async () => {
    if (window.electronAPI) {
      const response = await window.electronAPI.openProject();

      if (response.success && response.projectData) {
        useStore.setState({
          blocks: response.projectData.blocks || [],
          pages: response.projectData.pages || [{ id: "p1", blockIds: [] }],
          projectMetadata: response.projectData.projectMetadata,
          sources: response.projectData.sources || [],
          activePageIndex: 0,
          selectedBlockId: null,
          focusedChapterId: null,
          currentFilePath: response.filePath,
        });

        // 2. NUEVO: Cambiamos la llave para obligar a React a repintar todo
        setLoadKey((prev) => prev + 1);

        notifications.show({
          title: "Proyecto Cargado",
          message: "Tu documento se ha cargado con éxito.",
          color: "blue",
          icon: <IconFolderOpen size={16} />,
        });
      } else if (response.error) {
        notifications.show({
          title: "Error al abrir",
          message: response.error,
          color: "red",
        });
      }
    } else {
      notifications.show({
        title: "Modo Web",
        message: "La carga de archivos nativos solo funciona en escritorio.",
        color: "orange",
      });
    }
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
            {/* NUEVO: Botón de Abrir */}
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              leftSection={<IconFolderOpen size={16} />}
              onClick={handleOpenProject}
            >
              Abrir
            </Button>

            {/* GUARDAR NORMAL (Ctrl+S) */}
            <Button
              size="xs"
              variant="light"
              color="blue"
              leftSection={<IconDeviceFloppy size={16} />}
              loading={isSaving}
              onClick={() => handleSaveProject(false)}
            >
              Guardar
            </Button>

            {/* GUARDAR COMO (Duplicar) */}
            <Button
              size="xs"
              variant="subtle"
              color="blue"
              loading={isSaving}
              onClick={() => handleSaveProject(true)}
            >
              Guardar como...
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
          // 3. NUEVO: React destruirá este Box y su contenido cada vez que el loadKey cambie
          key={loadKey}
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

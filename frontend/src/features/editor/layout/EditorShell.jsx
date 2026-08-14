// src/features/editor/layout/EditorShell.jsx
import React, { useState } from "react";
import { AppShell, Group, Box, Tabs, Text, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconLayoutBoard,
  IconDownload,
  IconDeviceFloppy,
  IconFolderOpen,
} from "@tabler/icons-react";

import { useStore } from "../store";
import "@editor/styles/editor.css";

import { ConfigurationView } from "@editor/views/ConfigurationView";
import { WritingView } from "@editor/views/WritingView";
import { ExportView } from "@editor/views/ExportView";

export const EditorShell = () => {
  const [activeTab, setActiveTab] = useState("configurar");
  const [isSaving, setIsSaving] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  const handleSaveProject = async (isSaveAs = false) => {
    setIsSaving(true);
    const currentState = useStore.getState();

    const payload = {
      projectData: {
        blocks: currentState.blocks,
        pages: currentState.pages,
        projectMetadata: currentState.projectMetadata,
        sources: currentState.sources,
      },
      filePath: currentState.currentFilePath,
      isSaveAs: isSaveAs,
    };

    if (window.electronAPI) {
      const response = await window.electronAPI.saveProject(payload);

      if (response.success) {
        useStore.setState({ currentFilePath: response.filePath });
        notifications.show({
          id: "save-success",
          message: "Documento guardado correctamente",
          color: "teal",
          autoClose: 1800,
          withCloseButton: false,
        });
      } else if (response.error) {
        notifications.show({
          id: "save-error",
          message: response.error,
          color: "red",
          autoClose: 3500,
          withCloseButton: false,
        });
      }
    }
    setIsSaving(false);
  };

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

        setLoadKey((prev) => prev + 1);

        notifications.show({
          id: "open-success",
          message: "Proyecto cargado con éxito",
          color: "blue",
          autoClose: 1800,
          withCloseButton: false,
        });
      }
    }
  };

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      {/* 1. HEADER GLOBAL (100% fijo de borde a borde) */}
      <AppShell.Header px="md" style={{ width: "100%" }}>
        <Group h="100%" justify="space-between">
          <Text fw={900} size="xl" c="blue" style={{ letterSpacing: "-1px" }}>
            APATEX
          </Text>

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

          <Group gap="xs">
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              leftSection={<IconFolderOpen size={16} />}
              onClick={handleOpenProject}
            >
              Abrir
            </Button>
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
            <Button
              size="xs"
              variant="subtle"
              color="blue"
              loading={isSaving}
              onClick={() => handleSaveProject(true)}
            >
              Guardar como...
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <AppShell.Main
        bg="gray.1"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          key={loadKey}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
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
    </AppShell>
  );
};

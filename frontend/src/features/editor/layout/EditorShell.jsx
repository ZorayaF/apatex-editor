import React, { useState } from "react";
import { AppShell, ActionIcon, Group, Box, Tabs, Text } from "@mantine/core";
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconEdit,
  IconLayoutBoard,
  IconDownload,
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
  // Empezamos en Configurar para que el usuario defina su identidad primero
  const [activeTab, setActiveTab] = useState("configurar");

  const { isNavbarOpen, setNavbarOpen, isInspectorOpen, setInspectorOpen } =
    useStore();

  const isWritingMode = activeTab === "redaccion";

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

          {/* NAVEGACIÓN SIMPLIFICADA: 3 PESTAÑAS */}
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
        {/* Contenedor rígido para habilitar scrolls internos en las vistas */}
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

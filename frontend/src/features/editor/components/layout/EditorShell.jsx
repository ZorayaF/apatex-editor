// src/features/editor/layout/EditorShell.jsx
import React from "react";
import {
  AppShell,
  ActionIcon,
  Tooltip,
  Group,
  ScrollArea,
  Box,
} from "@mantine/core";
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { Header } from "../header";
import { Canvas } from "../canvas/Canvas";
import { Inspector } from "@inspector";
import { useStore } from "@store";
import { DocumentMap } from "../navbar/DocumentMap";
import { APA_CONFIG } from "@core/utils/measurements";
import "../../styles/editor.css";

export const EditorShell = () => {
  // Traemos los estados y las funciones para abrir/cerrar ambos paneles
  const { isNavbarOpen, setNavbarOpen, isInspectorOpen, setInspectorOpen } =
    useStore();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { desktop: !isNavbarOpen, mobile: !isNavbarOpen },
      }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: !isInspectorOpen, mobile: !isInspectorOpen },
      }}
      padding="md"
    >
      <AppShell.Header style={{ zIndex: 102 }}>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          align="center"
          wrap="nowrap"
        >
          {/* 1. LADO IZQUIERDO: Toggle del Mapa del Documento */}
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

          {/* 2. CENTRO: Tus herramientas principales (Formatting, Objects, etc.) */}
          <Box style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Header />
          </Box>

          {/* 3. LADO DERECHO: Toggle del Inspector de Propiedades */}
          <Tooltip
            label={
              isInspectorOpen ? "Ocultar propiedades" : "Mostrar propiedades"
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
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <DocumentMap />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.2">
        <ScrollArea h="calc(100vh - 60px)" scrollbarSize={12} offsetScrollbars>
          <Box
            py={60}
            px={40} // Bajé un poco el padding lateral para que no se vea tan apretado
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px",
            }}
          >
            <Canvas />
          </Box>
        </ScrollArea>
      </AppShell.Main>

      <AppShell.Aside style={{ zIndex: 101 }}>
        <Inspector />
      </AppShell.Aside>
    </AppShell>
  );
};
